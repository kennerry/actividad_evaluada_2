# Evaluación II - Programación Web (Ciclo 02-2026)
**Universidad Centroamericana José Simeón Cañas (UCA)**

Este repositorio contiene la solución completa para la Evaluación II del curso de Programación Web. El proyecto consta de dos ejercicios interactivos desarrollados con una **arquitectura desacoplada** utilizando el ecosistema de **Node.js, Express, React y Vite**, siguiendo el patrón **REST API** y buenas prácticas de desarrollo web.

---

## 📐 Arquitectura General del Proyecto

La solución está construida de forma totalmente desacoplada, separando la responsabilidad de presentación en el cliente (Frontend) y la lógica de negocio junto a la gestión de datos en el servidor (Backend).

```
actividad_evaluada_2/
├── ejercicio1-Adivina_el_numero/
│   ├── backend/             # Servidor Express (Puerto 3000)
│   └── frontend/            # Cliente React + Vite (Puerto 5173)
└── ejercicio2-Menu_restaurante/
    ├── backend/             # Servidor Express (Puerto 4000)
    └── frontend/            # Cliente React + Vite (Puerto 5173)
```

---

## 🚀 Ejercicios Desarrollados

### Ejercicio 1: "Adivina el Número"
Un juego interactivo de adivinanza con lógica en servidor y persistencia de sesión en el cliente.

* **Backend (Node.js + Express):**
  * Genera dinámicamente un número secreto en memoria entre 1 y 100 mediante la fórmula `Math.floor(Math.random() * 100) + 1` al iniciar o reiniciar la partida.
  * `POST /guess`: Recibe el intendo de número, lo compara con el valor oculto y responde con `"mayor"`, `"menor"` o `"correcto"`.
  * `POST /reset`: Genera un nuevo número aleatorio y reinicia el estado de la partida en el servidor.
* **Frontend (React + Vite):**
  * Control del estado reactivo con `useState` para guardar los intentos fallidos, mensajes del servidor y el historial dinámico de intentos.
  * Interfaz de entrada con validación de datos.

### Ejercicio 2: Sistema de Gestión de Reservas - Food DEI S.A. de R.L.
Sistema de catálogo y reserva en tiempo real de menús con control estricto de inventario, saldo y temporizador de expiración.

* **Endpoints REST API (Backend - Express):**
  * `GET /api/menu`: Devuelve el catálogo completo de alimentos disponibles con precio, categoría y stock.
  * `GET /api/reserva`: Retorna los detalles de la reserva activa, el saldo remanente y el total acumulado.
  * `POST /api/reserva/agregar`: Recibe `{ alimentoId, cantidad }`. Valida stock disponible (responde `400 Bad Request` si no hay existencias).
  * `PUT /api/reserva/actualizar-porciones/:id`: Permite ajustar las porciones desde el carrito. Valida si el costo supera el saldo disponible (responde `400 Bad Request` en caso de saldo insuficiente).
  * `DELETE /api/reserva/eliminar/:id`: Remueve el producto de la reserva y restituye el stock al menú principal.
* **Diseño de Interfaz (Frontend - React + Reactstrap):**
  * **Panel Superior:** Despliega de forma fija el saldo remanente y el costo total de la reserva mediante componentes `<Alert>` y `<Badge>`.
  * **Temporizador de Sesión:** Manejado con `useEffect` y `setInterval` para actualizar el tiempo en formato de cuenta regresiva, incluyendo la función de limpieza (`clearInterval`) al finalizar.
  * **Catálogo en Grid:** Renderizado responsivo (`<Row>`, `<Col>`, `<Card>`) que deshabilita dinámicamente el botón si `stock === 0`.
  * **Carrito Lateral:** Renderizado mediante `<ListGroup>` con controles `<ButtonGroup>` para la actualización en tiempo real de porciones y remoción de ítems.
  * **Manejo de Excepciones:** Captura de errores devueltos por el backend expuestos mediante `<UncontrolledAlert color="warning">`.

---

## 🛠️ Tecnologías Utilizadas

* **JavaScript (ES6+):** Variables (`let`, `const`), funciones asíncronas (`async/await`), manejo de promesas, iteradores y arreglos.
* **Backend:** Node.js, Express, Cors, Dotenv.
* **Frontend:** React.js, Vite, Reactstrap, Bootstrap, Hooks (`useState`, `useEffect`).
* **Protocolo de Comunicación:** HTTP / REST API (JSON).
* **Control de Versiones:** Git & GitHub (Flujo Gitflow colaborativo).

---

## 📦 Instrucciones de Instalación y Ejecución Local

Para clonar y ejecutar cualquiera de los dos ejercicios en tu equipo local, sigue estos pasos:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/actividad_evaluada_2.git
cd actividad_evaluada_2
```

### 2. Configurar y Ejecutar el Ejercicio 1 (Adivina el Número)

**Backend:**
```bash
cd ejercicio1-Adivina_el_numero/backend
npm install
cp .env.example .env
npm start
# Servidor corriendo en http://localhost:3000
```

**Frontend:**
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
# Cliente corriendo en http://localhost:5173
```

---

### 3. Configurar y Ejecutar el Ejercicio 2 (Menu Restaurante Food DEI)

**Backend:**
```bash
cd ejercicio2-Menu_restaurante/backend
npm install
cp .env.example .env
npm start
# Servidor corriendo en http://localhost:4000
```

**Frontend:**
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
# Cliente corriendo en http://localhost:5173
```

---

## 🔒 Variables de Entorno (`.env`)

Tanto el cliente como el servidor utilizan archivos de configuración de entorno desacoplados.

* **Backend (`backend/.env`):**
  ```env
  PORT=4000
  FRONTEND_URL=http://localhost:5173
  ```
* **Frontend (`frontend/.env`):**
  ```env
  VITE_API_URL=http://localhost:4000/api
  ```

*Nota: Por razones de seguridad, los archivos `.env` reales están excluidos mediante `.gitignore` y se incluyen plantillas `.env.example` en el repositorio.*

---

## 👥 Colaboradores
Kenneth Iván Ramos Majano 00308726
William Enrique Hernandez Rodriguez 00095725
