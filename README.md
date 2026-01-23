# 🛒 E-commerce Backend – Entrega Nº1 (Backend II)

## 📌 Descripción
Primera entrega del curso **Backend II (Coderhouse)**.

El objetivo de esta entrega es implementar un sistema de **gestión de usuarios** con autenticación y autorización, utilizando **JWT y Passport**, aplicando buenas prácticas de seguridad.

El proyecto está desarrollado con **Node.js, Express y MongoDB**, y sirve como base para el proyecto final del curso.

---

## ✅ Funcionalidades implementadas

- Registro de usuarios con contraseña encriptada mediante **bcrypt**
- Login de usuarios utilizando **JWT**
- Autenticación y autorización con **Passport (estrategia JWT)**
- Ruta protegida `/api/sessions/current` para validar al usuario logueado
- Persistencia de usuarios en **MongoDB**
- Uso de variables de entorno con **dotenv**

---

## 👤 Modelo de Usuario

El modelo `User` cuenta con los siguientes campos:

- `first_name` (String)
- `last_name` (String)
- `email` (String – único)
- `age` (Number)
- `password` (String – en formato hash)
- `cart` (Referencia a Carts)
- `role` (String – valor por defecto: `user`)

---

## 🔐 Seguridad

- Las contraseñas se almacenan en formato **hash** utilizando bcrypt
- Se utiliza **JWT** para la autenticación de usuarios
- Las rutas protegidas validan el token antes de permitir el acceso
- El password no se expone en las respuestas de la API

---

## 🧰 Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- Passport
- Passport-JWT
- Bcrypt
- JSON Web Tokens (JWT)
- Dotenv
- Nodemon (entorno de desarrollo)

---

## 📁 Estructura del proyecto

src/  
├── config/  
│   └── passport.config.js  
├── models/  
│   └── user.model.js  
├── routes/  
│   └── sessions.router.js  
├── utils/  
│   ├── auth.utils.js  
│   └── jwt.utils.js  
├── app.js  
.env  
package.json  

---

## 🚀 Instalación y ejecución

1) Clonar el repositorio  
git clone https://github.com/tu-usuario/ecommerce-backend-ii.git  

2) Instalar dependencias  
npm install  

3) Crear archivo `.env`  
PORT=8080  
MONGO_URL=mongodb://localhost:27017/ecommerce  
JWT_SECRET=tu_clave_secreta  

4) Ejecutar el proyecto  
npm run dev  

El servidor se iniciará en:  
http://localhost:8080  

---

## 🧪 Endpoints principales

- POST `/api/sessions/register` → Registro de usuario  
- POST `/api/sessions/login` → Login de usuario  
- GET `/api/sessions/current` → Usuario autenticado (ruta protegida)  

La ruta `/current` requiere un token JWT enviado mediante el header `Authorization`.

---

## 📌 Formato de entrega

Repositorio en GitHub con el proyecto completo, sin incluir la carpeta `node_modules`.

---

## ✍️ Autor

Desarrollado por **Joel simoes Daniel**  
Estudiante de **Backend II – Coderhouse**, como parte del proceso de aprendizaje en desarrollo backend con Node.js.


