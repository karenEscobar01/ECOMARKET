/**
 * Módulo de Validación de Datos para EcoMarket
 * Archivo: validacion.js
 */

// Listas de valores permitidos según las reglas de negocio
const CATEGORIAS_PERMITIDAS = [
  "Despensa",
  "Frutas y verduras",
  "Cuidado personal",
  "Hogar sostenible"
];

const CIUDADES_PERMITIDAS = [
  "Bucaramanga",
  "Bogotá",
  "Medellín",
  "Cali",
  "Cartagena",
  "Ibagué",
  "Pereira"
];

/**
 * Valida un arreglo de productos aplicando las reglas de negocio de EcoMarket.
 * 
 * @param {Array<Object>} lista - Arreglo de objetos de producto a validar.
 * @returns {Array<Object>} Lista de errores detectados ({ id, campo, descripcion }).
 */
function validarProductos(lista) {
  const errores = [];
  const idsVistos = new Set();

  if (!Array.isArray(lista)) {
    return [{ id: "N/A", campo: "lista", descripcion: "El parámetro proporcionado no es un arreglo válido." }];
  }

  lista.forEach((producto, index) => {
    const idObj = producto.id !== undefined && producto.id !== null ? producto.id : `Índice ${index}`;

    // 1. Validar ID (Único, entero y > 0)
    if (typeof producto.id !== "number" || !Number.isInteger(producto.id) || producto.id <= 0) {
      errores.push({
        id: idObj,
        campo: "id",
        descripcion: `El ID debe ser un número entero estrictamente mayor a 0. Valor recibido: ${producto.id}`
      });
    } else if (idsVistos.has(producto.id)) {
      errores.push({
        id: producto.id,
        campo: "id",
        descripcion: `El ID ${producto.id} está duplicado en la lista.`
      });
    } else {
      idsVistos.add(producto.id);
    }

    // 2. Validar Nombre (Texto no vacío)
    if (typeof producto.nombre !== "string" || producto.nombre.trim() === "") {
      errores.push({
        id: idObj,
        campo: "nombre",
        descripcion: "El nombre del producto es obligatorio y debe ser texto."
      });
    }

    // 3. Validar Categorías permitidas
    if (!CATEGORIAS_PERMITIDAS.includes(producto.categoria)) {
      errores.push({
        id: idObj,
        campo: "categoria",
        descripcion: `La categoría '${producto.categoria}' no es válida. Permitidas: ${CATEGORIAS_PERMITIDAS.join(", ")}`
      });
    }

    // 4. Validar Precio (Número positivo > 0)
    if (typeof producto.precio !== "number" || isNaN(producto.precio) || producto.precio <= 0) {
      errores.push({
        id: idObj,
        campo: "precio",
        descripcion: `El precio debe ser un número positivo mayor a 0. Valor recibido: ${producto.precio}`
      });
    }

    // 5. Validar Stock (Entero >= 0)
    if (typeof producto.stock !== "number" || !Number.isInteger(producto.stock) || producto.stock < 0) {
      errores.push({
        id: idObj,
        campo: "stock",
        descripcion: `El stock debe ser un número entero mayor o igual a 0. Valor recibido: ${producto.stock}`
      });
    }

    // 6. Validar Stock Mínimo (Entero >= 0)
    if (typeof producto.stockMinimo !== "number" || !Number.isInteger(producto.stockMinimo) || producto.stockMinimo < 0) {
      errores.push({
        id: idObj,
        campo: "stockMinimo",
        descripcion: `El stock mínimo debe ser un entero mayor o igual a 0. Valor recibido: ${producto.stockMinimo}`
      });
    }

    // 7. Validar Productor (Texto no vacío)
    if (typeof producto.productor !== "string" || producto.productor.trim() === "") {
      errores.push({
        id: idObj,
        campo: "productor",
        descripcion: "El nombre del productor es obligatorio."
      });
    }

    // 8. Validar Ciudad (Dentro de la lista permitida)
    if (!CIUDADES_PERMITIDAS.includes(producto.ciudad)) {
      errores.push({
        id: idObj,
        campo: "ciudad",
        descripcion: `La ciudad '${producto.ciudad}' no es válida. Permitidas: ${CIUDADES_PERMITIDAS.join(", ")}`
      });
    }

    // 9. Validar Orgánico (Booleano)
    if (typeof producto.organico !== "boolean") {
      errores.push({
        id: idObj,
        campo: "organico",
        descripcion: `El campo orgánico debe ser booleano (true/false). Valor recibido: ${producto.organico}`
      });
    }

    // 10. Validar Fecha de Registro (YYYY-MM-DD)
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof producto.fechaRegistro !== "string" || !regexFecha.test(producto.fechaRegistro) || isNaN(Date.parse(producto.fechaRegistro))) {
      errores.push({
        id: idObj,
        campo: "fechaRegistro",
        descripcion: `La fecha '${producto.fechaRegistro}' no tiene un formato válido (YYYY-MM-DD).`
      });
    }

    // 11. Validar Activo (Booleano)
    if (typeof producto.activo !== "boolean") {
      errores.push({
        id: idObj,
        campo: "activo",
        descripcion: `El campo activo debe ser booleano (true/false). Valor recibido: ${producto.activo}`
      });
    }
  });

  return errores;
}

// Exportación modular para Node.js / Navegador
if (typeof module !== "undefined" && module.exports) {
  module.exports = { validarProductos, CATEGORIAS_PERMITIDAS, CIUDADES_PERMITIDAS };
}