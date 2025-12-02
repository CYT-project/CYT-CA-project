Write-Host "Building Backend..."
cd apps/backend-spring-boot
mvn clean package
cd ../../

Write-Host "Building Frontend..."
cd apps/frontend-react
npm ci
npm test
npm run build
cd ../../

Write-Host "Building Node Microservice..."
cd apps/node-microservice
npm ci
npm test
npm run build
cd ../../

Write-Host "Running API tests with Newman..."

# path to collection
$collectionPath = "ci/postman/marketforge-api.postman_collection.json"
$envPath = "ci/postman/env.json"

# check if newman is installed
$newman = Get-Command newman -ErrorAction SilentlyContinue

if (-not $newman) {
    Write-Host "Newman not found. Installing globally..."
    npm install -g newman
}

# run collection
if (Test-Path $collectionPath) {
    if (Test-Path $envPath) {
        newman run $collectionPath -e $envPath
    } else {
        newman run $collectionPath
    }
} else {
    Write-Host "Postman collection NOT FOUND. Skipping API tests."
}

Write-Host "Build completed successfully!"