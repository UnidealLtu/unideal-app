Unideal Listings Service

The Listings Service is a backend API for the UniDeal marketplace, developed using Python, FastAPI, SQLAlchemy, and PostgreSQL.

The service handles the creation, retrieval, updating, and deletion of advertisements.

Features

The service provides a REST API with the following endpoints:

Method

Endpoint

Description

GET

/api/listings

Retrieve all listings

GET

/api/listings/{id}

Retrieve a specific listing

POST

/api/listings

Create a new listing

PUT

/api/listings/{id}

Update an existing listing

DELETE

/api/listings/{id}

Delete a listing

Each listing contains an ID, title, description, price, and location.

Technologies

The service uses FastAPI for the REST API, PostgreSQL for data storage, SQLAlchemy for database operations, and Docker Compose for local development.

Automated testing is implemented using pytest and pytest-cov.