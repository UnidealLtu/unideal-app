# CI workflows

`frontend-ci.yml` builds, smoke-tests and publishes the frontend image to GHCR on frontend changes to main or manual dispatch. It tags the image with the full application commit SHA. GitOps promotion is manual for now; see DEPLOYMENT.md in the repository root.
