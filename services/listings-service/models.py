
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(String(150))

    description: Mapped[str] = mapped_column(
        String(1000),
        default=""
    )

    price: Mapped[int]

    location: Mapped[str] = mapped_column(String(100))

    category: Mapped[str] = mapped_column(
        String(50),
        server_default="Other"
    )

    imageUrl: Mapped[str | None] = mapped_column(
        "image_url",
        String(500),
        nullable=True
    )

    sellerId: Mapped[str | None] = mapped_column(
        "seller_id",
        String(100),
        nullable=True
    )

    sellerName: Mapped[str | None] = mapped_column(
        "seller_name",
        String(150),
        nullable=True
    )

    sellerEmail: Mapped[str | None] = mapped_column(
        "seller_email",
        String(254),
        nullable=True
    )

    createdAt: Mapped[datetime] = mapped_column(
        "created_at",
        DateTime(timezone=True),
        server_default=func.now()
    )
