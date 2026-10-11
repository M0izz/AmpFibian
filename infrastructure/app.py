#!/usr/bin/env python3
import os
import aws_cdk as cdk
from stack import RoofwiseInfrastructureStack

app = cdk.App()
RoofwiseInfrastructureStack(
    app, "RoofwiseInfrastructureStack",
    env=cdk.Environment(
        account=os.getenv("CDK_DEFAULT_ACCOUNT"),
        region=os.getenv("CDK_DEFAULT_REGION", "ap-south-1")
    )
)

app.synth()
