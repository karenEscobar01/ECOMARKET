# 🌿 EcoMarket — Plataforma Web para Comercio Sostenible con IA

**Taller Práctico 2: Desarrollo Web con IA**  
**Startup:** EcoMarket (Colombia)  
**Desarrolladora:** Karen Yaritza Escobar Pinto

## 📌 Descripción del Proyecto

EcoMarket es una plataforma web desarrollada para conectar a pequeños productores locales de alimentos orgánicos y artículos sostenibles con consumidores que buscan realizar compras responsables. El proyecto consta de una **Landing Page** comercial y un **Panel Administrativo (Dashboard)** con gestión de inventario en tiempo real, operaciones CRUD, filtros combinados, persistencia de datos mediante `localStorage` y visualización estadística con Chart.js.

## 🛠️ Tecnologías y Estándares Utilizados

- **HTML5 Semántico:** Estructura limpia con etiquetas accesibles (`header`, `nav`, `main`, `section`, `footer`, `aside`) y atributo `lang="es"`.
- **CSS3 Avanzado:** Diseño responsivo *Mobile-First*, variables en `:root`, Flexbox, CSS Grid y diseño de componentes modulares.
- **JavaScript Vanilla (ES6+):** Manipulación del DOM, asincronía (`async/await` con `fetch`), validaciones programáticas y manejo de estado.
- **Librerías Externas:** Chart.js para el gráfico estadístico dinámico de categorías.
- **Persistencia:** Almacenamiento local del navegador (`localStorage`).

## 📂 Estructura de Archivos del Repositorio

```text
/
├── index.html        # Landing page de presentación comercial
├── dashboard.html    # Panel administrativo de inventario y KPIs
├── styles.css        # Estilos generales y diseño visual de la landing
├── dashboard.css     # Estilos específicos del panel de administración
├── productos.json    # Dataset inicial con 35 registros (5 manuales + 30 generados con IA)
├── app.js            # Lógica principal, motor CRUD, filtros y Chart.js
├── dashboard.js      # Control de interactividad y menú hamburguesa responsive
└── validacion.js     # Script de validación programática de reglas de negocio
```

## 🤖 Prompt Engineering y Metodología de Desarrollo con IA

Durante el desarrollo del prototipo se aplicaron diferentes técnicas de ingeniería de prompts para guiar al asistente de inteligencia artificial de manera estructurada:

### Priming (Preparación de Contexto)

- **Propósito:** Definir el rol experto de la IA antes de generar código.
- **Prompt base:** "Actúa como un desarrollador frontend senior especializado en comercio electrónico y UX/UI. Vas a participar en el desarrollo de EcoMarket..."

### Chain of Thought (Razonamiento en Cadena)

- **Propósito:** Solicitar un análisis previo de diseño (jerarquía visual, paleta de colores verde natural, accesibilidad WCAG) antes de escribir código HTML/CSS.

### Few-Shot Prompting (Generación de Datos)

- **Propósito:** Proveer 5 registros manuales como ejemplo estricto para que la IA generara los 30 objetos restantes asegurando la coherencia exacta con el esquema JSON (`id`, `nombre`, `categoria`, `precio`, `stock`, `stockMinimo`, `productor`, `ciudad`, `organico`, `fechaRegistro`, `activo`).

## 📋 Informe de Hallazgos y Validación Programática (Fase 4)

Se implementó el script de auditoría `validacion.js` para revisar la integridad de los datos antes de cargarlos en la interfaz. A continuación se presenta el reporte de validación sobre pruebas de control:

| ID / Registro | Campo afectado | Descripción del problema / causa | Corrección aplicada |
|---|---|---|---|
| -5 | `id` | El ID debe ser un número entero estrictamente mayor a 0. | Se corrigió por un ID positivo único consecutivo. |
| -5 | `categoria` | La categoría 'Dulces' no pertenece a las permitidas. | Se reasignó a una categoría válida ("Despensa"). |
| -5 | `precio` | El precio recibido (-1000) no es un número positivo. | Se ajustó a un valor numérico entero en COP ($ > 0$). |
| -5 | `productor` | El campo productor se encontraba vacío. | Se especificó el nombre comercial del productor local. |
| -5 | `ciudad` | La ciudad 'Madrid' no está dentro del mercado objetivo. | Se actualizó a una ciudad permitida ("Bucaramanga"). |
| -5 | `organico` | El campo orgánico recibió un string ("si") en lugar de booleano. | Se corrigió al tipo de dato estricto true / false. |
| -5 | `fechaRegistro` | Formato de fecha inválido ("15/01/2026"). | Se estandarizó al formato ISO YYYY-MM-DD. |

## 🚀 Instrucciones de Ejecución Local

Dado que la aplicación consume el archivo de datos mediante `fetch()`, se requiere un servidor local:

1. Clona este repositorio o descarga los archivos en tu equipo.
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Instala y abre la extensión Live Server.
4. Haz clic derecho sobre `index.html` y selecciona "Open with Live Server" (o haz clic en el botón Go Live en la barra inferior de VS Code).
5. Para acceder al panel de administración, navega directamente a `dashboard.html` o utiliza el enlace directo en la barra de navegación superior.
