## # Todo App Backend

### Características
Este es el backend de una aplicación de gestión de tareas construida con Node.js y Express. La aplicación permite el registro y autenticación de usuarios utilizando JWT para proteger las rutas relacionadas con la creación, lectura, actualización y eliminación de tareas. Los datos se almacenan localmente en archivos JSON.
### Requisitos
- Node.js (versión 12 o superior)
- npm (versión 6 o superior)

### Instalación
1. Clona el repositorio en tu máquina local:
git clone https://github.com/cristhiancao9/BK-TODO-LIST.git
2. Accede al directorio del proyecto:
cd todo-app-backend
3. Instala las dependencias del proyecto:
npm install

## Uso
### Scripts disponibles
- `npm run dev`: Inicia el servidor en modo desarrollo utilizando nodemon, que recarga automáticamente los cambios.
### Iniciar el servidor
Puedes iniciar el servidor ejecutando:
**npm run dev**
El servidor se iniciará en el puerto 5000 o en el puerto definido por la variable de entorno PORT.
### Rutas y Endpoints
#### Autenticación
1. **Registro de usuarios** (`POST /api/auth/register`):
   - Permite registrar nuevos usuarios.
   - **Body**:
   {
   "email": "usuario@example.com",
   "password": "tuPassword",
   "name": "Nombre",
   "lastName": "Apellido"
   }
2. **Login de usuarios** (`POST /api/auth/login`):
   - Autentica a un usuario y devuelve un token JWT.
   - **Body**:
   {
   "email": "usuario@example.com",
   "password": "tuPassword"
   }
3. **Obtener datos del usuario autenticado** (`GET /api/auth/user`):
   - Devuelve la información del usuario actualmente autenticado.
   - **Headers**:
   {
   "Authorization": "Bearer <token>"
   }
Gestión de Tareas
1. **Crear una tarea** (`POST /api/tasks`):
   - Crea una nueva tarea para el usuario autenticado.
   - **Headers**:
   {
   "Authorization": "Bearer <token>"
   }
   - **Body**:
   {
   "title": "Título de la tarea",
   "description": "Descripción de la tarea"
   }
2. **Obtener todas las tareas** (`GET /api/tasks`):
   - Devuelve todas las tareas del usuario autenticado.
   - **Headers**:
   {
   "Authorization": "Bearer <token>"
   }
3. **Actualizar una tarea** (`PUT /api/tasks/:id`):
   - Actualiza una tarea existente del usuario autenticado.
   - **Headers**:
   {
   "Authorization": "Bearer <token>"
   }
   - **Body** (parámetros opcionales):
   {
   "title": "Nuevo título",
   "description": "Nueva descripción",
   "completed": true
   }
4. **Eliminar una tarea** (`DELETE /api/tasks/:id`):
   - Elimina una tarea específica del usuario autenticado.
   - **Headers**:
   {
   "Authorization": "Bearer <token>"
   }
Ejemplo de uso
1. **Registro de usuario**:
   curl -X POST http://localhost:5000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"email":"usuario@example.com", "password":"tuPassword", "name":"Nombre", "lastName":"Apellido"}'
2. **Login de usuario**:
   curl -X POST http://localhost:5000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"usuario@example.com", "password":"tuPassword"}'
3. **Obtener tareas**:
   curl -X GET http://localhost:5000/api/tasks \
   -H "Authorization: Bearer <tu_token>"
4. **Crear una tarea**:
   curl -X POST http://localhost:5000/api/tasks \
   -H "Authorization: Bearer <tu_token>" \
   -H "Content-Type: application/json" \
   -d '{"title":"Nueva tarea", "description":"Descripción de la nueva tarea"}'
Dependencias
- express: Framework para crear la API.
- bcryptjs: Encriptación de contraseñas.
- jsonwebtoken: Manejo de autenticación basada en tokens JWT.
- cors: Habilita la comunicación entre diferentes dominios.
DevDependencias
- nodemon: Recarga automática del servidor en desarrollo.

