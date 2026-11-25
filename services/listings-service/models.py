from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base

class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str] = mapped_column(String(1000), default="")
    price: Mapped[int]
    location: Mapped[str] = mapped_column(String(100))
