# React frontend

Simple marketplace frontend (React + Vite) with two services:

- **Listing service** (`src/services/listingService.js`): browse, search, create, edit and delete listings.
- **Profile service** (`src/services/profileService.js`): view/edit profile and saved (favorite) listings.

Both services currently store data in the browser's `localStorage`, so no backend is needed.
Later, replace the function bodies with `fetch()` calls to `listings-service` and `favorites-service`.

## Run with Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/). From the **repository root**:

```bash
docker compose up --build
```

Then open http://localhost:8080. Stop with `Ctrl+C` or `docker compose down`.

## Run without Docker (development, hot reload)

Requires Node.js 20+. From this `frontend/` folder:

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

To reset the demo data, clear the site's localStorage in your browser dev tools.
