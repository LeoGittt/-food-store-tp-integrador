from fastapi import APIRouter, Depends, HTTPException, Response

from app.core.deps import require_role
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import CategoriaNoEncontrada, CategoriaService, NombreDuplicado
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["categorias"])

solo_admin = [Depends(require_role(["admin"]))]


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: CategoriaService = Depends(get_categoria_service)):
    return service.listar()


@router.get("/{id}", response_model=CategoriaRead)
def obtener_categoria(id: int, service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.obtener(id)
    except CategoriaNoEncontrada:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")


@router.post("", response_model=CategoriaRead, status_code=201, dependencies=solo_admin)
def crear_categoria(datos: CategoriaCreate, service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.crear(datos)
    except NombreDuplicado:
        raise HTTPException(status_code=409, detail="Ya existe una categoría con ese nombre")


@router.put("/{id}", response_model=CategoriaRead, dependencies=solo_admin)
def actualizar_categoria(
    id: int,
    datos: CategoriaUpdate,
    service: CategoriaService = Depends(get_categoria_service),
):
    try:
        return service.actualizar(id, datos)
    except CategoriaNoEncontrada:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    except NombreDuplicado:
        raise HTTPException(status_code=409, detail="Ya existe una categoría con ese nombre")


@router.delete("/{id}", status_code=204, dependencies=solo_admin)
def eliminar_categoria(id: int, service: CategoriaService = Depends(get_categoria_service)):
    try:
        service.eliminar(id)
    except CategoriaNoEncontrada:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return Response(status_code=204)
