from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.deps import get_current_active_user, require_role
from app.modules.pedidos.schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoEncontrado,
    ReglaDeNegocio,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.models import Usuario

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


@router.post("", response_model=PedidoRead, status_code=201)
def crear_pedido(
    datos: PedidoCreate,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        return service.crear(datos, usuario)
    except ProductoNoEncontrado as error:
        raise HTTPException(status_code=404, detail=str(error))
    except ReglaDeNegocio as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    estado: EstadoPedido | None = None,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.listar(usuario, estado, skip, limit)


@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(
    admin: Usuario = Depends(require_role(["admin"])),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.resumen()


@router.get("/{id}", response_model=PedidoRead)
def obtener_pedido(
    id: int,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        return service.obtener(id, usuario)
    except PedidoNoEncontrado:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    except PedidoAjeno:
        raise HTTPException(status_code=403, detail="El pedido pertenece a otro usuario")


@router.patch("/{id}/estado", response_model=PedidoRead)
def cambiar_estado(
    id: int,
    datos: CambioEstado,
    admin: Usuario = Depends(require_role(["admin"])),
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        return service.cambiar_estado(id, datos.estado)
    except PedidoNoEncontrado:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    except ReglaDeNegocio as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.patch("/{id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(
    id: int,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        return service.cancelar(id, usuario)
    except PedidoNoEncontrado:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    except PedidoAjeno:
        raise HTTPException(status_code=403, detail="El pedido pertenece a otro usuario")
    except ReglaDeNegocio as error:
        raise HTTPException(status_code=400, detail=str(error))
