# Centra - Gestión de Cursos

Este es un sistema web para la gestión de cursos de **Centra - Kinesiología**.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **Frontend**: Aplicación construida con [Next.js](https://nextjs.org/).
- **Backend**: API construida con [Python](https://www.python.org/) y [FastAPI](https://fastapi.tiangolo.com/).

## Cómo levantar el proyecto

### Requisitos Previos

- Node.js (v18 o superior)
- Python (v3.9 o superior)
- npm o yarn

### Backend

1. Navega a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Crea un entorno virtual:
   ```bash
   python -m venv venv
   ```
3. Activa el entorno virtual:
   - Windows: `venv\Scripts\activate`
   - Linux/macOS: `source venv/bin/activate`
4. Instala las dependencias (puedes crear un archivo requirements.txt):
   ```bash
   pip install fastapi uvicorn
   ```
5. Ejecuta el servidor:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend

1. Navega a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
