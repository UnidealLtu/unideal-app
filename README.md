# UnidealLtu – application source

This repository is for the three application components:

- `frontend/`: React web application (to be implemented)
- `services/listings-service/`: FastAPI listings API (to be implemented)
- `services/favorites-service/`: FastAPI favorites/profile API (to be implemented)

Keep each service's code, tests, Dockerfile, and dependencies in its own directory. Add GitHub Actions to test/build/publish individual images to GHCR. The other repository, `UnidealLtu-gitops`, declares which image versions run in development, staging and production.

The initial GitOps starter deliberately deploys a small Nginx placeholder, not your application. It proves that all three Argo CD applications synchronize before your code exists.
