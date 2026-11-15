from fastapi import Cookie, Depends, HTTPException

from app.core.database import session_factory
from app.core.security import decode_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository


def get_current_user(access_token: str | None = Cookie(default=None)) -> Usuario:
    if not access_token:
        raise HTTPException(status_code=401, detail="No autenticado")
    username = decode_access_token(access_token)
    if not username:
        raise HTTPException(status_code=401, detail="Token inválido o vencido")
    with session_factory() as session:
        usuario = UsuarioRepository(session).get_by_username(username)
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return usuario


def get_current_active_user(usuario: Usuario = Depends(get_current_user)) -> Usuario:
    if usuario.disabled:
        raise HTTPException(status_code=400, detail="Cuenta de usuario desactivada")
    return usuario


def require_role(roles: list[str]):
    def verificar_rol(usuario: Usuario = Depends(get_current_active_user)) -> Usuario:
        if usuario.role not in roles:
            raise HTTPException(status_code=403, detail="No tiene permisos para esta acción")
        return usuario

    return verificar_rol
