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
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
│
├── services/
│   ├── listings-service/
│   │   └── README.md
│   │
│   └── favorites-service/
│       └── README.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Run locally with Docker

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) to be installed and running.

```bash
git clone https://github.com/UnidealLtu/unideal-app.git
cd unideal-app
docker compose up --build
```

Open http://localhost:8080. Stop with `Ctrl+C` or `docker compose down`.
After pulling new code, run `docker compose up --build` again to rebuild.

See [frontend/README.md](frontend/README.md) for running the frontend without Docker.

### Components

| Directory | Purpose |
|---|---|
| `frontend/` | React application for browsing, creating and managing listings |
| `services/listings-service/` | FastAPI service for creating, retrieving, updating and deleting listings |
| `services/favorites-service/` | FastAPI service for managing users' saved listings and profile information |
| `.github/workflows/` | GitHub Actions workflows for testing and building container images |

Each service will contain its own source code, dependencies, tests and Dockerfile.

