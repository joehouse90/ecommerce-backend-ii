# 🛒 Ecommerce Backend – Arquitectura Profesional

Backend desarrollado como Entrega Final del curso Backend II.  
El proyecto implementa una arquitectura profesional aplicando patrones de diseño, separación de capas, seguridad avanzada y lógica de negocio robusta para un ecommerce.

---

# 🚀 Stack Tecnológico

- Node.js
- Express
- MongoDB
- Mongoose
- Passport (JWT Strategy)
- Nodemailer (Ethereal para testing)
- UUID
- Bcrypt
- Dotenv
- Cookie Parser

---

# 🧱 Arquitectura Aplicada

El servidor fue diseñado siguiendo buenas prácticas profesionales:

## 📦 Separación por Capas

- Routes → Definición de endpoints
- Services → Lógica de negocio
- Repository → Intermediario entre negocio y persistencia
- DAO → Acceso directo a base de datos
- Models → Definición de esquemas Mongoose
- DTO → Transferencia segura de datos
- Middlewares → Autorización y control de acceso
- Utils → JWT, Hashing, Helpers
- Mail Service → Sistema de envío de correos

---

## 🏛 Patrones Implementados

### ✔ DAO (Data Access Object)
Encapsula las operaciones de acceso a MongoDB evitando dependencias directas desde la lógica de negocio.

### ✔ Repository Pattern
Desacopla completamente la capa de negocio de la base de datos.

### ✔ DTO (Data Transfer Object)
La ruta `/api/sessions/current` devuelve únicamente información no sensible del usuario.

### ✔ Middleware de Autorización por Roles
Controla el acceso a endpoints según el rol:

- `admin`
  - Crear productos
  - Actualizar productos
  - Eliminar productos

- `user`
  - Agregar productos al carrito

- `user` y `admin`
  - Realizar compras

---

# 🔐 Autenticación

Se utiliza JWT firmado con secret almacenado en variables de entorno.

El token:
- Se envía por cookie httpOnly
- Puede utilizarse en Authorization Header (Bearer)

Endpoints principales:

```
POST /api/sessions/register
POST /api/sessions/login
GET  /api/sessions/current
```

---

# 🔑 Sistema de Recuperación de Contraseña

Implementación completa y segura:

## Flujo:

1️⃣ Usuario envía email  
`POST /api/sessions/forgot-password`

- Genera token JWT con expiración de 1 hora
- Guarda token y fecha en base de datos
- Envía mail con enlace de recuperación

2️⃣ Usuario restablece contraseña  
`POST /api/sessions/reset-password`

Validaciones:
- Token válido
- Token no expirado
- Nueva contraseña distinta a la anterior
- Password hasheada con bcrypt
- Limpieza de token tras uso

Se utiliza Nodemailer con Ethereal para entorno de pruebas.

---

# 🛍 Lógica de Compra Profesional

Endpoint:

```
POST /api/carts/:cid/purchase
```

Funcionalidad avanzada:

- Verificación de existencia de productos
- Validación de stock disponible
- Actualización automática de stock
- Manejo de compras parciales
- Generación de Ticket
- Limpieza automática del carrito
- Respuesta con productos no procesados

---

# 🎟 Modelo Ticket

Campos:

- code (UUID único)
- amount (total compra)
- purchaser (email)
- purchase_datetime
- createdAt
- updatedAt

---

# 🛡 Seguridad Implementada

- JWT con expiración configurable
- Passwords hasheadas con bcrypt
- Protección contra reutilización de contraseña
- Tokens de recuperación con expiración
- DTO para evitar filtrado de información sensible
- Control de roles con middleware personalizado
- Variables sensibles protegidas en .env

---

# ⚙ Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=supersecreto
JWT_EXPIRES=1d
MAIL_USER=usuario_ethereal
MAIL_PASS=password_ethereal
```

---

# ▶ Instalación y Ejecución

```bash
npm install
npm run dev
```

Servidor:

```
http://localhost:8080
```

---

# 📌 Endpoints Principales

## 🛍 Productos
- GET    /api/products
- POST   /api/products (admin)
- PUT    /api/products/:pid (admin)
- DELETE /api/products/:pid (admin)

## 🛒 Carritos
- POST /api/carts
- POST /api/carts/:cid/product/:pid (user)
- POST /api/carts/:cid/purchase

## 🔐 Sesiones
- POST /api/sessions/login
- GET  /api/sessions/current
- POST /api/sessions/forgot-password
- POST /api/sessions/reset-password

---

# 🧠 Conceptos Aplicados

- Arquitectura en capas
- Separación de responsabilidades
- DAO / Repository Pattern
- DTO
- JWT Authentication
- Role Based Authorization
- Mailing Service
- Seguridad en recuperación de contraseña
- Manejo profesional de errores
- Lógica de negocio desacoplada

---

# 👨‍💻 Autor

Joel Simoes Daniel  
Entrega Final Backend II  
Arquitectura Backend Profesional
