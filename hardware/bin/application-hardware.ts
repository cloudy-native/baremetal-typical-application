#!/usr/bin/env node
import { App, Environment } from "aws-cdk-lib";
import "source-map-support/register";
import { BareMetalApplicationAppRunnerHardwareStack } from "../lib";

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const tags: { [key: string]: string } = {
  description: "CDK stack for a typical application with AWS resources",
  environment: process.env.ENVIRONMENT || "unknown-environment",
  owner: "stephen@baremetal.help",
  repo: "https://github.com/baremetalhelp/baremetal-typical-application",
};

const serviceName = "application";
const port = 8080;

const app = new App();

new BareMetalApplicationAppRunnerHardwareStack(
  app,
  "BareMetalApplicationAppRunnerHardware",
  {
    applicationName: "application",
    applicationPort: 8080,
    healthCheckPath: "/health",
  }
);
