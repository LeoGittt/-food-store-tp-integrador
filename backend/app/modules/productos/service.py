from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class CategoriaNoEncontrada(Exception):
    pass


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork):
        self.uow = uow

    def listar(
        self,
        search: str | None,
        categoria_id: int | None,
        disponible: bool | None,
        skip: int,
        limit: int,
    ) -> ProductosPaginados:
        with self.uow as uow:
            total, productos = uow.productos.search(search, categoria_id, disponible, skip, limit)
            items = [ProductoRead.model_validate(p) for p in productos]
            return ProductosPaginados(total=total, items=items)

    def obtener(self, id: int) -> ProductoRead:
        with self.uow as uow:
            producto = self._buscar(uow, id)
            return ProductoRead.model_validate(producto)

    def crear(self, datos: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            self._validar_categoria(uow, datos.categoria_id)
            producto = Producto(**datos.model_dump())
            uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def actualizar(self, id: int, datos: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._buscar(uow, id)
            cambios = datos.model_dump(exclude_none=True)
            if "categoria_id" in cambios and cambios["categoria_id"] != producto.categoria_id:
                self._validar_categoria(uow, cambios["categoria_id"])
            for campo, valor in cambios.items():
                setattr(producto, campo, valor)
            return ProductoRead.model_validate(producto)

    def actualizar_stock(self, id: int, datos: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._buscar(uow, id)
            producto.stock = datos.stock
            producto.disponible = datos.disponible
            return ProductoRead.model_validate(producto)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            producto = self._buscar(uow, id)
            producto.activo = False

    def _buscar(self, uow: ProductoUnitOfWork, id: int) -> Producto:
        producto = uow.productos.get_by_id(id)
        if not producto or not producto.activo:
            raise ProductoNoEncontrado()
        return producto

    def _validar_categoria(self, uow: ProductoUnitOfWork, categoria_id: int) -> None:
        categoria = uow.categorias.get_by_id(categoria_id)
        if not categoria or not categoria.activo:
            raise CategoriaNoEncontrada()
