from sqlmodel import Session, select

from app.core.database import create_all_tables, engine
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

CATEGORIAS = [
    ("Pizzas", "Pizzas al horno"),
    ("Hamburguesas", "Hamburguesas caseras"),
    ("Bebidas", "Bebidas frías"),
]

PRODUCTOS = [
    ("Pizza muzzarella", "Salsa de tomate y muzzarella", 8500, 20, "Pizzas", "pizza-muzzarella"),
    ("Pizza napolitana", "Muzzarella, tomate y ajo", 9500, 15, "Pizzas", "pizza-napolitana"),
    ("Pizza especial", "Jamón, morrones y aceitunas", 10500, 10, "Pizzas", "pizza-especial"),
    ("Hamburguesa simple", "Carne, lechuga y tomate", 7000, 25, "Hamburguesas", "hamburguesa-simple"),
    ("Hamburguesa doble", "Doble carne y queso cheddar", 9000, 20, "Hamburguesas", "hamburguesa-doble"),
    ("Hamburguesa veggie", "Medallón de lentejas", 7500, 12, "Hamburguesas", "hamburguesa-veggie"),
    ("Gaseosa 500ml", "Gaseosa de línea", 2000, 50, "Bebidas", "gaseosa"),
    ("Agua mineral 500ml", "Agua sin gas", 1500, 50, "Bebidas", "agua"),
]


def run():
    create_all_tables()
    with Session(engine) as session:
        admin = session.exec(select(Usuario).where(Usuario.username == "admin")).first()
        if not admin:
            session.add(
                Usuario(
                    username="admin",
                    full_name="Administrador",
                    email="admin@foodstore.com",
                    hashed_password=hash_password("Admin1234!"),
                    role="admin",
                )
            )

        for nombre, descripcion in CATEGORIAS:
            existe = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
            if not existe:
                session.add(Categoria(nombre=nombre, descripcion=descripcion))
        session.commit()

        for nombre, descripcion, precio, stock, nombre_categoria, imagen in PRODUCTOS:
            existe = session.exec(select(Producto).where(Producto.nombre == nombre)).first()
            if existe:
                continue
            categoria = session.exec(select(Categoria).where(Categoria.nombre == nombre_categoria)).first()
            session.add(
                Producto(
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    stock=stock,
                    imagen_url=f"/productos/{imagen}.jpg",
                    categoria_id=categoria.id,
                )
            )
        session.commit()
    print("Seed cargado")


if __name__ == "__main__":
    run()
