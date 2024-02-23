import { Stack, StackProps } from "aws-cdk-lib";
import { CfnService } from "aws-cdk-lib/aws-apprunner";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface BareMetalAppRunnerStackProps extends StackProps {
  applicationName: string;
  applicationPort: number;
  healthCheckPath?: string;
}

export class BareMetalAppRunnerStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: BareMetalAppRunnerStackProps
  ) {
    super(scope, id, props);

    const { account, region } = Stack.of(this);
    const { applicationName, applicationPort, healthCheckPath } = props;

    const { roleArn } = new Role(this, "access_role", {
      assumedBy: new ServicePrincipal("build.apprunner.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSAppRunnerServicePolicyForECRAccess"
        ),
      ],
    });
    new CfnService(this, "service", {
      serviceName: applicationName,
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: roleArn,
        },
        imageRepository: {
          imageIdentifier: `${account}.dkr.ecr.${region}.amazonaws.com/${applicationName}:latest`,
          imageRepositoryType: "ECR",
          imageConfiguration: { port: `${applicationPort}` },
        },
      },
      healthCheckConfiguration: {
        path: healthCheckPath || "/",
      },
    });

    // Custom domain does not currently work, but will when we figure it out.
    // It looks like the cert must contain the AWS domain and we can't mint the cert to match
    //
    // So creating a custom apex domain in the console works, but custom subdomain does not
    //
    //       const endpoint = subDomainName
    //       ? subDomainName + "." + domainName
    //       : domainName;
    //
    // const { hostedZone } = new BareMetalCertificate(this, "certificate", {
    //     domainName,
    //     subDomainName,
    // });

    // new ARecord(this, "alias", {
    //     recordName: endpoint,
    //     zone: hostedZone,
    //     target: RecordTarget.fromAlias(new AliasTargetInstance)
    // });
  }
}
