#CarWash & Café El Punto

> Sistema integral de gestión para centro de lavado automotriz con área de cafetería — Proyecto final de **Seminario de Proyecto I (ISW410)**, UAPA, trimestre Mayo–Julio 2026.

---

##Nombre del proyecto

**CarWash & Café El Punto** — Plataforma informática para la gestión de turnos de lavado y pedidos de cafetería con vista móvil para el cliente final mediante código QR.

---

##Descripción del sistema

CarWash & Café El Punto es un centro de lavado y estética automotriz que integra un área de cafetería climatizada con acceso a internet de alta velocidad. El negocio está soportado por una **plataforma informática propia** que digitaliza el ciclo completo del servicio:

- Registro del vehículo y del cliente.
- Asignación del turno con generación automática de código QR.
- Seguimiento en tiempo real del estado del lavado.
- Pedidos de cafetería desde el teléfono del cliente (sin descargar app).
- Facturación automática con cálculo de ITBIS 18% al completar el turno.
- Panel administrativo con dashboard, métricas y gestión de catálogo.

La plataforma se compone de dos entornos:

| Entorno | Tecnología | Uso |
|---------|-----------|-----|
| **Web administrativo** | React + Vite + Tailwind v4 | Administrador, cajero y barista |
| **Vista móvil del cliente** | React (misma SPA) | Acceso vía QR, polling cada 10 s |

---

##Objetivo

### Objetivo general

Desarrollar e implementar una plataforma informática integral para la gestión de un centro de lavado automotriz con área de cafetería, que permita digitalizar el ciclo completo del servicio (registro, asignación, seguimiento, pedidos y facturación) y mejorar la experiencia de espera del cliente final.

### Objetivos específicos

1. Construir una **API REST** en Node.js con Express y SQLite que gestione usuarios, servicios, menú, turnos, pedidos, facturas y métricas.
2. Implementar un **frontend administrativo** en React con Vite y Tailwind v4 para administrador, cajero y barista.
3. Implementar una **vista móvil del cliente** accesible por código QR, con seguimiento en tiempo real y pedidos de cafetería.
4. Integrar **autenticación basada en JWT** con tres roles diferenciados: `admin`, `cashier`, `barista`.
5. Generar **factura automática con ITBIS 18%** al completar cada turno.
6. Desplegar el sistema en un **servidor cloud** y documentar el proceso.

---

##Tecnologías utilizadas

### Backend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | 20+ | Entorno de ejecución |
| Express | 4.x | Framework HTTP |
| better-sqlite3 | última | Driver síncrono de SQLite |
| jsonwebtoken | última | Autenticación JWT |
| bcryptjs | última | Hash de contraseñas |
| qrcode | última | Generación de códigos QR |
| uuid | 4.x | Identificadores únicos |
| cors | última | Política CORS |

### Frontend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19 | Biblioteca de UI |
| Vite | última | Bundler y dev server |
| Tailwind CSS | v4 | Framework utility-first |
| React Router DOM | 6.x | Enrutamiento SPA |
| zod | última | Validación de esquemas |

### Base de datos

- **SQLite 3** con modo WAL activado y foreign keys habilitadas.
- 8 tablas relacionales: `users`, `vehicles`, `services`, `menu_items`, `wash_turns`, `cafe_orders`, `order_items`, `invoices`.

### Herramientas de gestión

- **Git + GitHub** — control de versiones
- **Trello / Jira** — tablero Scrum
- **Notion** — bitácora y documentación
- **VS Code** — IDE

---

##Estructura del repositorio

```
trabajo-final-seminario-1/
├── README.md                  ← este archivo
├── LICENSE                    ← licencia MIT
├── .gitignore
├── package.json               ← scripts raíz (concurrently)
│
├── backend/                   ← API REST en Node.js
│   ├── src/
│   │   ├── index.js           ← servidor Express
│   │   ├── database/init.js   ← esquema + seeds
│   │   ├── middleware/auth.js
│   │   └── routes/            ← auth, services, menu, turns, orders, invoices, dashboard
│   └── package.json
│
├── frontend/                  ← SPA en React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/        ← AdminLayout, ui (Modal, ConfirmDialog, etc.)
│   │   ├── lib/               ← api, auth, format
│   │   ├── pages/             ← Login, Dashboard, Turns, Orders, Services, Menu, Invoices, ClientView
│   │   └── assets/
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── tareas/                    ← Documentación académica (Tareas 1, 2, 3)
│
└── docs/                      ← Evidencias del proyecto
    └── screenshots/           ← Capturas de pantalla
```

---

##Instrucciones de instalación y ejecución

### Requisitos previos

- **Node.js v20 o superior** — [https://nodejs.org/](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Git** — [https://git-scm.com/](https://git-scm.com/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/raymiflp/trabajo-final-seminario-1.git
cd trabajo-final-seminario-1
```

### 2. Instalar dependencias

Hay tres `package.json`: el de la raíz, el del backend y el del frontend. Instala los tres:

```bash
# Raíz (instala concurrently)
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 3. Variables de entorno (opcional)

Crea un archivo `backend/.env` si quieres personalizar puertos o secretos:

```env
PORT=3000
JWT_SECRET=cambia-esto-por-una-cadena-aleatoria-larga
FRONTEND_URL=http://localhost:5174
```

> Si no defines `JWT_SECRET`, el backend usa uno por defecto (solo válido para desarrollo).

### 4. Arrancar en modo desarrollo

Desde la raíz:

```bash
npm run dev
```

Esto levanta **ambos servicios en paralelo** con `concurrently`:

| Servicio | URL | Puerto |
|----------|-----|--------|
| Backend (API) | http://localhost:3000 | 3000 |
| Frontend (web) | http://localhost:5174 | 5174 |

### 5. Credenciales por defecto (seed)

El sistema crea automáticamente un usuario administrador al primer arranque:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@carwash.com` | `admin123` | admin |

> **Cambia esta contraseña antes de cualquier despliegue real.**

### 6. Verificar la instalación

Abre en el navegador:

- **Login:** http://localhost:5174/login
- **Health check de la API:** http://localhost:3000/api/health

Deberías ver:

```json
{ "status": "ok", "project": "CarWash & Café El Punto" }
```

### 7. Compilar para producción

```bash
cd frontend
npm run build
```

El bundle optimizado queda en `frontend/dist/`.

---

## Capturas de pantalla

Las capturas de evidencia funcional del proyecto se encuentran en [`docs/screenshots/`](./docs/screenshots/).

Cada captura está documentada con su URL, descripción y rol que la utiliza. Ver el [README de capturas](./docs/screenshots/README.md) para el detalle.

---

## Evidencia funcional

La evidencia de que el sistema funciona se compone de:

1. **Capturas de pantalla** de cada vista principal — [`docs/screenshots/`](./docs/screenshots/)
2. **Datos de prueba (seed)** que el sistema genera automáticamente al primer arranque (4 servicios + 11 items del menú + 1 admin)
3. **Health check** del backend en `/api/health`
4. **Smoke test manual** del flujo crítico documentado en [`docs/pruebas-flujo.md`](./docs/pruebas-flujo.md)

### Flujo crítico validado

```
Login (admin@carwash.com / admin123)
  ↓
Crear servicio de lavado (CRUD /admin/services)
  ↓
Crear turno de vehículo (CRUD /admin/turns → genera QR)
  ↓
Cliente escanea QR desde su teléfono (/cliente?token=XXX)
  ↓
Cliente pide desde el menú (polling 10 s, estado en tiempo real)
  ↓
Barista marca pedido como Preparando → Listo → Entregado
  ↓
Operario marca turno como Completado (genera factura automática con ITBIS 18%)
  ↓
Cajero cobra la factura (/admin/invoices → seleccionar método de pago)
  ↓
Dashboard actualiza métricas cada 15 s
```

---

## 📚 Documentación académica

La documentación del proyecto final (Trabajo Final ISW410) se entrega en formato Markdown en la carpeta [`tareas/`](./tareas/):

- `tareas/tarea 1.docx` — Definición del proyecto
- `tareas/TAREA 2 SP1(1).docx` — Análisis y planificación
- `tareas/TAREA 3 SP1(1).docx` — Presupuesto
- `tareas/FASE_ANALISIS.txt` — Fase de análisis
- `tareas/GUION-VIDEO-AVANCE.md` — Guion del video demostrativo
- `tareas/TRABAJO_FINAL_ELABORADO.md` — Trabajo final elaborado

---

## Autor

**Raymi German** — Matrícula 100048833
**Asignatura:** Seminario de Proyecto I
**Universidad:** UAPA — Escuela de Ingeniería y Tecnología
**Trimestre:** Mayo–Julio 2026

---

##Licencia

Este proyecto está licenciado bajo la **MIT License** — ver el archivo [`LICENSE`](./LICENSE) para los detalles.

```
MIT License

Copyright (c) 2026 Raymi German

Se concede permiso, sin cargo alguno, a cualquier persona que obtenga una copia
de este software y archivos de documentación asociados...
```

---

##Contribuciones

Este es un proyecto académico individual. Las contribuciones externas no son aceptadas en este repositorio.

Para reportar errores o sugerencias, abrir un [issue en GitHub](https://github.com/raymiflp/trabajo-final-seminario-1/issues).
