# Next.js Frontend Service

This is a Next.js application that serves as the frontend for the CIV2025 microservices template.

## Features

- **Server-Side Rendering (SSR)**: Better SEO and initial page load performance
- **API Routes**: Backend functionality within the frontend service
- **TypeScript Support**: Type-safe development (configured but not used in this template)
- **Tailwind CSS Ready**: CSS framework integration ready to be added
- **Docker Support**: Containerized deployment with multi-stage builds

## Project Structure

```
app/
├── layout.js          # Root layout component
├── page.js            # Home page component
├── globals.css        # Global styles
└── api/               # API routes
    ├── node/          # Routes proxying to Node service
    └── spring/        # Routes proxying to Spring service
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm run test
```

## API Routes

The application includes API routes that proxy requests to backend services:

- `/api/node/health` - Node service health check
- `/api/node/info` - Node service information
- `/api/spring/health` - Spring service health check

## Deployment

The application is configured for deployment with:

- **Docker**: Multi-stage build for optimized production images
- **Standalone Output**: Next.js standalone deployment for containerization
- **GitHub Actions**: Automated CI/CD pipeline
- **Health Checks**: Container health monitoring

## Configuration

Key configuration files:

- `next.config.js` - Next.js configuration with rewrites, headers, and redirects
- `package.json` - Dependencies and scripts
- `Dockerfile` - Multi-stage container build
- `Dockerfile.dev` - Development container with hot reloading