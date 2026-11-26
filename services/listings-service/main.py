
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import File, UploadFile
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageOps, UnidentifiedImageError

from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Listing
from datetime import datetime

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="UniDeal Listings API",
    lifespan=lifespan
)

UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="uploads"
)

class ListingCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(default="", max_length=1000)
    price: int = Field(gt=0)
    location: str = Field(min_length=1, max_length=100)
    category: str = Field(default="Other", max_length=50)
    imageUrl: str | None = Field(default=None, max_length=500)

    # Seller information
    sellerId: str | None = Field(default=None, max_length=100)
    sellerName: str | None = Field(default=None, max_length=150)
    sellerEmail: str | None = Field(default=None, max_length=254)


class ListingRead(ListingCreate):
    id: int
    createdAt: datetime

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


@app.post("/api/images", status_code=201)
async def upload_image(file: UploadFile = File(...)):
    max_size = 5 * 1024 * 1024  # 5 MB

    try:
        contents = await file.read(max_size + 1)
    finally:
        await file.close()

    if len(contents) > max_size:
        raise HTTPException(
            status_code=413,
            detail="Image must be smaller than 5 MB"
        )

    try:
        with Image.open(BytesIO(contents)) as original:
            if original.format not in {"JPEG", "PNG", "WEBP"}:
                raise HTTPException(
                    status_code=400,
                    detail="Only JPG, PNG and WebP are supported"
                )

            if original.width * original.height > 20_000_000:
                raise HTTPException(
                    status_code=413,
                    detail="Image dimensions are too large"
                )

            # Correct orientation and reduce large images
            image = ImageOps.exif_transpose(original)
            image.thumbnail((1600, 1600))

            # Convert to JPEG with a white background
            rgba = image.convert("RGBA")
            jpg = Image.new("RGB", rgba.size, "white")
            jpg.paste(rgba, mask=rgba.getchannel("A"))

            filename = f"{uuid4().hex}.jpg"
            jpg.save(UPLOAD_DIR / filename, "JPEG", quality=85)

    except (UnidentifiedImageError, OSError, ValueError,
            Image.DecompressionBombError):
        raise HTTPException(
            status_code=400,
            detail="Invalid image file"
        )

    return {
        "imageUrl": f"/uploads/{filename}"
    }
