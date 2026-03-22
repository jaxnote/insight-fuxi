from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    folder: Mapped[str | None] = mapped_column(String(255), nullable=True)
    pinned: Mapped[int] = mapped_column(Integer, default=0)
    model_name: Mapped[str] = mapped_column(String(100), default="gpt-4o")
    mode: Mapped[str] = mapped_column(String(50), default="agent")
    token_used: Mapped[int] = mapped_column(Integer, default=0)
    token_limit: Mapped[int] = mapped_column(Integer, default=128000)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="conversation", cascade="all, delete-orphan"
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    conversation_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("conversations.id"), nullable=False
    )
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    content_type: Mapped[str] = mapped_column(String(50), default="text")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    meta: Mapped[str | None] = mapped_column("metadata", Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    conversation: Mapped["Conversation"] = relationship(
        "Conversation", back_populates="messages"
    )
