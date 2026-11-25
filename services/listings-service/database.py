import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Read the local database password from .env
load_dotenv(Path(__file__).with_name(".env"))

password = os.getenv("POSTGRES_PASSWORD")

if not password:
    raise RuntimeError("POSTGRES_PASSWORD is missing from .env")

# Connection to PostgreSQL running in Docker
database_url = URL.create(
    drivername="postgresql+psycopg",
    username="unideal_dev",
    password=password,
    host="localhost",
    port=5433,
    database="unideal_listings",
)

engine = create_engine(database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    with SessionLocal() as db:
        yield db
