import { Stack, StackProps } from "aws-cdk-lib";
import { CfnService } from "aws-cdk-lib/aws-apprunner";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";

export interface BareMetalApplicationAppRunnerHardwareStackProps
  extends StackProps {
  applicationName: string;
  applicationPort: number;
  healthCheckPath?: string;
}

export class BareMetalApplicationAppRunnerHardwareStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: BareMetalApplicationAppRunnerHardwareStackProps
  ) {
    super(scope, id, props);

    const { applicationName, applicationPort, healthCheckPath } = props;

    const { roleArn } = new Role(this, "access_role", {
      assumedBy: new ServicePrincipal("build.apprunner.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSAppRunnerServicePolicyForECRAccess"
        ),
        ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"),
      ],
    });
    const repository = Repository.fromRepositoryName(
      this,
      "repository",
      applicationName
    );
    const dynamodbTable = new Table(this, "table", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      sortKey: { name: "uuid", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    const service = new CfnService(this, "service", {
      serviceName: applicationName,
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: roleArn,
        },
        autoDeploymentsEnabled: true,
        imageRepository: {
          imageIdentifier: repository.repositoryUriForTag("latest"),
          imageRepositoryType: "ECR",
          imageConfiguration: {
            port: `${applicationPort}`,
            runtimeEnvironmentVariables: [
              {
                name: "DYNAMODB_TABLE_NAME",
                value: dynamodbTable.tableName,
              },
            ],
          },
        },
      },
      healthCheckConfiguration: {
        protocol: "HTTP",
        path: healthCheckPath,
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
