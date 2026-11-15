# Food Store

Trabajo Práctico Integrador de Programación 4

Alumno: Leonel González

Repositorio: https://github.com/LeoGittt/-food-store-tp-integrador

Documentación en PDF: Documentacion_Food_Store.pdf (está en la raíz del repositorio)

Video: COMPLETAR_URL_DEL_VIDEO

## Requisitos

- Python 3.11 a 3.13
- Node.js 20.19 o superior
- pnpm 9 o superior
- PostgreSQL 15 o superior (o SQLite)

## Backend

Crear en PostgreSQL una base vacía llamada `foodstore_db`.

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Abrir el archivo `.env` y poner el usuario y la contraseña de PostgreSQL en `DATABASE_URL`.

Para usar SQLite, poner en `.env`:

```
DATABASE_URL=sqlite:///./foodstore.db
```

Cargar los datos iniciales y levantar el servidor:

```
python -m app.db.seed
uvicorn app.main:app --reload
```

El backend queda en `http://localhost:8000`.
La documentación de la API está en `http://localhost:8000/docs`.

En Linux o Mac se activa el entorno con `source venv/bin/activate` y el archivo se copia con `cp .env.example .env`.

## Frontend

En otra terminal:

```
cd frontend
pnpm install
copy .env.example .env
pnpm dev
```

El frontend queda en `http://localhost:5173`.

## Usuario administrador

Usuario: admin

Contraseña: Admin1234!
