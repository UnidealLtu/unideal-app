# Listings service

The Listings Service is a backend API built with*Python and FastAPI. It will handle advertisements for the Unideal marketplace.

## Current functionality

The service currently provides a REST API endpoint that returns a list of example advertisements.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | Retrieve all advertisements |

The advertisements are currently hardcoded in Python. Database integration will be added later.

## Technologies

- Python
- FastAPI
- Uvicorn

## Running the service locally

Navigate to the `services/listings-service` directory.

**1. Create a virtual environment**

```bash
python -m venv .venv
```

**2. Activate the virtual environment (Git Bash on Windows)**

```bash
source .venv/Scripts/activate
```

**3. Install dependencies**

```bash
python -m pip install -r requirements.txt
```

**4. Start the API**

```bash
python -m uvicorn main:app --reload
```

## API documentation

Once the server is running, open:

**Swagger UI:** http://127.0.0.1:8000/docs

**Listings endpoint:** http://127.0.0.1:8000/api/listings

FastAPI automatically generates interactive API documentation using OpenAPI.



