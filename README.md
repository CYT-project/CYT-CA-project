## Project structure

```
CYT-CA-project/
├── apps/
│   ├── backend-spring-boot/    # Spring Boot backend (Java 17)
│   ├── frontend-react/         # React frontend (Vite)
│   └── node-microservice/      # Node.js microservice
├── ci/
│   └── postman/                # Postman collection for API tests
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
├── build.ps1                   # PowerShell script for building
└── README.md                   # README
```

## Requirements

- **Java 17** - for Spring Boot backend
- **Node.js 18+** - for frontend and microservice
- **Maven 3.8+** - for building backend
- **Git** - for version control
- **Newman** - for running Postman tests

## Quick start

### Clone repository
```bash
git clone https://github.com/CYT-project/CYT-CA-project.git
cd CYT-CA-project
```

### Install dependencies

#### Backend (Spring Boot)
```bash
cd apps/backend-spring-boot
mvn clean install
```

#### Frontend (React)
```bash
cd apps/frontend-react
npm ci
```

#### Node.js microservice
```bash
cd apps/node-microservice
npm ci
```

## Testing

### Run all tests through PowerShell
```powershell
.\build.ps1
```

### Run tests by components

#### Backend tests (JUnit + Selenium)
```bash
cd apps/backend-spring-boot
mvn test
```

#### Frontend tests (Jest + React Testing Library)
```bash
cd apps/frontend-react
npm test
```

#### Node.js microservice tests (Jest + Supertest)
```bash
cd apps/node-microservice
npm test
```

#### API tests (Postman/Newman)
```bash
# Run backend and node-microservice
cd apps/backend-spring-boot
mvn spring-boot:run

# In another terminal
cd apps/node-microservice
npm start

# Run Newman tests
newman run ci/postman/marketforge-api.postman_collection.json
```

## Build project

### Automatic build of all components
```powershell
.\build.ps1
```

### Manual build by components

#### Backend
```bash
cd apps/backend-spring-boot
mvn clean package
# JAR will be in target/
```

#### Frontend
```bash
cd apps/frontend-react
npm run build
# build will be in dist/
```

#### Node.js microservice
```bash
cd apps/node-microservice
npm run build  # Creates .tgz package
```

#### CI pipeline:
1. **Checkout** - clones repository
2. **Setup** - sets up Java 17 and Node.js 18
3. **Build Backend** - compiles and tests Spring Boot
4. **Build Frontend** - installs dependencies, runs tests and builds React
5. **Build Node Service** - tests and packages microservice
6. **API Tests** - runs backend and node service, executes Newman tests
7. **Upload Artifacts** - uploads artifacts
