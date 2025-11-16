# Build stage - compile and package the application
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom first for dependency caching
COPY pom.xml ./

# Download dependencies (cached if pom.xml hasn't changed)
RUN mvn -B dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn -B clean package -DskipTests

# Runtime stage - run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Switch to non-root user
USER spring:spring

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]

