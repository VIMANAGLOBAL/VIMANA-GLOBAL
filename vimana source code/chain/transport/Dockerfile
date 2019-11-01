FROM maven:3.5.4-jdk-8-slim

EXPOSE 8080
ADD ./src /build-target/src
ADD ./pom.xml /build-target/pom.xml
WORKDIR /build-target
RUN mvn clean install -DskipTests
CMD java -Dfile.encoding=UTF-8 -jar target/vim-transport-1.1.0-SNAPSHOT.jar