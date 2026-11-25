# Deploy Unideal frontend to development

Target: https://unideal-dev.group-6-m7011e-ltu.se/

## 1. Application repository (UnidealLtu/unideal-app)

Copy the updated configuration files into your existing clone; do not replace its .git directory. Test locally from the root:

```bash
docker compose up --build
```

Open http://localhost:8080 and http://localhost:8080/profile. Stop with `docker compose down`.

Commit and push the updated files to main (or merge a PR). The frontend-ci workflow builds the image, checks HTTP and client routing, then publishes `ghcr.io/unidealltu/unideal-frontend:<full application commit SHA>`. Find the exact image reference in the Actions job summary. If the workflow cannot publish, verify organization Actions/package permissions. A new GHCR package is generally private; for this demo, make it public only if your group approves public distribution. Otherwise configure a Kubernetes image pull secret with a read:packages credential in each target namespace and reference it in the pod spec. Never commit the credential.

## 2. GitOps repository (UnidealLtu/Unideal-gitops)

The GitOps repository was not included in the archive, so these are integration instructions, not applied edits. The existing development Application watches main, charts/unideal, and environments/development/values.yaml.

In `environments/development/values.yaml`, replace only the image settings (use the actual SHA from Actions, not the literal placeholder):

```yaml
image:
  repository: ghcr.io/unidealltu/unideal-frontend
  tag: "REPLACE_WITH_APPLICATION_COMMIT_SHA"
  pullPolicy: IfNotPresent
```

The existing chart is shared across environments. To preserve the existing HTML demo in staging/production, gate the temporary HTML configuration using a Helm value. In `charts/unideal/values.yaml`, add:

```yaml
demoHtmlEnabled: true
```
In `environments/development/values.yaml`, add at top level:


```yaml
demoHtmlEnabled: false
```

In `charts/unideal/templates/deployment.yaml`, wrap the existing checksum annotation (if present), HTML volumeMounts and HTML volumes in separate `{{- if .Values.demoHtmlEnabled }}` / `{{- end }}` blocks. Wrap the complete temporary `configmap.yaml` template in the same condition. See `gitops-example/deployment.yaml` for a complete example based on the deployment pasted in chat, not a verified copy of your repository. Keep your existing labels, resource settings, service and ingress. Keep port 80 and the existing `/` probes (or use `/healthz` only for the new image). Do not change DNS/TLS or hardcode the domain in NGINX.

For a private image, add `imagePullSecrets` under `spec.template.spec` in the Deployment, pointing to a secret already present in the namespace.

If Helm is installed, from the GitOps root validate before pushing:

```bash
helm template unideal-dev charts/unideal -f environments/development/values.yaml
```

Commit and push the GitOps changes. Argo CD should automatically reconcile (configured interval 180 seconds plus possible jitter). With prune enabled, the old development HTML ConfigMap will be removed.

## 3. Verify on the VM

```bash
kubectl --kubeconfig ~/.kube/config get application unideal-dev -n argocd
kubectl --kubeconfig ~/.kube/config rollout status deployment/unideal-dev -n unideal-dev
kubectl --kubeconfig ~/.kube/config get deployment unideal-dev -n unideal-dev -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
kubectl --kubeconfig ~/.kube/config get pods -n unideal-dev
curl -fsS https://unideal-dev.group-6-m7011e-ltu.se/healthz
```

Open the domain and refresh `/profile`. If a pod reports ImagePullBackOff, check its events and registry permissions. Future app changes produce new image tags; update the development values file to promote each image. Automatic cross-repo writes are not enabled in this workflow.

The frontend uses browser-local demo data, not a shared backend. No live deployment or registry publication was performed while preparing these files.
