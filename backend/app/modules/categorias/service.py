from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.get_activas()
            return [CategoriaRead.model_validate(c) for c in categorias]

    def obtener(self, id: int) -> CategoriaRead:
        with self.uow as uow:
            categoria = self._buscar(uow, id)
            return CategoriaRead.model_validate(categoria)

    def crear(self, datos: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.get_by_nombre(datos.nombre):
                raise NombreDuplicado()
            categoria = Categoria(nombre=datos.nombre, descripcion=datos.descripcion)
            uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, id: int, datos: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = self._buscar(uow, id)
            cambios = datos.model_dump(exclude_none=True)
            if "nombre" in cambios:
                otra = uow.categorias.get_by_nombre(cambios["nombre"])
                if otra and otra.id != id:
                    raise NombreDuplicado()
            for campo, valor in cambios.items():
                setattr(categoria, campo, valor)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            categoria = self._buscar(uow, id)
            categoria.activo = False

    def _buscar(self, uow: CategoriaUnitOfWork, id: int) -> Categoria:
        categoria = uow.categorias.get_by_id(id)
        if not categoria or not categoria.activo:
            raise CategoriaNoEncontrada()
        return categoria
