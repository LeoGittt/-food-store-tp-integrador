from fastapi import HTTPException

from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def listar(self) -> list[UserPublic]:
        with self.uow as uow:
            usuarios = uow.usuarios.get_all()
            return [UserPublic.model_validate(u) for u in usuarios]

    def activar(self, id: int) -> UserPublic:
        with self.uow as uow:
            usuario = self._buscar(uow, id)
            usuario.disabled = False
            return UserPublic.model_validate(usuario)

    def desactivar(self, id: int, admin: Usuario) -> UserPublic:
        with self.uow as uow:
            usuario = self._buscar(uow, id)
            if usuario.id == admin.id:
                raise HTTPException(status_code=400, detail="No puede desactivarse a sí mismo")
            usuario.disabled = True
            return UserPublic.model_validate(usuario)

    def _buscar(self, uow: UsuarioUnitOfWork, id: int) -> Usuario:
        usuario = uow.usuarios.get_by_id(id)
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario
