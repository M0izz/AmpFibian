import os
import jwt
import requests
from functools import lru_cache
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException

COGNITO_REGION = os.getenv("AWS_REGION", "ap-south-1")
IDENTITY_POOL_ID = os.getenv("COGNITO_IDENTITY_POOL_ID", "")
USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID", "")

@lru_cache(maxsize=4)
def get_cognito_jwks(issuer_url: str) -> Optional[Dict[str, Any]]:
    try:
        url = f"{issuer_url.rstrip('/')}/.well-known/jwks.json"
        res = requests.get(url, timeout=4)
        if res.status_code == 200:
            return res.json()
    except Exception as e:
        print(f"[Auth] Notice: Could not retrieve JWKS from {issuer_url}: {e}")
    return None

def get_current_user_id(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
) -> str:
    """
    Extracts isolated user identity for multi-tenant isolation.
    - If Cognito User Pool JWT or Cognito IdentityId token is passed in Authorization header:
      verifies token and extracts the unique Cognito subject/identity ID.
    - If X-User-Id header is passed (for anonymous session token or frontend client), uses it.
    - Gracefully defaults to 'anon_default_user' when no header is supplied in local mode.
    """
    if x_user_id and x_user_id.strip():
        return x_user_id.strip()

    if not authorization or not authorization.strip():
        return "anon_default_user"

    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        return "anon_default_user"

    # Attempt to decode JWT claims
    try:
        # Check if AWS User Pool is configured for cryptographic signature validation
        if USER_POOL_ID:
            issuer = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"
            jwks = get_cognito_jwks(issuer)
            if jwks and "keys" in jwks:
                headers = jwt.get_unverified_header(token)
                kid = headers.get("kid")
                key = next((k for k in jwks["keys"] if k.get("kid") == kid), None)
                if key:
                    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                    payload = jwt.decode(
                        token,
                        public_key,
                        algorithms=["RS256"],
                        options={"verify_aud": False}
                    )
                    return str(payload.get("sub", "anon_default_user"))

        # Fallback to claims decode for dev/unauthenticated sessions
        unverified = jwt.decode(token, options={"verify_signature": False})
        sub = unverified.get("sub") or unverified.get("identityId") or unverified.get("id")
        if sub:
            return str(sub)
    except Exception:
        # If token is opaque or raw string identity
        if len(token) > 5 and not token.startswith("ey"):
            return token

    return "anon_default_user"
