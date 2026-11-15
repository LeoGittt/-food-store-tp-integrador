from typing import Generic, TypeVar

from sqlmodel import Session, select

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: type[T]):
        self.session = session
        self.model = model

    def get_by_id(self, id: int) -> T | None:
        return self.session.get(self.model, id)

    def get_all(self) -> list[T]:
        return list(self.session.exec(select(self.model)).all())

    def add(self, objeto: T) -> T:
        self.session.add(objeto)
        self.session.flush()
        return objeto

    def delete(self, objeto: T) -> None:
        self.session.delete(objeto)
