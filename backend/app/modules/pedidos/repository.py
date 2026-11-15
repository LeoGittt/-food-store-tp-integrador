from datetime import datetime

from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: int | None,
        estado: str | None,
        skip: int,
        limit: int,
    ) -> tuple[int, list[Pedido]]:
        consulta = select(Pedido)
        if usuario_id is not None:
            consulta = consulta.where(Pedido.usuario_id == usuario_id)
        if estado:
            consulta = consulta.where(Pedido.estado == estado)

        total = self.session.exec(select(func.count()).select_from(consulta.subquery())).one()
        pedidos = self.session.exec(
            consulta.order_by(col(Pedido.id).desc()).offset(skip).limit(limit)
        ).all()
        return total, list(pedidos)

    def count_by_estado(self, estado: str) -> int:
        consulta = select(func.count()).select_from(Pedido).where(Pedido.estado == estado)
        return self.session.exec(consulta).one()

    def count_desde(self, fecha: datetime) -> int:
        consulta = select(func.count()).select_from(Pedido).where(Pedido.created_at >= fecha)
        return self.session.exec(consulta).one()

    def sum_total_by_estado(self, estado: str) -> float:
        consulta = select(func.sum(Pedido.total)).where(Pedido.estado == estado)
        return self.session.exec(consulta).one() or 0
