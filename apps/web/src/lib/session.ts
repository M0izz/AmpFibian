import { CognitoIdentityClient, GetIdCommand, GetOpenIdTokenCommand } from "@aws-sdk/client-cognito-identity";

const REGION = import.meta.env.VITE_AWS_REGION || "ap-south-1";
const IDENTITY_POOL_ID = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;

let cognitoClient: CognitoIdentityClient | null = null;
if (IDENTITY_POOL_ID) {
  try {
    cognitoClient = new CognitoIdentityClient({ region: REGION });
  } catch (err) {
    console.warn("[Session] Could not initialize Cognito client, using local isolated identity:", err);
  }
}

/**
 * Returns a cryptographically unique or stable anonymous identity.
 * If AWS Cognito Identity Pool ID is configured, retrieves and signs an IdentityId with AWS.
 * Otherwise, generates and caches a stable cryptographic browser UUID in localStorage.
 */
export async function getAnonymousIdentity(): Promise<{ identityId: string; token: string }> {
  // 1. Check local cache
  const cachedId = localStorage.getItem('roofwise_identity_id');
  const cachedToken = localStorage.getItem('roofwise_identity_token');

  if (cachedId && cachedToken) {
    return { identityId: cachedId, token: cachedToken };
  }

  // 2. If AWS Cognito client is configured, obtain identity from AWS
  if (cognitoClient && IDENTITY_POOL_ID) {
    try {
      let identityId = cachedId;
      if (!identityId) {
        const idRes = await cognitoClient.send(new GetIdCommand({ IdentityPoolId: IDENTITY_POOL_ID }));
        identityId = idRes.IdentityId || '';
      }

      if (identityId) {
        const tokenRes = await cognitoClient.send(new GetOpenIdTokenCommand({ IdentityId: identityId }));
        const token = tokenRes.Token || identityId;

        localStorage.setItem('roofwise_identity_id', identityId);
        if (tokenRes.Token) {
          localStorage.setItem('roofwise_identity_token', tokenRes.Token);
        }

        return { identityId, token };
      }
    } catch (err) {
      console.warn("[Session] Cognito request failed, falling back to local isolated identity:", err);
    }
  }

  // 3. Fallback: generate stable isolated local identity
  const localId = cachedId || `anon_${crypto.randomUUID()}`;
  localStorage.setItem('roofwise_identity_id', localId);
  localStorage.setItem('roofwise_identity_token', localId);

  return { identityId: localId, token: localId };
}

/**
 * Injects user isolation headers into API requests
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { identityId, token } = await getAnonymousIdentity();
    return {
      'Authorization': `Bearer ${token}`,
      'X-User-Id': identityId,
      'Content-Type': 'application/json'
    };
  } catch {
    return {
      'Content-Type': 'application/json'
    };
  }
}

export function clearSession(): void {
  localStorage.removeItem('roofwise_identity_id');
  localStorage.removeItem('roofwise_identity_token');
}
