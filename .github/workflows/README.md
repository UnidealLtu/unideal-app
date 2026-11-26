# CI workflows

`frontend-ci.yml` builds, smoke-tests and publishes the frontend image to GHCR on frontend changes to main or manual dispatch. It tags the image with the full application commit SHA. GitOps promotion is manual for now; see DEPLOYMENT.md in the repository root.

## Listings Service Tests

**Workflow:** `listings-tests.yml`

The workflow consists of two jobs: `test` and `publish`.

### 1. Test

The `test` job runs automatically on every push and pull request.

It uses Python 3.12 and pytest to run automated tests for the FastAPI Listings Service. Code coverage is measured using pytest-cov, with a minimum requirement of **50%**.

Tests use a temporary SQLite database instead of PostgreSQL.

### 2. Build and Publish

The `publish` job runs only when changes are pushed to `main` and all tests pass.

It builds the Listings Service Docker image and publishes it to GitHub Container Registry (GHCR).

Images receive two tags:

- `latest` – Most recently published version.
- `sha-<commit-sha>` – Version linked to a specific commit.

**Docker image:** `ghcr.io/<github-owner>/unideal-listings-service`

## CI/CD Pipeline

The workflow automatically tests code and publishes Docker images to GHCR.

These images are used for deployment to Kubernetes through Helm and Argo CD.

Automatic updates to the GitOps repository have not yet been implemented.