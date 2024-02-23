FROM gradle:latest AS TEMP_BUILD_IMAGE

ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY build.gradle.kts settings.gradle.kts $APP_HOME
  
COPY . .
RUN gradle clean build
    
FROM amazoncorretto:21

ENV ARTIFACT_NAME=application-0.1-all.jar
ENV APP_HOME=/usr/app/
    
WORKDIR $APP_HOME
COPY --from=TEMP_BUILD_IMAGE $APP_HOME/build/libs/$ARTIFACT_NAME .
    
EXPOSE 8080
ENTRYPOINT exec java -jar ${ARTIFACT_NAME}
