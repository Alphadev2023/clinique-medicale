# Stage 1 — Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2 — Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Crée le dossier uploads
RUN mkdir -p /app/uploads

# Copie le jar
COPY --from=build /app/target/*.jar app.jar

# Port
EXPOSE 8081

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]