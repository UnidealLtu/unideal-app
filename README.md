# UnidealLtu – application source

Deployment configurations are maintained separately in the [UnidealLtu-gitops](https://github.com/UnidealLtu/UnidealLtu-gitops) repository.

## Repository structure

```text
UnidealLtu-app/
├── .github/
│   └── workflows/
│       └── README.md
│
├── frontend/
│   └── README.md
│
├── services/
│   ├── listings-service/
│   │   └── README.md
│   │
│   └── favorites-service/
│       └── README.md
│
├── .gitignore
└── README.md
```

### Components

| Directory | Purpose |
|---|---|
| `frontend/` | React application for browsing, creating and managing listings |
| `services/listings-service/` | FastAPI service for creating, retrieving, updating and deleting listings |
| `services/favorites-service/` | FastAPI service for managing users' saved listings and profile information |
| `.github/workflows/` | GitHub Actions workflows for testing and building container images |

Each service will contain its own source code, dependencies, tests and Dockerfile.

