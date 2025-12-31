# Multi-component Dockerfile: Backend + Frontend + Node Microservice
FROM ubuntu:latest

# Install Java 17 JRE and Node.js
RUN apt-get update && \
    apt-get install -y openjdk-17-jre curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Spring Boot backend JAR
COPY app.jar /app/app.jar

# Copy React frontend static files (will be served by Spring Boot)
COPY frontend-dist/ /app/static/

# Copy Node microservice
COPY node-service/ /app/node-service/

# Pre-install node dependencies at build time (not runtime)
RUN cd /app/node-service && npm install --production

# Expose ports
EXPOSE 8080

# Create startup script to run multiple services
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting Spring Boot..."\n\
java -Xmx384m -Xms256m -jar /app/app.jar\n\
' > /app/start.sh && chmod +x /app/start.sh

# Run startup script
CMD ["/app/start.sh"]
