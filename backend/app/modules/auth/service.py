from fastapi import HTTPException

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def registrar(self, datos: UserCreate) -> UserPublic:
        with self.uow as uow:
            if uow.usuarios.get_by_username(datos.username):
                raise HTTPException(status_code=409, detail="El nombre de usuario ya existe")
            if uow.usuarios.get_by_email(datos.email):
                raise HTTPException(status_code=409, detail="El email ya está registrado")
            usuario = Usuario(
                username=datos.username,
                full_name=datos.full_name,
                email=datos.email,
                hashed_password=hash_password(datos.password),
                role="user",
            )
            uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    def login(self, username: str, password: str) -> str:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_username(username)
            if not usuario or not verify_password(password, usuario.hashed_password):
                raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
            if usuario.disabled:
                raise HTTPException(status_code=400, detail="Cuenta de usuario desactivada")
            return create_access_token(usuario.username)
