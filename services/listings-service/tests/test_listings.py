
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import main
from database import Base, get_db


@pytest.fixture
def client(monkeypatch):
    # Create a temporary in-memory test database
    test_engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    TestSession = sessionmaker(bind=test_engine)

    # Use SQLite instead of PostgreSQL during startup
    monkeypatch.setattr(main, "engine", test_engine)

    def override_get_db():
        with TestSession() as db:
            yield db

    main.app.dependency_overrides[get_db] = override_get_db

    # Start the application with its test database
    try:
        with TestClient(main.app) as test_client:
            yield test_client
    finally:
        main.app.dependency_overrides.clear()
        test_engine.dispose()


def sample_listing():
    return {
        "title": "Studentcykel",
        "description": "Begagnad cykel i bra skick",
        "price": 1200,
        "location": "Luleå",
    }


# TEST 1: Getting listings from an empty database
def test_get_empty_listings(client):
    response = client.get("/api/listings")

    assert response.status_code == 200
    assert response.json() == []


# TEST 2: Creating a listing
def test_create_listing(client):
    response = client.post(
        "/api/listings",
        json=sample_listing(),
    )

    assert response.status_code == 201
    assert response.json()["title"] == "Studentcykel"
    assert response.json()["price"] == 1200
    assert "id" in response.json()


# TEST 3: Retrieving a specific listing
def test_get_listing(client):
    created = client.post(
        "/api/listings",
        json=sample_listing(),
    ).json()

    response = client.get(
        f"/api/listings/{created['id']}"
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Studentcykel"


# TEST 4: Updating an existing listing
def test_update_listing(client):
    created = client.post(
        "/api/listings",
        json=sample_listing(),
    ).json()

    updated_data = sample_listing()
    updated_data["price"] = 900

    response = client.put(
        f"/api/listings/{created['id']}",
        json=updated_data,
    )

    assert response.status_code == 200
    assert response.json()["price"] == 900


# TEST 5: Deleting a listing
def test_delete_listing(client):
    created = client.post(
        "/api/listings",
        json=sample_listing(),
    ).json()

    listing_id = created["id"]

    response = client.delete(
        f"/api/listings/{listing_id}"
    )

    assert response.status_code == 204

    # The deleted listing should no longer exist
    check = client.get(f"/api/listings/{listing_id}")
    assert check.status_code == 404


# TEST 6: Retrieving a listing that does not exist
def test_get_missing_listing(client):
    response = client.get("/api/listings/999")

    assert response.status_code == 404


# TEST 7: Updating a listing that does not exist
def test_update_missing_listing(client):
    response = client.put(
        "/api/listings/999",
        json=sample_listing(),
    )

    assert response.status_code == 404


# TEST 8: Deleting a listing that does not exist
def test_delete_missing_listing(client):
    response = client.delete("/api/listings/999")

    assert response.status_code == 404


# TEST 9: Rejecting an invalid price
def test_invalid_price(client):
    data = sample_listing()
    data["price"] = -100

    response = client.post(
        "/api/listings",
        json=data,
    )

    assert response.status_code == 422


# TEST 10: Rejecting an empty title
def test_empty_title(client):
    data = sample_listing()
    data["title"] = ""

    response = client.post(
        "/api/listings",
        json=data,
    )

    assert response.status_code == 422
