from aws_cdk import (
    Stack,
    aws_cognito as cognito,
    aws_dynamodb as ddb,
    aws_s3 as s3,
    RemovalPolicy,
    CfnOutput
)
from constructs import Construct

class RoofwiseInfrastructureStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 1. Cognito User Pool (Authenticated Users)
        user_pool = cognito.UserPool(
            self, "RoofwiseUserPool",
            user_pool_name="roofwise-user-pool",
            self_sign_up_enabled=True,
            sign_in_aliases=cognito.SignInAliases(email=True),
            standard_attributes=cognito.StandardAttributes(
                email=cognito.StandardAttribute(required=True, mutable=True)
            ),
            removal_policy=RemovalPolicy.DESTROY
        )

        user_pool_client = user_pool.add_client(
            "RoofwiseWebClient",
            user_pool_client_name="roofwise-web-client",
            generate_secret=False,
            o_auth=cognito.OAuthSettings(
                flows=cognito.OAuthFlows(authorization_code_grant=True),
                scopes=[
                    cognito.OAuthScope.EMAIL,
                    cognito.OAuthScope.OPENID,
                    cognito.OAuthScope.PROFILE
                ],
                callback_urls=["http://localhost:5173/auth/callback"],
                logout_urls=["http://localhost:5173/"]
            )
        )

        # 2. Cognito Identity Pool (Supports Anonymous & Authenticated Multi-Tenant Isolation)
        identity_pool = cognito.CfnIdentityPool(
            self, "RoofwiseIdentityPool",
            identity_pool_name="roofwise-identity-pool",
            allow_unauthenticated_identities=True,
            cognito_identity_providers=[
                cognito.CfnIdentityPool.CognitoIdentityProviderProperty(
                    client_id=user_pool_client.user_pool_client_id,
                    provider_name=user_pool.user_pool_provider_name
                )
            ]
        )

        # 3. DynamoDB Table (User-Partitioned Simulation Runs)
        # Partition Key: user_id (Cognito sub / IdentityId)
        # Sort Key: run_id
        table = ddb.Table(
            self, "RoofwiseSimulationRuns",
            table_name="roofwise_simulation_runs",
            partition_key=ddb.Attribute(name="user_id", type=ddb.AttributeType.STRING),
            sort_key=ddb.Attribute(name="run_id", type=ddb.AttributeType.STRING),
            billing_mode=ddb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY
        )

        table.add_global_secondary_index(
            index_name="created_at_index",
            partition_key=ddb.Attribute(name="user_id", type=ddb.AttributeType.STRING),
            sort_key=ddb.Attribute(name="created_at", type=ddb.AttributeType.STRING)
        )

        # 4. S3 Bucket (Per-User JSON Report Storage)
        bucket = s3.Bucket(
            self, "RoofwiseRunsBucket",
            bucket_name="roofwise-runs-storage",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            encryption=s3.BucketEncryption.S3_MANAGED,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True
        )

        # Stack Outputs
        CfnOutput(self, "UserPoolId", value=user_pool.user_pool_id)
        CfnOutput(self, "UserPoolClientId", value=user_pool_client.user_pool_client_id)
        CfnOutput(self, "IdentityPoolId", value=identity_pool.ref)
        CfnOutput(self, "DynamoDBTableName", value=table.table_name)
        CfnOutput(self, "S3BucketName", value=bucket.bucket_name)
