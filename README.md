# 🌿 EcoMarket — Plataforma Web para Comercio Sostenible con IA

**Taller Práctico 2: Desarrollo Web con IA**  
**Startup:** EcoMarket (Colombia)  
**Desarrolladora:** Karen Yaritza Escobar Pinto  

---

## 📌 Descripción del Proyecto
EcoMarket es una plataforma web desarrollada para conectar a pequeños productores locales de alimentos orgánicos y artículos sostenibles con consumidores que buscan realizar compras responsables. El proyecto consta de una **Landing Page** comercial y un **Panel Administrativo (Dashboard)** con gestión de inventario en tiempo real, operaciones CRUD, filtros combinados, persistencia de datos mediante `localStorage` y visualización estadística con Chart.js.

---

## 🛠️ Tecnologías y Estándares Utilizados
* **HTML5 Semántico:** Estructura limpia con etiquetas accesibles (`header`, `nav`, `main`, `section`, `footer`, `aside`) y atributo `lang="es"`.
* **CSS3 Avanzado:** Diseño responsivo *Mobile-First*, variables en `:root`, Flexbox, CSS Grid y diseño de componentes modulares.
* **JavaScript Vanilla (ES6+):** Manipulación del DOM, asincronía (`async/await` con `fetch`), validaciones programáticas y manejo de estado.
* **Librerías Externas:** Chart.js para el gráfico estadístico dinámico de categorías.
* **Persistencia:** Almacenamiento local del navegador (`localStorage`).

---

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