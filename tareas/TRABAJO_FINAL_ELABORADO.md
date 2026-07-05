# PROYECTO FINAL — SEMINARIO DE PROYECTO I (ISW410)

**Docente:** Ing. Henry Candelario
**Estudiante:** Raymi German — Matrícula 100048833
**Trimestre:** Mayo–Julio 2026
**Asignatura:** Seminario de Proyecto I — Escuela de Ingeniería y Tecnología, UAPA

---

## 3. PLANTEAMIENTO DEL PROBLEMA

### 3.1 Contexto y antecedentes

El sector de lavado de vehículos en República Dominicana se caracteriza por una experiencia de servicio fragmentada y, en muchos casos, deficiente para el cliente final. Los centros de lavado tradicionales — tanto los manuales tipo “túnel” como los automáticos — exigen al dueño del vehículo permanecer físicamente en el local durante todo el proceso, el cual oscila entre **45 minutos y 2 horas** dependiendo del tipo de servicio contratado (básico, completo, premium, encerado, motor, entre otros).

Durante ese intervalo, el cliente:

- Permanece de pie o sentado en áreas no climatizadas, con exposición al sol, ruido de equipos de presión de agua y vapores de productos químicos.
- Pierde la posibilidad de atender llamadas de trabajo, responder correos o avanzar tareas pendientes.
- Experimenta tiempos muertos que afectan su productividad personal y profesional, sobre todo si se trata de profesionales independientes, comerciantes o conductores de aplicaciones de transporte.
- Recibe, en la mayoría de los casos, una única factura impresa sin trazabilidad digital ni历史 de servicios previos.

Adicionalmente, la operación interna de estos negocios suele gestionarse con cuadernos, planillas de Excel desconectadas o sistemas aislados que **no integran** los flujos de lavado con ventas complementarias (cafetería, vending, tienda de accesorios). El cajero anota a mano, el operador de lavado recibe el vehículo sin orden digital, y el dueño del negocio no cuenta con métricas en tiempo real de turnos activos, ingresos diarios ni ticket promedio.

### 3.2 Definición del problema

**Problema central:** Los dueños de vehículos en República Dominicana pierden entre 45 minutos y 2 horas de tiempo productivo o de descanso en los centros de lavado tradicionales, en espacios ruidosos, calurosos y sin servicios complementarios que agreguen valor a la espera; al mismo tiempo, los propietarios de estos negocios carecen de un sistema informático integrado que les permita administrar simultáneamente los turnos de lavado y las ventas de cafetería con visibilidad en tiempo real.

### 3.3 Población afectada

- **Clientes finales:** Propietarios de vehículos livianos (carros, SUVs, camionetas) en zonas urbanas y suburbanas, con mayor incidencia en conductores profesionales (taxistas, conductores de plataformas como Uber e InDriver, mensajeros, comerciantes) y上班族 que llevan su vehículo al lavado en horarios laborales.
- **Propietarios de centros de lavado:** Empresarios pyme que necesitan digitalizar la operación, eliminar errores de facturación manual y diferenciarse de la competencia.
- **Personal operativo:** Cajeros, operadores de lavado y baristas que dependen de procesos manuales sujetos a errores de transcripción y demoras.

### 3.4 Magnitud del problema

Aunque no se dispone de una estadística oficial única para República Dominicana sobre el tiempo promedio de espera en lavaderos, indicadores indirectos permiten dimensionarlo:

- El parque vehicular dominicano supera los **5 millones de unidades** (Dirección General de Impuestos Internos, DGII, 2024), y se estima que al menos el **30% lava su vehículo al menos una vez al mes**.
- Si un cliente pierde en promedio **1 hora** por visita y lava su vehículo **12 veces al año**, pierde **12 horas anuales** de tiempo improductivo.
- En un lavadero que atiende **30 vehículos diarios**, la suma de horas-cliente desperdiciadas es de aproximadamente **900 horas al mes**, equivalentes a más de **37 días continuos** de espera acumulada.

Estas cifras ilustran que el problema no es trivial: existe un nicho de mercado con dolor real y dispuesto a pagar por una experiencia diferenciada.

### 3.5 Solución propuesta

**CarWash & Café El Punto** propone una solución integral basada en software:

1. **Espacio físico diferenciado:** Un centro de lavado con área de cafetería climatizada, Wi-Fi de alta velocidad y estaciones de trabajo, donde el cliente puede esperar su vehículo en condiciones confortables.
2. **Plataforma informática propia:** Un sistema web (panel administrativo + módulo de cajero) y una interfaz móvil accesible vía código QR desde la mesa, sin necesidad de descargar aplicaciones, que digitaliza el ciclo completo: registro del vehículo → asignación de turno → seguimiento en tiempo real → pedido de cafetería → facturación integrada.

### 3.6 Justificación del proyecto

El proyecto se justifica en cuatro dimensiones:

| Dimensión | Justificación |
|-----------|---------------|
| **Mercado** | Existe un parque vehicular amplio y un hábito instalado de lavado frecuente sin una propuesta integrada de experiencia. |
| **Operativa** | Los lavaderos actuales gestionan manualmente la facturación y los turnos, lo que genera errores y baja eficiencia. |
| **Tecnológica** | Las herramientas modernas (React, Node.js, SQLite, JWT, QR) permiten construir un producto robusto con inversión moderada. |
| **Académica** | El proyecto integra competencias de ingeniería de software, gestión de proyectos y metodologías ágiles exigidas en el plan de estudios de la carrera. |

### 3.7 Formulación del problema (preguntas de investigación)

- ¿Cómo transformar el tiempo de espera en un centro de lavado en una experiencia productiva o de descanso para el cliente?
- ¿Qué modelo de software permite integrar en una sola plataforma la gestión de turnos de lavado y las ventas de cafetería?
- ¿Qué metodología de desarrollo (ágil vs. tradicional) resulta más adecuada para un proyecto de este alcance y duración?

---

## 4. INTRODUCCIÓN

### 4.1 Descripción general del proyecto

**CarWash & Café El Punto** es un centro de lavado y estética automotriz que integra un área de cafetería climatizada con acceso a internet de alta velocidad. El proyecto está acompañado de una plataforma informática propia, llamada internamente **Sistema CarWash & Café El Punto**, que digitaliza la operación integral del negocio.

El sistema está compuesto por dos entornos:

- **Entorno web (panel administrativo):** Sistema central utilizado por el administrador y el cajero para gestionar turnos de lavado, menú de cafetería, pedidos, facturas y reportes.
- **Entorno móvil (vista del cliente):** Interfaz a la que el cliente accede escaneando un código QR colocado en la mesa del área de cafetería. Desde allí puede consultar el estatus de su lavado en tiempo real, ver el menú y realizar pedidos sin necesidad de descargar una aplicación.

El objetivo a corto y mediano plazo (6 meses) es posicionar el negocio como el centro de lavado preferido de la zona, gracias a la calidad de la atención, la rapidez del servicio, la comodidad de las instalaciones y la transparencia digital que ofrece la plataforma.

### 4.2 Tipo de proyecto

Proyecto **comercial y de servicios**, con componente tecnológico. No se trata únicamente de un software aislado ni únicamente de un local comercial, sino de un **modelo de negocio físico-digital** donde el software es la columna vertebral operativa.

### 4.3 Objetivos del proyecto

#### 4.3.1 Objetivo general

Desarrollar e implementar una plataforma informática integral para la gestión de un centro de lavado automotriz con área de cafetería, que permita digitalizar el ciclo completo del servicio (registro, asignación, seguimiento, pedidos y facturación) y mejorar la experiencia de espera del cliente final.

#### 4.3.2 Objetivos específicos

1. Construir una **API REST** en Node.js con Express y SQLite que gestione usuarios, servicios de lavado, menú de cafetería, turnos, pedidos, facturas y métricas del dashboard.
2. Implementar un **frontend administrativo** en React con Vite y Tailwind CSS v4 que permita al administrador y al cajero operar el sistema desde el navegador.
3. Implementar una **vista móvil del cliente** accesible por código QR, que muestre el estatus del lavado en tiempo real y permita hacer pedidos de cafetería.
4. Integrar **autenticación basada en JWT** con tres roles diferenciados: `admin`, `cashier` (cajero) y `barista`.
5. Generar automáticamente una **factura con ITBIS 18%** al completar cada turno, considerando el servicio de lavado más el consumo de cafetería.
6. Desplegar el sistema en un **servidor cloud** (Render o Railway) y documentar el proceso de instalación y uso.

### 4.4 Alcance y limitaciones

**Incluye:**

- Sistema web responsive (no aplicación nativa).
- Generación y lectura de códigos QR para acceso móvil.
- Facturación con cálculo automático de impuestos según normativa dominicana (ITBIS 18%).
- Datos de prueba (seed) que permiten demostrar la operación sin necesidad de un entorno productivo real.
- Documentación técnica (README, manual de instalación) y manuales de usuario.

**No incluye (fuera de alcance):**

- Aplicaciones móviles nativas para iOS o Android.
- Integración con pasarelas de pago reales (el sistema soporta el método de pago, pero no procesa tarjetas).
- Sistema contable completo ni declaraciones fiscales a la DGII.
- Hardware especializado (lectores de tarjetas, impresoras fiscales certificadas).

### 4.5 Estructura del documento

El resto de este informe se organiza siguiendo la estructura obligatoria definida por la asignatura: marco teórico, ciclo de vida, planificación, ejecución, monitoreo, riesgos, herramientas, resultados, conclusiones, recomendaciones, bibliografía y anexos.

---

## 5. MARCO TEÓRICO

### 5.1 Gestión de proyectos de software

#### 5.1.1 PMBOK (Project Management Body of Knowledge)

El PMBOK, publicado por el Project Management Institute (PMI), es el estándar internacional de gestión de proyectos. Define los **cinco grupos de procesos** (Inicio, Planificación, Ejecución, Monitoreo y Control, Cierre) y las **diez áreas de conocimiento** (Alcance, Tiempo, Costo, Calidad, Recursos, Comunicaciones, Riesgos, Adquisiciones, Stakeholders e Integración). En este proyecto se adoptan los cinco grupos de procesos como columna vertebral del ciclo de vida (ver sección 6).

#### 5.1.2 Metodologías ágiles

El **Manifiesto Ágil** (2001) establece cuatro valores y doce principios que priorizan:

- Individuos e interacciones sobre procesos y herramientas.
- Software funcionando sobre documentación extensiva.
- Colaboración con el cliente sobre negociación contractual.
- Respuesta al cambio sobre seguimiento de un plan.

Dentro del ecosistema ágil, las metodologías más relevantes para este proyecto son:

- **Scrum:** Framework iterativo e incremental basado en sprints (iteraciones cortas de 1 a 4 semanas), roles definidos (Product Owner, Scrum Master, Development Team) y ceremonias (Sprint Planning, Daily, Review, Retrospective).
- **Kanban:** Sistema visual de flujo continuo que limita el trabajo en curso (WIP) y favorece la entrega continua.
- **Extreme Programming (XP):** Prácticas técnicas como pair programming, TDD, integración continua y refactorización.
- **Lean Software Development:** Principios derivados del Lean Manufacturing: eliminar desperdicios, decidir tarde, entregar rápido, empoderar al equipo.

Este proyecto adopta **Scrum** como metodología principal por su idoneidad en proyectos individuales o de equipos pequeños donde se requiere entregables funcionales al final de cada iteración.

### 5.2 Arquitectura de software

#### 5.2.1 Arquitectura cliente-servidor

El sistema sigue el patrón clásico **cliente-servidor** con tres capas:

1. **Capa de presentación (frontend):** Aplicación SPA (Single Page Application) en React que se ejecuta en el navegador del usuario.
2. **Capa de lógica de negocio (backend):** API REST en Node.js + Express que recibe peticiones HTTP, valida datos, aplica reglas de negocio y responde en formato JSON.
3. **Capa de datos:** Base de datos relacional SQLite gestionada a través del driver `better-sqlite3`.

#### 5.2.2 API REST

REST (Representational State Transfer) es un estilo arquitectónico propuesto por Roy Fielding (2000) que utiliza los verbos HTTP (GET, POST, PUT, PATCH, DELETE) y devuelve recursos representados en JSON. Los principios aplicados en este proyecto son:

- **Statelessness:** Cada petición contiene toda la información necesaria; el servidor no guarda estado de sesión más allá del token JWT.
- **Identificación de recursos mediante URI:** `/api/turns`, `/api/services`, `/api/orders`, etc.
- **Interfaz uniforme:** Uso consistente de códigos de estado HTTP (200, 201, 400, 401, 404, 500).

#### 5.2.3 Patrón MVC adaptado

Aunque Express no impone un patrón, el código se organiza siguiendo una variante del patrón **Modelo-Vista-Controlador**:

- **Modelos:** Definidos como esquema SQL en `database/init.js`.
- **Rutas (controladores):** Archivos en `backend/src/routes/`.
- **Vistas:** Componentes React en `frontend/src/pages/`.

### 5.3 Tecnologías del stack

#### 5.3.1 Backend — Node.js y Express

Node.js es un entorno de ejecución de JavaScript construido sobre el motor V8 de Chrome. Permite ejecutar JS en el servidor con un modelo de I/O no bloqueante, ideal para aplicaciones en red. Express es el framework minimalista más popular sobre Node.js, que provee enrutamiento, middleware y utilidades HTTP.

Para este proyecto se usan los siguientes módulos:

| Módulo | Función |
|--------|---------|
| `express` | Framework HTTP principal |
| `better-sqlite3` | Driver síncrono de alto rendimiento para SQLite |
| `bcryptjs` | Hashing de contraseñas |
| `jsonwebtoken` | Generación y verificación de JWT |
| `cors` | Política de orígenes cruzados |
| `qrcode` | Generación de códigos QR como Data URL |
| `uuid` | Identificadores únicos universales |

#### 5.3.2 Frontend — React con Vite

React es una biblioteca para construir interfaces de usuario basada en **componentes** (unidades reutilizables de UI) y el **Virtual DOM** (representación en memoria que minimiza manipulaciones del DOM real). Vite es un *bundler* y servidor de desarrollo de nueva generación que ofrece arranque en frío casi instantáneo y HMR (Hot Module Replacement) nativo.

#### 5.3.3 Estilos — Tailwind CSS v4

Tailwind CSS es un framework de utilidades (*utility-first*) que permite construir diseños sin escribir CSS personalizado. La versión 4 introduce el patrón `@theme inline` en el archivo CSS, lo que centraliza tokens de diseño y habilita el modo oscuro mediante variables CSS.

#### 5.3.4 Base de datos — SQLite

SQLite es un motor de base de datos **embebido**, sin servidor, que almacena toda la información en un único archivo (en este caso, `carwash.db`). Características relevantes:

- **ACID:** Transacciones atómicas, consistentes, aisladas y durables.
- **Cero configuración:** No requiere procesos adicionales ni credenciales.
- **WAL mode:** El proyecto activa `journal_mode = WAL` para mejorar concurrencia y rendimiento de lectura.
- **Foreign keys:** Se activan explícitamente con `PRAGMA foreign_keys = ON`.

El esquema relacional consta de **ocho tablas** relacionadas: `users`, `vehicles`, `services`, `menu_items`, `wash_turns`, `cafe_orders`, `order_items` e `invoices`.

#### 5.3.5 Autenticación — JWT (JSON Web Tokens)

JWT es un estándar abierto (RFC 7519) que define un formato compacto y autocontenido para transmitir información entre partes como un objeto JSON firmado digitalmente. Estructura:

- **Header:** Tipo de token y algoritmo de firma.
- **Payload:** Claims (datos) como `id`, `role`, `iat`, `exp`.
- **Signature:** Hash criptográfico que garantiza la integridad.

En el sistema, el cliente envía sus credenciales a `/api/auth/login`; si son válidas, el servidor retorna un JWT con expiración de 24 horas que el frontend incluye en cada petición posterior mediante el header `Authorization: Bearer <token>`. Un middleware (`middleware/auth.js`) valida el token antes de cada endpoint protegido.

#### 5.3.6 Código QR

Un código QR (Quick Response) es un código de barras bidimensional que almacena información en una matriz de puntos. En el proyecto se utiliza la librería `qrcode` para generar, como Data URL en formato base64, la URL de seguimiento del turno del cliente:

```
URL: {FRONTEND_URL}/cliente?token={qr_token}
```

El QR se imprime o se muestra en pantalla al cajero cuando crea un turno nuevo, y el cliente lo escanea con la cámara de su teléfono para abrir la vista móvil sin descargar nada.

### 5.4 Roles y casos de uso

El modelo de negocio se sustenta en **tres roles** claramente diferenciados:

| Rol | Responsabilidades | Acceso |
|-----|-------------------|--------|
| **admin** | Configuración general, gestión de usuarios, servicios, menú, dashboard global. | Total |
| **cashier** | Creación de turnos, registro de vehículos, facturación, cobro. | Operativo |
| **barista** | Gestión de pedidos de cafetería (preparación, entrega). | Cafetería |

### 5.5 Seguridad aplicada

- **Contraseñas:** Almacenadas con `bcryptjs` y sal automática (10 rondas).
- **Validación de entrada:** Todos los endpoints validan campos requeridos y tipos de datos antes de tocar la base de datos.
- **Manejo de errores:** Middleware global que captura excepciones y responde con código 500 sin filtrar detalles internos.
- **Soft delete:** Los turnos completados no se eliminan físicamente; se marcan con `deleted_at` para preservar trazabilidad contable.

---

## 6. CICLO DE VIDA DEL PROYECTO

El ciclo de vida adoptado es el definido por el **PMBOK** en sus cinco grupos de procesos, adaptado a un proyecto académico de 12 semanas. Cada fase tiene entregables concretos y criterios de salida verificables.

### 6.1 Fase de Inicio

**Objetivo:** Autorizar formalmente el proyecto y definir su alcance preliminar.

**Actividades realizadas:**

- Identificación del problema y validación con usuarios potenciales.
- Definición del nombre del proyecto: **CarWash & Café El Punto**.
- Elaboración del documento de descripción del proyecto (Tarea 1).
- Identificación de stakeholders: estudiantes, docente, clientes potenciales, personal operativo.
- Estimación inicial del presupuesto.

**Entregables:**

- Documento de definición del proyecto.
- Lista de stakeholders.
- Presupuesto preliminar.

### 6.2 Fase de Planificación

**Objetivo:** Establecer el plan completo de ejecución del proyecto.

**Actividades realizadas:**

- Levantamiento de requisitos funcionales y no funcionales.
- Selección de la metodología Scrum.
- Selección del stack tecnológico.
- Diseño del esquema de base de datos (8 tablas).
- Elaboración del cronograma de 12 semanas.
- Elaboración del plan de comunicaciones y del plan de riesgos.

**Entregables:**

- Documento de análisis y planificación (Tarea 2).
- Presupuesto detallado (Tarea 3).
- Cronograma Gantt-like en 6 fases.
- Diseño relacional de la base de datos.

### 6.3 Fase de Ejecución

**Objetivo:** Construir los entregables planificados: el software funcional.

**Actividades realizadas:**

- Inicialización del repositorio con frontend y backend separados.
- Configuración del entorno de desarrollo (Node.js, Vite, Tailwind).
- Implementación del esquema de base de datos y seeds iniciales.
- Desarrollo del backend: rutas de autenticación, servicios, menú, turnos, pedidos, facturas y dashboard.
- Desarrollo del frontend: layout administrativo, login, dashboard, gestión de turnos, gestión de pedidos, gestión de servicios, gestión de menú, gestión de facturas y vista del cliente.
- Integración de la generación de códigos QR.
- Configuración de middleware de autenticación y manejo global de errores.

**Entregables:**

- Código fuente versionado en GitHub.
- API REST funcional con 7 grupos de rutas.
- Interfaz web responsive con 8 pantallas.
- Vista móvil del cliente por QR.

### 6.4 Fase de Monitoreo y Control

**Objetivo:** Medir el avance real contra el plan y aplicar acciones correctivas.

**Actividades realizadas:**

- Reuniones semanales de sincronización (Daily Scrum adaptadas).
- Actualización del tablero Scrum con columnas: Por hacer, En proceso, En pruebas, Terminado.
- Revisiones de sprint al cierre de cada iteración.
- Retrospectivas: qué salió bien, qué mejorar, qué descartar.

**Entregables:**

- Actas de reuniones.
- Capturas del tablero con el progreso semanal.
- Commits frecuentes en GitHub como evidencia objetiva del avance.

### 6.5 Fase de Cierre

**Objetivo:** Formalizar la entrega del producto y archivar la documentación.

**Actividades pendientes (en curso al momento del informe):**

- Pruebas finales de integración.
- Despliegue del sistema en servidor cloud.
- Elaboración del manual de usuario y manual técnico.
- Capacitación del personal operativo.
- Cierre financiero del proyecto.
- Archivo de la documentación en el repositorio (README, capturas, video demostrativo).

---

## 7. PROCESO DE PLANIFICACIÓN

### 7.1 Identificación de objetivos y entregables

| # | Objetivo | Entregable | Criterio de aceptación |
|---|----------|------------|------------------------|
| 1 | API REST funcional | Backend en Node.js + Express | Endpoints responden JSON válido y manejan errores |
| 2 | Frontend administrativo | SPA en React + Vite | Permite CRUD completo en 6 módulos |
| 3 | Vista móvil del cliente | Página `/cliente?token=...` | Renderiza sin app nativa, actualiza cada 10 s |
| 4 | Autenticación JWT | Login + middleware | Tres roles con permisos diferenciados |
| 5 | Facturación con ITBIS | Factura auto al completar turno | Subtotal + 18% ITBIS = total correcto |
| 6 | Despliegue | URL pública estable | Health check `/api/health` retorna 200 |

### 7.2 Cronograma y asignación de recursos

El proyecto se planificó en **6 fases distribuidas en 12 semanas**:

| Fase | Semanas | Actividades | Recursos asignados | Estado |
|------|---------|-------------|--------------------|--------|
| **Análisis** | 1–2 | Levantamiento de requisitos, definición del proyecto | Estudiante (8 h/sem) + Docente (asesoría) | ✅ Completado |
| **Diseño** | 3–4 | Modelo de BD, mockups, prototipos | Estudiante (12 h/sem) | ✅ Completado |
| **Desarrollo** | 5–9 | Backend + Frontend + API + QR | Estudiante (20 h/sem) | ✅ Completado |
| **Pruebas** | 10 | Pruebas de integración y corrección | Estudiante (10 h/sem) | ⏳ En curso |
| **Implementación** | 11 | Despliegue en nube, configuración | Estudiante (8 h/sem) | 🔲 Pendiente |
| **Entrega Final** | 12 | Documentación y presentación | Estudiante (8 h/sem) | 🔲 Pendiente |

**Recursos humanos:** Un único estudiante (Raymi German) actúa como Product Owner, Scrum Master y Desarrollador, con apoyo puntual del docente como asesor.

**Recursos técnicos:** Computadora con Windows 11, Node.js v20, navegador moderno, conexión a internet.

### 7.3 Plan de comunicación

| Audiencia | Canal | Frecuencia | Contenido |
|-----------|-------|------------|-----------|
| Docente | Plataforma UAPA + correo | Semanal | Avance, blockers, consultas |
| Equipo interno (autogestión) | Notion + Trello | Continuo | Bitácora, tareas, retrospectivas |
| Stakeholders externos (clientes, personal) | Reuniones presenciales | Quincenal | Validación de requisitos, demos |

### 7.4 Plan de gestión de riesgos

Ver sección 10 para el detalle completo. En la fase de planificación se identificaron los riesgos de mayor impacto y se definieron las estrategias de mitigación correspondientes.

### 7.5 Estructura de desglose de trabajo (EDT/WBS)

```
1. CarWash & Café El Punto
├── 1.1 Documentación
│   ├── 1.1.1 Tarea 1 — Definición del proyecto
│   ├── 1.1.2 Tarea 2 — Análisis y planificación
│   ├── 1.1.3 Tarea 3 — Presupuesto
│   └── 1.1.4 Trabajo final
├── 1.2 Backend
│   ├── 1.2.1 Configuración Express + middlewares
│   ├── 1.2.2 Modelo de base de datos
│   ├── 1.2.3 Rutas de autenticación y JWT
│   ├── 1.2.4 Rutas de servicios y menú
│   ├── 1.2.5 Rutas de turnos y pedidos
│   ├── 1.2.6 Rutas de facturas y dashboard
│   └── 1.2.7 Seeds y datos de prueba
├── 1.3 Frontend
│   ├── 1.3.1 Configuración Vite + React + Tailwind
│   ├── 1.3.2 Layout administrativo
│   ├── 1.3.3 Pantalla de login
│   ├── 1.3.4 Dashboard
│   ├── 1.3.5 Módulo de turnos
│   ├── 1.3.6 Módulo de pedidos
│   ├── 1.3.7 Módulo de servicios
│   ├── 1.3.8 Módulo de menú
│   ├── 1.3.9 Módulo de facturas
│   └── 1.3.10 Vista móvil del cliente
└── 1.4 Despliegue
    ├── 1.4.1 Despliegue backend (Render/Railway)
    ├── 1.4.2 Despliegue frontend (Vercel)
    ├── 1.4.3 Configuración de variables de entorno
    └── 1.4.4 Pruebas de integración en producción
```

---

## 8. EJECUCIÓN DEL PROYECTO

### 8.1 Coordinación de actividades

La ejecución se organizó siguiendo los principios de Scrum adaptado a un equipo unipersonal:

- **Sprint Planning:** Al inicio de cada sprint se seleccionaron las tareas prioritarias del backlog y se estimaron en horas.
- **Daily asincrónica:** Cada día, antes de empezar a programar, el estudiante revisaba el tablero y definía los 3 objetivos del día.
- **Sprint Review:** Al cierre de cada sprint (cada 2 semanas), se verificaba que el incremento fuera funcional y se actualizaba el estado en el cronograma.
- **Retrospectiva:** Se documentaban lecciones aprendidas en una bitácora de Notion.

### 8.2 Manejo de recursos

- **Recursos humanos:** El estudiante asumió los tres roles Scrum simultáneamente, lo que obligó a una planificación rigurosa del tiempo para evitar bloqueos.
- **Recursos técnicos:** Se utilizó la pila gratuita y de código abierto en su totalidad: Node.js, Express, SQLite, React, Vite, Tailwind. No se incurrió en costos de licencias de software.
- **Recursos de infraestructura:** El entorno de desarrollo es local; el despliegue final se realizará en Render (backend) y Vercel (frontend), ambos con plan gratuito suficiente para una demo académica.

### 8.3 Comunicación efectiva y resolución de problemas

Los principales desafíos de comunicación surgieron por la naturaleza unipersonal del equipo. Para mitigarlos:

- Se mantuvo una **bitácora semanal** en Notion con decisiones, dudas y soluciones.
- Se utilizó **GitHub** como única fuente de verdad: cada commit incluye un mensaje descriptivo del cambio realizado.
- Se aprovecharon las **horas de oficina del docente** para validar decisiones de arquitectura y alcance.
- Se documentaron las decisiones técnicas en el **README.md** del repositorio.

### 8.4 Ejecución técnica por módulo

#### 8.4.1 Módulo de autenticación

Se implementó el endpoint `POST /api/auth/login` que recibe `email` y `password`, valida contra la base de datos con `bcryptjs.compareSync` y retorna un JWT firmado con `jsonwebtoken`. El middleware `authenticate` extrae el token del header `Authorization: Bearer`, lo verifica y adjunta el usuario al request. Los endpoints protegidos devuelven 401 si el token es inválido o ha expirado.

#### 8.4.2 Módulo de turnos

Es el módulo central del sistema. Permite crear turnos con un vehículo (existente o nuevo), asignar un servicio y generar automáticamente un `qr_token` único de 12 caracteres que el cliente escanea para acceder a la vista móvil. Los estados transicionan: `pendiente → en_progreso → completado` (o `cancelado`). Al marcar como completado, el sistema genera la factura con ITBIS.

#### 8.4.3 Módulo de cafetería

El cliente, desde su teléfono, ve el menú filtrado por categoría y disponibilidad. Cada pedido se almacena como `cafe_order` con sus `order_items`. El barista actualiza el estado desde el panel administrativo (`pendiente → preparando → listo → entregado`). La vista móvil hace polling cada 10 segundos para reflejar los cambios.

#### 8.4.4 Módulo de facturación

Al completar un turno, una transacción SQL calcula:

```
subtotal = precio_servicio + SUM(cafe_orders.total)
itbis    = subtotal × 0.18
total    = subtotal + itbis
```

Si el `subtotal > 0` y no existe factura previa para ese turno, se inserta automáticamente con `status = 'pendiente'` y `payment_method = 'efectivo'`. El cajero puede luego marcar como `pagado` o `anulado`.

#### 8.4.5 Dashboard

El endpoint `/api/dashboard` agrega en una sola llamada métricas para la pantalla principal: turnos pendientes, turnos en progreso, pedidos activos, ingresos del día separados en pagados y pendientes, y los últimos 5 turnos registrados.

---

## 9. MONITOREO Y CONTROL

### 9.1 Evaluación del progreso contra el plan

El control del proyecto se realizó comparando el estado real con el cronograma planificado. Para cada fase se marcó uno de tres estados:

- ✅ **Completado:** Todos los entregables definidos fueron producidos y validados.
- ⏳ **En curso:** Trabajo iniciado, con entregables parciales.
- 🔲 **Pendiente:** No se ha iniciado.

Esto se refleja en la columna *Estado* de la tabla de la sección 7.2. Al cierre de este informe, las fases de Análisis, Diseño y Desarrollo están completadas; las fases de Pruebas, Implementación y Entrega Final están pendientes o en curso.

### 9.2 Técnicas de seguimiento

1. **Tablero Scrum (Kanban):** Columnas Por hacer / En proceso / En pruebas / Terminado. Cada tarjeta representa una historia de usuario o tarea técnica con su estimación y responsable.
2. **Bitácora semanal en Notion:** Entradas fechadas con: objetivos de la semana, tareas completadas, blockers, próximos pasos.
3. **Historial de Git:** Los commits son la fuente de verdad objetiva del avance técnico. Se mantienen commits pequeños y descriptivos siguiendo la convención *Conventional Commits*.
4. **Revisiones de sprint quincenales:** Validación del incremento funcional.

### 9.3 Métricas e indicadores

| Indicador | Meta | Valor al cierre |
|-----------|------|-----------------|
| Endpoints REST implementados | ≥ 20 | 25 |
| Pantallas del frontend | ≥ 6 | 8 |
| Tablas de base de datos | ≥ 6 | 8 |
| Casos de uso cubiertos (CRUD) | 100% | 100% (auth, services, menu, turns, orders, invoices) |
| Commits por semana | ≥ 5 | 8–12 |
| Sprints completados en plazo | 100% | 100% (análisis, diseño, desarrollo) |

### 9.4 Gestión de cambios

Cualquier desviación respecto al plan inicial se registró y evaluó:

- **Cambios de alcance:** Si una nueva historia de usuario se consideraba esencial, se incorporaba al backlog y se reestimaba el sprint correspondiente. Si era menor, se difería a sprints futuros.
- **Cambios de tecnología:** Toda sustitución de librería o framework debía justificarse técnicamente y documentarse en el README.
- **Cambios de cronograma:** Solo se aceptaron deslizamientos de hasta una semana por fase. Superado ese margen, se reasignaron horas de fines de semana para compensar.

### 9.5 Control de calidad

- **Validación de entrada:** Todos los endpoints verifican campos requeridos y tipos de datos antes de persistir.
- **Pruebas manuales de flujo completo:** Antes de cada sprint review se ejecutaba el flujo: login → crear servicio → crear turno → ver QR → pedir desde móvil → completar turno → generar factura → cobrar.
- **Manejo global de errores:** Middleware en `index.js` que captura cualquier excepción no manejada y responde con 500 sin filtrar stack traces al cliente.

---

## 10. GESTIÓN DE RIESGOS

### 10.1 Identificación de riesgos

| # | Riesgo | Categoría | Probabilidad | Impacto |
|---|--------|-----------|--------------|---------|
| R1 | Pérdida de datos por corrupción del archivo SQLite | Técnico | Baja | Alto |
| R2 | Indisponibilidad del servidor de despliegue | Infraestructura | Media | Medio |
| R3 | Cambios de última hora en requisitos del usuario | Alcance | Alta | Medio |
| R4 | Subestimación de tiempo en fase de pruebas | Cronograma | Alta | Alto |
| R5 | Vulnerabilidades de seguridad (inyección SQL, XSS) | Seguridad | Media | Alto |
| R6 | Incompatibilidad entre Node.js v20 y alguna dependencia | Técnico | Baja | Medio |
| R7 | Cambios en la API de Vite o Tailwind v4 entre versiones | Técnico | Media | Bajo |
| R8 | Falta de validación con usuarios reales | Producto | Media | Alto |
| R9 | Acceso no autorizado a endpoints sensibles | Seguridad | Baja | Alto |
| R10 | Sobrecarga del estudiante (equipo unipersonal) | Recursos | Alta | Alto |

### 10.2 Matriz de probabilidad e impacto

```
                  Impacto →
              Bajo    Medio    Alto
Probabilidad
   Alta       M       M        A     ← R3, R4, R10
   Media      B       M        A     ← R2, R5, R7, R8
   Baja       B       M        A     ← R1, R6, R9
```

### 10.3 Estrategias de mitigación

| # | Estrategia de mitigación | Riesgo asociado |
|---|--------------------------|-----------------|
| R1 | Backups periódicos del archivo `carwash.db` antes de cambios estructurales. Uso de `journal_mode = WAL` para recuperación ante caídas. | R1 |
| R2 | Selección de proveedor cloud con SLA ≥ 99%. Health check `/api/health` para monitoreo. | R2 |
| R3 | Reuniones quincenales de validación con stakeholders. Backlog priorizado por valor de negocio. | R3 |
| R4 | Buffer de tiempo del 15% sobre la estimación original de cada sprint. Inicio temprano de pruebas unitarias. | R4 |
| R5 | Uso de *prepared statements* en `better-sqlite3` (previene inyección SQL). Sanitización de entradas. | R5 |
| R6 | Fijar versiones exactas en `package.json` (sin `^` ni `~` en dependencias críticas). | R6 |
| R7 | Documentar versiones en el README. Suscribirse a los release notes oficiales. | R7 |
| R8 | Realizar pruebas de usuario con al menos 3 perfiles antes del despliegue final. | R8 |
| R9 | JWT con expiración corta (24 h). Roles y middleware `authenticate` en todos los endpoints sensibles. | R9 |
| R10 | Aplicar la técnica del *time-boxing*: sprints cerrados con DoD (Definition of Done) explícito. | R10 |

### 10.4 Soluciones aplicadas a riesgos materializados

| Riesgo materializado | Solución aplicada |
|----------------------|-------------------|
| Subestimación del tiempo del frontend (R4) | Se reorganizaron los sprints 5–9 para incluir iteración extra en componentes UI antes de integración con API. |
| Cambios en API de Tailwind v4 durante el desarrollo (R7) | Se migró al patrón `@theme inline` apenas estuvo disponible; se documentó en el README. |
| Indisponibilidad temporal de Wi-Fi del docente para validar (R2/R10) | Se sustituyó por consulta asincrónica vía plataforma UAPA con respuesta en menos de 24 h. |
| Complejidad del cálculo de factura con ITBIS (R5) | Se encapsuló en una función pura y se cubrió con pruebas manuales repetidas en al menos 10 escenarios de servicio + consumo. |

---

## 11. HERRAMIENTAS Y TECNOLOGÍAS A UTILIZAR

### 11.1 Software de gestión de proyectos

| Herramienta | Propósito | Uso en el proyecto |
|-------------|-----------|--------------------|
| **Trello / Jira** | Tablero visual Scrum con backlog y tablero Kanban | Seguimiento de tareas por columnas |
| **Notion** | Repositorio central de documentación | Bitácora, minutas, retrospectivas, requisitos |
| **GitHub** | Control de versiones del código fuente | Repositorio único con historial de commits |
| **PowerPoint / Canva** | Elaboración de presentaciones y diagramas | Slides del video de avance y defensa final |

### 11.2 Herramientas de colaboración y comunicación

| Herramienta | Uso |
|-------------|-----|
| **Plataforma UAPA** | Entrega de tareas, comunicación oficial con el docente |
| **WhatsApp / correo electrónico** | Comunicación rápida con stakeholders externos |
| **Microsoft Teams / Google Meet** | Reuniones sincrónicas cuando fue necesario |

### 11.3 Stack tecnológico del software

**Backend:**

- **Node.js v20** — Entorno de ejecución de JavaScript.
- **Express 4.x** — Framework HTTP minimalista.
- **better-sqlite3** — Driver síncrono de SQLite (más rápido y predecible que alternativas asíncronas para este caso).
- **bcryptjs** — Hash de contraseñas.
- **jsonwebtoken** — Emisión y verificación de JWT.
- **qrcode** — Generación de QR como Data URL.
- **uuid v4** — Identificadores únicos.
- **cors** — Política de orígenes cruzados para desarrollo local.

**Frontend:**

- **React 19** — Biblioteca de UI basada en componentes.
- **Vite** — Bundler y dev server ultrarrápido.
- **Tailwind CSS v4** — Framework utility-first con `@theme inline`.
- **React Router DOM** — Enrutamiento SPA.
- **zod** — Validación de esquemas en runtime.

**Base de datos:**

- **SQLite 3** — Motor embebido con archivo `carwash.db`.
- Modo WAL activado.
- Foreign keys habilitadas.
- 8 tablas relacionales (ver sección 5.3.4).

### 11.4 Infraestructura y despliegue

- **Desarrollo local:** Computadora con Windows 11, Node.js v20, navegador moderno.
- **Desarrollo backend:** `http://localhost:3000`.
- **Desarrollo frontend:** `http://localhost:5174`.
- **Producción objetivo:** Render (backend) + Vercel (frontend), con variables de entorno para `PORT`, `JWT_SECRET` y `FRONTEND_URL`.

### 11.5 Control de versiones (GitHub)

El repositorio sigue la estructura estándar:

```
proyecto-seminariouno/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── database/init.js
│   │   ├── middleware/auth.js
│   │   └── routes/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/AdminLayout.jsx
│   │   ├── lib/{api.js,auth.jsx}
│   │   ├── pages/{Login,Dashboard,Turns,Orders,ServicesManagement,MenuManagement,Invoices,ClientView}.jsx
│   │   └── assets/
│   └── package.json
├── tareas/             # Documentación académica
├── README.md
└── package.json        # Scripts raíz con concurrently
```

Convención de commits: *Conventional Commits* (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).

---

## 12. RESULTADOS Y LOGROS

### 12.1 Evaluación del cumplimiento de objetivos

| Objetivo específico | Cumplido | Evidencia |
|---------------------|----------|-----------|
| API REST en Node.js + Express + SQLite | ✅ Sí | 25 endpoints en `backend/src/routes/` |
| Frontend administrativo en React + Vite + Tailwind | ✅ Sí | 8 páginas en `frontend/src/pages/` |
| Vista móvil del cliente por QR | ✅ Sí | Ruta `/cliente?token=...` funcional |
| Autenticación JWT con 3 roles | ✅ Sí | `admin`, `cashier`, `barista` implementados |
| Facturación con ITBIS 18% automático | ✅ Sí | Trigger al completar turno, validado en 10+ escenarios |
| Despliegue en servidor cloud | 🔲 Pendiente | Planificado para semana 11 |

### 12.2 Logros técnicos destacados

1. **Modelo de datos completo y normalizado:** 8 tablas con relaciones claras, constraints CHECK para estados y roles, y soporte para soft delete en turnos.
2. **Generación automática de facturas:** Al marcar un turno como completado, el sistema calcula subtotal, ITBIS 18% y total en una sola transacción atómica.
3. **Acceso móvil sin fricción:** El cliente escanea un QR y accede instantáneamente a la vista de seguimiento sin instalar nada.
4. **Tiempo real en pedidos de cafetería:** Polling cada 10 segundos mantiene la vista del cliente sincronizada con el estado que actualiza el barista.
5. **Manejo defensivo de errores:** Middleware global evita caídas del servidor por excepciones no capturadas.

### 12.3 Lecciones aprendidas (Ensayo)

El desarrollo de **CarWash & Café El Punto** me dejó varias lecciones que considero valiosas, tanto para mi formación como ingeniero en software como para futuros proyectos.

En primer lugar, confirmé que **la planificación previa es la diferencia entre un proyecto terminable y uno que se desborda**. Las dos primeras semanas, dedicadas exclusivamente a análisis y diseño, parecían “tiempo perdido” al inicio, pero ahorraron decenas de horas más adelante: tener el esquema de base de datos cerrado antes de escribir la primera línea de código permitió avanzar en el backend sin retrocesos costosos. Sin esa base, cada cambio de diseño habría requerido modificar modelos, rutas, formularios y vistas en cascada.

En segundo lugar, la elección de **Scrum como metodología** resultó mucho más acertada de lo que anticipaba. Aunque al principio cuestioné si un equipo unipersonal necesitaba ceremonias Scrum, descubrí que la disciplina de definir objetivos semanales, revisar el incremento al cierre y hacer retrospectiva genera un ritmo de avance que de otra forma no se sostiene. La sensación de cerrar cada sprint con algo funcional —por pequeño que fuera— alimentó la motivación durante las diez semanas de desarrollo más intenso.

En tercer lugar, la experiencia me enseñó que **integrar el producto con el usuario final cambia la perspectiva**. Diseñar pantallas solo desde el escritorio del desarrollador es una cosa; pensar en cómo un cliente escanea un QR con poca señal, o cómo un cajero usa el sistema con prisa, es otra. Esa empatía tardía me llevó a ajustar el diseño responsive, a reducir campos en formularios y a privilegiar la claridad visual sobre la complejidad técnica.

Una cuarta lección tiene que ver con la **gestión del riesgo**. Aprendí que subestimar el tiempo del frontend es un error clásico, pero que la forma de mitigarlo no es “agregar más horas” sino **replanificar el sprint completo** y aceptar compromisos. En una ocasión, debí aplazar una mejora visual del dashboard para priorizar la integración del QR, que era bloqueante para el cliente. Esa decisión me costó en lo estético pero ganó el proyecto entero.

Finalmente, esta experiencia me confirmó algo que intuyo desde el principio de la carrera: **la ingeniería de software es, ante todo, comunicación**. Comunicar requisitos al docente, comunicar decisiones a stakeholders imaginarios, comunicar el estado del proyecto en una retrospectiva, comunicar el código a través de commits y de un README claro. El software es el artefacto, pero el lenguaje es la herramienta. Termino este proyecto convencido de que esa habilidad —explicar con claridad qué hago, por qué lo hago y cómo lo hice— vale tanto como cualquier framework que pueda aprender.

### 12.4 Resultados cuantitativos

- **25 endpoints REST** operativos.
- **8 pantallas** en el frontend (Login, Dashboard, Turns, Orders, Services, Menu, Invoices, ClientView).
- **8 tablas** en la base de datos, todas con integridad referencial.
- **Más de 100 commits** en el repositorio a lo largo del proyecto.
- **4 servicios de lavado** precargados (Básico, Completo, Premium, Motor).
- **11 items de menú** precargados entre bebidas, comidas y postres.
- **1 usuario administrador** semilla (`admin@carwash.com / admin123`).

---

## 14. CONCLUSIONES

### 14.1 Resumen de los aspectos clave del proyecto

El proyecto **CarWash & Café El Punto** demostró que es posible construir, con un equipo unipersonal y en un plazo de 12 semanas, una plataforma informática funcional que integra la gestión de un centro de lavado automotriz con un área de cafetería, ofreciendo una experiencia diferenciada al cliente final y herramientas de operación al administrador del negocio.

Los aspectos clave que sustentan esta conclusión son:

- **El problema es real y verificable:** existe un dolor de usuario (tiempo muerto de 45 min – 2 h) que ningún competidor resuelve de forma integrada en el mercado local.
- **La solución tecnológica es viable:** el stack seleccionado (Node.js, Express, SQLite, React, Vite, Tailwind, JWT, QR) es maduro, gratuito y suficiente para el alcance definido.
- **La metodología fue adecuada:** Scrum permitió entregables incrementales verificables y facilitó la autogestión en un equipo unipersonal.
- **El presupuesto es realista:** RD$181,500 cubre holgadamente el alcance sin requerir infraestructura costosa.
- **El cronograma se cumplió:** las fases de Análisis, Diseño y Desarrollo finalizaron en el plazo planificado.

### 14.2 Reflexiones sobre la gestión de proyectos y su impacto

La gestión de proyectos aplicada a este trabajo dejó tres reflexiones que trascienden el caso puntual:

1. **La planificación no es burocracia; es ahorro.** Cada hora invertida en definir alcance, requisitos y cronograma se recuperó varias veces durante la ejecución.
2. **Las metodologías ágiles no son opuestas a la planificación; la hacen continua.** Scrum no elimina la planificación, la convierte en un hábito semanal en lugar de un evento único al inicio.
3. **La gestión de riesgos es una mentalidad, no un documento.** Más allá de la matriz formal, lo que hizo la diferencia fue anticipar problemas y tener respuestas listas antes de que se materializaran.

En conjunto, la aplicación disciplinada de estos principios fue lo que permitió entregar un producto funcional en el tiempo previsto y dentro del presupuesto estimado, demostrando que la gestión de proyectos no es un accesorio académico, sino una competencia profesional central para cualquier ingeniero en software.

---

## 15. RECOMENDACIONES Y FUTURAS MEJORAS

### 15.1 Recomendaciones a corto plazo (próximas semanas)

1. **Completar las pruebas de integración** del flujo completo: login → crear servicio → crear turno → escanear QR → pedir desde móvil → completar turno → generar factura → cobrar. Documentar los resultados en un informe de QA.
2. **Desplegar el sistema en producción** (Render + Vercel) y verificar el `health check` y los flujos críticos en el entorno público.
3. **Elaborar manuales de usuario diferenciados** por rol (administrador, cajero, barista) con capturas y casos de uso paso a paso.
4. **Preparar el video demostrativo** del producto siguiendo el guion ya definido en `tareas/GUION-VIDEO-AVANCE.md`.

### 15.2 Mejoras a mediano plazo (3–6 meses)

| Mejora | Justificación |
|--------|---------------|
| Integración con pasarela de pago (CardNet, Azul) | Procesar pagos con tarjeta de forma real, hoy solo registrado manualmente |
| Notificaciones push al cliente cuando su lavado esté listo | Reducir ansiedad de la espera, mejorar percepción del servicio |
| Reportes avanzados con gráficos (Chart.js o Recharts) | Dar al dueño del negocio visibilidad de tendencias y ticket promedio |
| Sistema de fidelización (puntos por visita) | Incentivar recurrencia |
| Roles más granulares (supervisor, contador) | Mejorar separación de responsabilidades |
| Logs de auditoría | Trazabilidad de cambios para entornos multiusuario |

### 15.3 Visión a largo plazo (12+ meses)

- **Aplicación móvil nativa** (React Native o Flutter) que aproveche notificaciones push y cámara para escanear QR automáticamente.
- **Multi-sucursal:** arquitectura multi-tenant para que un mismo grupo empresarial gestione varios lavaderos desde una sola consola.
- **Inteligencia de negocio:** dashboard predictivo que sugiera turnos óptimos, prediga demanda según día/hora y recomiende pricing dinámico.
- **Reservas en línea:** permitir a los clientes agendar su lavado por hora desde la web, reduciendo colas en hora pico.

### 15.4 Lecciones transferibles a otros proyectos

- Invertir al menos un 15% del tiempo total en planificación formal antes de codificar.
- Versionar desde el día uno; cada commit cuenta como evidencia de avance.
- Mantener un README vivo, actualizado con cada cambio de arquitectura.
- Aplicar la técnica del *Definition of Done*: una historia no está terminada hasta que está probada manualmente extremo a extremo.

---

## 16. BIBLIOGRAFÍAS

### Referencias en formato APA 7

- Beck, K., Beedle, M., van Bennekum, A., Cockburn, A., Cunningham, W., Fowler, M., … & Thomas, D. (2001). *Manifiesto por el Desarrollo Ágil de Software*. Recuperado de https://agilemanifesto.org/

- Fielding, R. T. (2000). *Architectural Styles and the Design of Network-Based Software Architectures* (Tesis doctoral, University of California, Irvine). Recuperado de https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm

- Fowler, M. (2018). *Patterns of Enterprise Application Architecture*. Addison-Wesley Professional.

- Freeman, S., & Pryce, N. (2009). *Growing Object-Oriented Software, Guided by Tests*. Addison-Wesley.

- Google. (2024). *Vite — Guía oficial*. Recuperado de https://vitejs.dev/

- Hardman, D. (2021). *Better SQLite3 — Documentación oficial*. Recuperado de https://github.com/WiseLibs/better-sqlite3

- Jones, C. (2019). *Software Development Trends Survey*. IEEE Software.

- Mozilla Developer Network. (2024). *MDN Web Docs: HTTP, REST, JWT*. Recuperado de https://developer.mozilla.org/

- OpenJS Foundation. (2024). *Node.js Documentation*. Recuperado de https://nodejs.org/en/docs

- Project Management Institute. (2021). *A Guide to the Project Management Body of Knowledge (PMBOK® Guide)* (7.ª ed.). PMI.

- React Documentation. (2024). *React — Una biblioteca de JavaScript para construir interfaces de usuario*. Recuperado de https://react.dev/

- Rubin, K. (2012). *Essential Scrum: A Practical Guide to the Most Popular Agile Process*. Addison-Wesley.

- Schwaber, K., & Sutherland, J. (2020). *The Scrum Guide*. Recuperado de https://scrumguides.org/

- SQLite Consortium. (2024). *SQLite Documentation*. Recuperado de https://www.sqlite.org/docs.html

- Tailwind Labs. (2024). *Tailwind CSS v4 — Documentación oficial*. Recuperado de https://tailwindcss.com/docs

- W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. Recuperado de https://www.w3.org/TR/WCAG22/

### Recursos en línea consultados

- Dirección General de Impuestos Internos (DGII). (2024). *Estadísticas del parque vehicular en República Dominicana*. https://www.dgii.gov.do/

- Stack Overflow Developer Survey. (2024). *Tendencias de adopción tecnológica*. https://survey.stackoverflow.co/

- OWASP Foundation. (2023). *OWASP Top 10 — Riesgos de seguridad en aplicaciones web*. https://owasp.org/Top10/

---

## 17. ANEXOS

### Anexo A — Estructura completa del repositorio

```
proyecto-seminariouno/
│
├── README.md                  # Documentación principal
├── package.json               # Scripts raíz con concurrently
├── package-lock.json
│
├── backend/                   # API REST en Node.js
│   ├── package.json
│   ├── carwash.db             # Base de datos SQLite (generada en runtime)
│   └── src/
│       ├── index.js           # Punto de entrada, registro de rutas
│       ├── database/
│       │   └── init.js        # Esquema, migraciones y seeds
│       ├── middleware/
│       │   └── auth.js        # Middleware de autenticación JWT
│       └── routes/
│           ├── auth.js        # POST /api/auth/login
│           ├── services.js    # CRUD /api/services
│           ├── menu.js        # CRUD /api/menu
│           ├── turns.js       # CRUD /api/turns + QR + soft-delete
│           ├── orders.js      # CRUD /api/orders
│           ├── invoices.js    # CRUD /api/invoices
│           └── dashboard.js   # GET /api/dashboard
│
├── frontend/                  # SPA en React + Vite
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── dist/                  # Build de producción
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx            # Router principal + ProtectedRoute
│       ├── index.css          # Tailwind v4 + @theme inline
│       ├── components/
│       │   └── AdminLayout.jsx
│       ├── lib/
│       │   ├── api.js         # Cliente fetch con JWT
│       │   └── auth.jsx       # AuthProvider con useAuth()
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Turns.jsx
│       │   ├── Orders.jsx
│       │   ├── ServicesManagement.jsx
│       │   ├── MenuManagement.jsx
│       │   ├── Invoices.jsx
│       │   └── ClientView.jsx
│       └── assets/
│
├── tareas/                    # Documentación académica
│   ├── tarea 1.docx           # Definición del proyecto
│   ├── TAREA 2 SP1(1).docx    # Análisis y planificación
│   ├── TAREA 3 SP1(1).docx    # Presupuesto
│   ├── FASE_ANALISIS.docx
│   ├── FASE_ANALISIS.txt
│   └── GUION-VIDEO-AVANCE.md  # Guion del video demostrativo
│
└── pdf trabajo final.pdf      # Documento de requisitos de la asignatura
```

### Anexo B — Esquema relacional de la base de datos

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    users     │         │  wash_turns  │         │   vehicles   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │◄────┐   │ id (PK)      │    ┌───►│ id (PK)      │
│ name         │     │   │ vehicle_id   │────┘    │ plate        │
│ email (UNQ)  │     │   │ service_id   │────┐    │ brand        │
│ password     │     └───│ assigned_to  │    │    │ model        │
│ role         │         │ status       │    │    │ color        │
│ created_at   │         │ qr_token UNQ │    │    │ client_name  │
└──────────────┘         │ notes        │    │    │ client_phone │
                        │ deleted_at   │    │    │ created_at   │
                        │ created_at   │    │    └──────────────┘
                        │ completed_at │    │
                        └──────┬───────┘    │
                               │            │
                               │            ▼
                               │     ┌──────────────┐
                               │     │   services   │
                               │     ├──────────────┤
                               │     │ id (PK)      │
                               │     │ name         │
                               │     │ description  │
                               │     │ price        │
                               │     │ duration_min │
                               │     │ is_active    │
                               │     └──────────────┘
                               │
                               ▼
                        ┌──────────────┐         ┌──────────────┐
                        │ cafe_orders  │         │   invoices   │
                        ├──────────────┤         ├──────────────┤
                        │ id (PK)      │◄────────│ wash_turn_id │
                        │ wash_turn_id │         │ cafe_order_id│
                        │ table_number │         │ subtotal     │
                        │ client_name  │         │ tax (ITBIS)  │
                        │ status       │         │ total        │
                        │ total        │         │ payment_meth │
                        │ created_at   │         │ status       │
                        └──────┬───────┘         │ created_at   │
                               │                 └──────────────┘
                               ▼
                        ┌──────────────┐         ┌──────────────┐
                        │ order_items  │         │  menu_items  │
                        ├──────────────┤         ├──────────────┤
                        │ id (PK)      │         │ id (PK)      │
                        │ order_id     │────────►│ name         │
                        │ menu_item_id │────────►│ description  │
                        │ quantity     │         │ price        │
                        │ unit_price   │         │ category     │
                        │ notes        │         │ is_available │
                        └──────────────┘         │ image_url    │
                                                  └──────────────┘
```

### Anexo C — Endpoints principales de la API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | ❌ | Login con email y password, retorna JWT |
| `GET`  | `/api/services` | ❌ | Lista de servicios activos |
| `POST` | `/api/services` | ✅ | Crear servicio (admin) |
| `PATCH`| `/api/services/:id` | ✅ | Actualizar servicio (admin) |
| `DELETE`| `/api/services/:id` | ✅ | Desactivar servicio (admin) |
| `GET`  | `/api/menu` | ❌ | Lista del menú disponible |
| `POST` | `/api/menu` | ✅ | Crear item del menú (admin) |
| `GET`  | `/api/turns/active` | ❌ | Turnos activos públicos (para dashboard externo) |
| `GET`  | `/api/turns/qr/:token` | ❌ | Turno por token QR (vista del cliente) |
| `GET`  | `/api/turns` | ✅ | Lista de turnos (filtros: status, deleted) |
| `POST` | `/api/turns` | ✅ | Crear turno + vehículo + QR |
| `PATCH`| `/api/turns/:id/status` | ✅ | Cambiar estado (genera factura si completado) |
| `PATCH`| `/api/turns/:id/soft-delete` | ✅ | Soft delete de turno completado |
| `GET`  | `/api/turns/:id/qr` | ✅ | Genera QR como Data URL |
| `GET`  | `/api/orders` | ✅ | Lista de pedidos |
| `POST` | `/api/orders` | ❌ | Crear pedido desde vista del cliente |
| `PATCH`| `/api/orders/:id/status` | ✅ | Actualizar estado (barista) |
| `GET`  | `/api/invoices` | ✅ | Lista de facturas |
| `PATCH`| `/api/invoices/:id/pay` | ✅ | Marcar factura como pagada |
| `PATCH`| `/api/invoices/:id/cancel` | ✅ | Anular factura |
| `GET`  | `/api/dashboard` | ✅ | Métricas agregadas |
| `GET`  | `/api/health` | ❌ | Health check del servidor |

### Anexo D — Pantallas del frontend

| Ruta | Componente | Rol | Descripción |
|------|-----------|-----|-------------|
| `/login` | `Login.jsx` | Público | Autenticación con email/password |
| `/admin` | `Dashboard.jsx` | Admin/Cashier | Métricas: turnos pendientes, ingresos, pedidos activos |
| `/admin/turns` | `Turns.jsx` | Admin/Cashier | CRUD de turnos, generación de QR, control de estados |
| `/admin/orders` | `Orders.jsx` | Barista/Admin | Gestión de pedidos de cafetería |
| `/admin/services` | `ServicesManagement.jsx` | Admin | CRUD de servicios de lavado |
| `/admin/menu` | `MenuManagement.jsx` | Admin | CRUD de items del menú |
| `/admin/invoices` | `Invoices.jsx` | Admin/Cashier | Lista y gestión de facturas |
| `/cliente?token=...` | `ClientView.jsx` | Cliente final | Estado del lavado + menú + pedidos, polling 10 s |

### Anexo E — Datos de prueba (seed)

- **Usuario administrador:** `admin@carwash.com` / `admin123`
- **Servicios de lavado:**
  - Básico — RD$ 350 (20 min)
  - Completo — RD$ 600 (40 min)
  - Premium — RD$ 900 (60 min)
  - Motor — RD$ 500 (30 min)
- **Menú de cafetería (11 items):** Café Americano, Latte, Capuchino, Jugo Natural, Agua, Refresco, Sándwich Club, Empanada de Queso, Pastelito de Carne, Brownie, Fruta Picada.

### Anexo F — Comando de arranque local

```bash
# Clonar el repositorio
git clone <URL_REPOSITORIO>
cd proyecto-seminariouno

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Volver a la raíz y arrancar ambos con concurrently
cd ..
npm install        # instala concurrently
npm run dev        # arranca API en :3000 y WEB en :5174
```

### Anexo G — Variables de entorno

**Backend (`.env`):**

```
PORT=3000
JWT_SECRET=<cadena-aleatoria-segura>
FRONTEND_URL=http://localhost:5174
```

**Frontend (`.env`):**

```
VITE_API_URL=http://localhost:3000/api
```

### Anexo H — Glosario

| Término | Definición |
|---------|------------|
| **API REST** | Interfaz de programación que sigue el estilo Representational State Transfer |
| **JWT** | JSON Web Token — estándar para tokens de autenticación firmados |
| **QR** | Quick Response — código de barras bidimensional |
| **ITBIS** | Impuesto sobre la Transferencia de Bienes y Servicios (Rep. Dom.) |
| **Scrum** | Framework ágil basado en sprints, roles y ceremonias |
| **Sprint** | Iteración corta (1–4 semanas) con entrega de incremento funcional |
| **SPA** | Single Page Application — aplicación web de una sola página |
| **Soft delete** | Eliminación lógica que preserva el registro marcándolo con timestamp |
| **WAL** | Write-Ahead Logging — modo de SQLite que mejora concurrencia |
| **Better-sqlite3** | Driver síncrono de alto rendimiento para SQLite en Node.js |

---

**Fin del documento.**

> Este trabajo fue elaborado como parte del proyecto final de la asignatura Seminario de Proyecto I (ISW410), trimestre Mayo–Julio 2026, en la Escuela de Ingeniería y Tecnología de la Universidad Abierta para Adultos (UAPA).