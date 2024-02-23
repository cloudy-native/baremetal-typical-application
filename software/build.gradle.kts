plugins {
    id("com.github.johnrengelman.shadow") version "8.1.1"
    id("io.micronaut.application") version "4.3.1"
    id("io.micronaut.aot") version "4.3.1"
}

version = "0.1"
group = "help.baremetal"

repositories {
    mavenCentral()
    // For local packages, use mavanCentral() the the Code Artifact repo below 
    //
    // maven {
    //      url = uri("https://baremetal-607477397669.d.codeartifact.us-east-1.amazonaws.com/maven/maven/")
    //      credentials {
    //          username = "aws"
    //          password = System.getenv("CODEARTIFACT_AUTH_TOKEN")
    //      }
    // }
}

dependencies {
    annotationProcessor("io.micronaut:micronaut-http-validation")
    annotationProcessor("io.micronaut.serde:micronaut-serde-processor")

    implementation("io.micronaut:micronaut-management")
    implementation("io.micronaut.aws:micronaut-aws-sdk-v2")
    implementation("io.micronaut.serde:micronaut-serde-jackson")
    implementation("software.amazon.awssdk:s3")
    implementation("software.amazon.awssdk:dynamodb")

    compileOnly("io.micronaut:micronaut-http-client")
    
    runtimeOnly("ch.qos.logback:logback-classic")
    runtimeOnly("org.yaml:snakeyaml")
    
    testImplementation("io.micronaut:micronaut-http-client")
}


application {
    mainClass.set("help.baremetal.application.Main")
}
java {
    sourceCompatibility = JavaVersion.toVersion("17")
    targetCompatibility = JavaVersion.toVersion("17")
}


graalvmNative.toolchainDetection.set(false)
micronaut {
    runtime("netty")
    testRuntime("junit5")
    processing {
        incremental(true)
        annotations("help.baremetal.*")
    }
    aot {
    // Please review carefully the optimizations enabled below
    // Check https://micronaut-projects.github.io/micronaut-aot/latest/guide/ for more details
        optimizeServiceLoading.set(false)
        convertYamlToJava.set(false)
        precomputeOperations.set(true)
        cacheEnvironment.set(true)
        optimizeClassLoading.set(true)
        deduceEnvironment.set(true)
        optimizeNetty.set(true)
    }
}
