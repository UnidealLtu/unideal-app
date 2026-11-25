
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Listing


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="UniDeal Listings API",
    lifespan=lifespan
)


class ListingCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(default="", max_length=1000)
    price: int = Field(gt=0)
    location: str = Field(min_length=1, max_length=100)


class ListingRead(ListingCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


# GET: Retrieve all listings
@app.get("/api/listings", response_model=list[ListingRead])
def get_listings(db: Session = Depends(get_db)):
    return db.scalars(
        select(Listing).order_by(Listing.id.desc())
    ).all()


# GET: Retrieve a specific listing
@app.get("/api/listings/{listing_id}", response_model=ListingRead)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    return listing


# POST: Create a new listing
@app.post(
    "/api/listings",
    response_model=ListingRead,
    status_code=status.HTTP_201_CREATED
)
def create_listing(
    listing: ListingCreate,
    db: Session = Depends(get_db)
):
    new_listing = Listing(**listing.model_dump())

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return new_listing


# PUT: Update an existing listing
@app.put("/api/listings/{listing_id}", response_model=ListingRead)
def update_listing(
    listing_id: int,
    updated_data: ListingCreate,
    db: Session = Depends(get_db)
):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    for field, value in updated_data.model_dump().items():
        setattr(listing, field, value)

    db.commit()
    db.refresh(listing)

    return listing


# DELETE: Remove a listing
@app.delete(
    "/api/listings/{listing_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db)
):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    db.delete(listing)
    db.commit()
