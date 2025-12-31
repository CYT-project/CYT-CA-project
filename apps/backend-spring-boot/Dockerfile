# Multi-component Dockerfile: Backend + Frontend + Node Microservice
FROM eclipse-temurin:17-jre

# Install Node.js for the microservice
RUN apt-get update && \
    apt-get install -y curl && \
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

# Expose ports
EXPOSE 8080

# Create startup script to run multiple services
RUN echo '#!/bin/bash\n\
# Start Node microservice in background\n\
cd /app/node-service && npm install && npm start &\n\
\n\
# Start Spring Boot (foreground)\n\
java -Xmx512m -Xms256m -jar /app/app.jar\n\
' > /app/start.sh && chmod +x /app/start.sh

# Run startup script
CMD ["/app/start.sh"]
