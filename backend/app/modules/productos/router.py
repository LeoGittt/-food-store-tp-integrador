from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.core.deps import require_role
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.service import CategoriaNoEncontrada, ProductoNoEncontrado, ProductoService
from app.modules.productos.unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["productos"])

solo_admin = [Depends(require_role(["admin"]))]


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
    service: ProductoService = Depends(get_producto_service),
):
    return service.listar(search, categoria_id, disponible, skip, limit)


@router.get("/{id}", response_model=ProductoRead)
def obtener_producto(id: int, service: ProductoService = Depends(get_producto_service)):
    try:
        return service.obtener(id)
    except ProductoNoEncontrado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")


@router.post("", response_model=ProductoRead, status_code=201, dependencies=solo_admin)
def crear_producto(datos: ProductoCreate, service: ProductoService = Depends(get_producto_service)):
    try:
        return service.crear(datos)
    except CategoriaNoEncontrada:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")


@router.put("/{id}", response_model=ProductoRead, dependencies=solo_admin)
def actualizar_producto(
    id: int,
    datos: ProductoUpdate,
    service: ProductoService = Depends(get_producto_service),
):
    try:
        return service.actualizar(id, datos)
    except ProductoNoEncontrado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    except CategoriaNoEncontrada:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")


@router.patch("/{id}/stock", response_model=ProductoRead, dependencies=solo_admin)
def actualizar_stock(
    id: int,
    datos: ProductoStockUpdate,
    service: ProductoService = Depends(get_producto_service),
):
    try:
        return service.actualizar_stock(id, datos)
    except ProductoNoEncontrado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")


@router.delete("/{id}", status_code=204, dependencies=solo_admin)
def eliminar_producto(id: int, service: ProductoService = Depends(get_producto_service)):
    try:
        service.eliminar(id)
    except ProductoNoEncontrado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return Response(status_code=204)
