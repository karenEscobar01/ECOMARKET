const STORAGE_KEY = 'ecomarket_productos';
let productosApp = [];
let graficoCategoriasInstance = null;

const CATEGORIAS_VALIDAS = ["Despensa", "Frutas y verduras", "Cuidado personal", "Hogar sostenible"];
const CIUDADES_VALIDAS = ["Bucaramanga", "Bogotá", "Medellín", "Cali", "Cartagena", "Ibagué", "Pereira"];

document.addEventListener('DOMContentLoaded', async () => {
  await cargarProductos();
  inicializarEventos();
  renderizarTodo();
});

async function cargarProductos() {
  const datosGuardados = localStorage.getItem(STORAGE_KEY);
  if (datosGuardados) {
    try {
      productosApp = JSON.parse(datosGuardados);
    } catch (e) {
      productosApp = [];
    }
  } else {
    try {
      const response = await fetch('productos.json');
      if (!response.ok) throw new Error('No se pudo cargar productos.json');
      productosApp = await response.json();
      guardarEnLocalStorage();
    } catch (error) {
      productosApp = [];
    }
  }
}

function guardarEnLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productosApp));
}

function renderizarTodo() {
  const productosFiltrados = obtenerProductosFiltrados();
  renderizarTarjetas(productosFiltrados);
  actualizarKPIs(productosApp);
  actualizarGrafico(productosApp);
}

function renderizarTarjetas(lista) {
  const contenedor = document.getElementById('grid-productos');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (lista.length === 0) {
    contenedor.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748B;"><p>🔍 No se encontraron productos.</p></div>`;
    return;
  }

  lista.forEach(producto => {
    let estadoClass = 'status-available';
    let estadoTexto = 'Disponible';

    if (producto.stock === 0) {
      estadoClass = 'status-out';
      estadoTexto = 'Agotado';
    } else if (producto.stock <= producto.stockMinimo) {
      estadoClass = 'status-low';
      estadoTexto = 'Stock bajo';
    }

    const card = document.createElement('article');
    card.style.cssText = "background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;";
    card.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span style="background:${producto.organico ? '#E8F0E6' : '#F1F5F9'}; color:${producto.organico ? '#1E3F20' : '#475569'}; padding:0.2rem 0.6rem; border-radius:50px; font-size:0.75rem; font-weight:600;">
            ${producto.organico ? '🌿 Orgánico' : 'Convencional'}
          </span>
          <span class="${estadoClass}" style="font-size:0.75rem; padding:0.2rem 0.6rem; border-radius:50px; font-weight:600; ${
            estadoTexto === 'Disponible' ? 'background:#DCFCE7; color:#15803D;' : 
            estadoTexto === 'Stock bajo' ? 'background:#FEF3C7; color:#B45309;' : 'background:#FEE2E2; color:#B91C1C;'
          }">${estadoTexto}</span>
        </div>
        <span style="font-size:0.75rem; color:#64748B; text-transform:uppercase;">${producto.categoria}</span>
        <h3 style="font-size:1.1rem; margin:0.25rem 0 0.5rem 0; color:#1E3F20;">${producto.nombre}</h3>
        <p style="font-size:0.85rem; color:#64748B; margin-bottom:0.75rem;">📍 ${producto.productor} (${producto.ciudad})</p>
        <p style="font-size:1.2rem; font-weight:800; color:#1E3F20; margin-bottom:1rem;">$ ${producto.precio.toLocaleString('es-CO')} COP</p>
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#64748B; border-top:1px solid #E2E8F0; padding-top:0.75rem; margin-bottom:1rem;">
          <span>Stock: <strong>${producto.stock}</strong></span>
          <span>Mín: ${producto.stockMinimo}</span>
        </div>
      </div>
      <div style="display:flex; gap:0.5rem;">
        <button onclick="abrirModalEditar(${producto.id})" style="flex:1; padding:0.4rem; background:#E8F0E6; color:#1E3F20; border:none; border-radius:6px; font-weight:600; cursor:pointer;">✏️ Editar</button>
        <button onclick="eliminarProducto(${producto.id})" style="flex:1; padding:0.4rem; background:#FEE2E2; color:#991B1B; border:none; border-radius:6px; font-weight:600; cursor:pointer;">🗑️ Eliminar</button>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function actualizarKPIs(lista) {
  const totalActivosEl = document.getElementById('kpi-total-activos');
  const inventarioBajoEl = document.getElementById('kpi-inventario-bajo');
  const valorInventarioEl = document.getElementById('kpi-valor-inventario');

  const totalActivos = lista.filter(p => p.activo).length;
  const inventarioBajo = lista.filter(p => p.stock <= p.stockMinimo).length;
  const valorTotal = lista.reduce((sum, p) => sum + (p.precio * p.stock), 0);

  if (totalActivosEl) totalActivosEl.textContent = totalActivos;
  if (inventarioBajoEl) inventarioBajoEl.textContent = inventarioBajo;
  if (valorInventarioEl) valorInventarioEl.textContent = `$ ${valorTotal.toLocaleString('es-CO')} COP`;
}

function obtenerProductosFiltrados() {
  const searchInput = document.getElementById('input-busqueda');
  const selectCategoria = document.getElementById('select-categoria');
  const selectCiudad = document.getElementById('select-ciudad');
  const selectEstado = document.getElementById('select-estado');

  const textoBusqueda = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const categoriaSelected = selectCategoria ? selectCategoria.value : '';
  const ciudadSelected = selectCiudad ? selectCiudad.value : '';
  const estadoSelected = selectEstado ? selectEstado.value : '';

  return productosApp.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(textoBusqueda) || p.productor.toLowerCase().includes(textoBusqueda);
    const coincideCategoria = !categoriaSelected || p.categoria === categoriaSelected;
    const coincideCiudad = !ciudadSelected || p.ciudad === ciudadSelected;

    let coincideEstado = true;
    if (estadoSelected === 'Disponible') coincideEstado = p.stock > p.stockMinimo;
    else if (estadoSelected === 'Stock bajo') coincideEstado = p.stock > 0 && p.stock <= p.stockMinimo;
    else if (estadoSelected === 'Agotado') coincideEstado = p.stock === 0;

    return coincideTexto && coincideCategoria && coincideCiudad && coincideEstado;
  });
}

function inicializarEventos() {
  const searchInput = document.getElementById('input-busqueda');
  const selectCategoria = document.getElementById('select-categoria');
  const selectCiudad = document.getElementById('select-ciudad');
  const selectEstado = document.getElementById('select-estado');
  const btnNuevo = document.getElementById('btn-nuevo-producto');
  const formModal = document.getElementById('form-producto');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');

  if (searchInput) searchInput.addEventListener('input', renderizarTodo);
  if (selectCategoria) selectCategoria.addEventListener('change', renderizarTodo);
  if (selectCiudad) selectCiudad.addEventListener('change', renderizarTodo);
  if (selectEstado) selectEstado.addEventListener('change', renderizarTodo);

  if (btnNuevo) btnNuevo.addEventListener('click', abrirModalCrear);
  if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
  if (formModal) formModal.addEventListener('submit', guardarProductoSubmit);
}

function abrirModalCrear() {
  const modal = document.getElementById('modal-producto');
  const form = document.getElementById('form-producto');
  if (!modal || !form) return;
  form.reset();
  document.getElementById('producto-id').value = '';
  document.getElementById('modal-title').textContent = '➕ Registrar Nuevo Producto';
  limpiarErroresModal();
  modal.style.display = 'flex';
}

function abrirModalEditar(id) {
  const producto = productosApp.find(p => p.id === id);
  if (!producto) return;
  const modal = document.getElementById('modal-producto');

  document.getElementById('producto-id').value = producto.id;
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('categoria').value = producto.categoria;
  document.getElementById('precio').value = producto.precio;
  document.getElementById('stock').value = producto.stock;
  document.getElementById('stockMinimo').value = producto.stockMinimo;
  document.getElementById('productor').value = producto.productor;
  document.getElementById('ciudad').value = producto.ciudad;
  document.getElementById('organico').checked = producto.organico;
  document.getElementById('activo').checked = producto.activo;

  document.getElementById('modal-title').textContent = '✏️ Editar Producto';
  limpiarErroresModal();
  modal.style.display = 'flex';
}

function cerrarModal() {
  const modal = document.getElementById('modal-producto');
  if (modal) modal.style.display = 'none';
}

function guardarProductoSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('producto-id').value;
  
  const nuevoProducto = {
    id: id ? parseInt(id, 10) : (productosApp.length > 0 ? Math.max(...productosApp.map(p => p.id)) + 1 : 1),
    nombre: document.getElementById('nombre').value.trim(),
    categoria: document.getElementById('categoria').value,
    precio: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value, 10),
    stockMinimo: parseInt(document.getElementById('stockMinimo').value, 10),
    productor: document.getElementById('productor').value.trim(),
    ciudad: document.getElementById('ciudad').value,
    organico: document.getElementById('organico').checked,
    fechaRegistro: id ? (productosApp.find(p => p.id === parseInt(id, 10))?.fechaRegistro || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
    activo: document.getElementById('activo').checked
  };

  if (!validarFormulario(nuevoProducto)) return;

  if (id) {
    const idx = productosApp.findIndex(p => p.id === parseInt(id, 10));
    if (idx !== -1) productosApp[idx] = nuevoProducto;
  } else {
    productosApp.push(nuevoProducto);
  }

  guardarEnLocalStorage();
  renderizarTodo();
  cerrarModal();
}

function eliminarProducto(id) {
  const producto = productosApp.find(p => p.id === id);
  if (!producto) return;
  if (confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
    productosApp = productosApp.filter(p => p.id !== id);
    guardarEnLocalStorage();
    renderizarTodo();
  }
}

function validarFormulario(p) {
  let esValido = true;
  limpiarErroresModal();

  if (!p.nombre) { mostrarErrorCampo('error-nombre', 'Obligatorio.'); esValido = false; }
  if (isNaN(p.precio) || p.precio <= 0) { mostrarErrorCampo('error-precio', 'Debe ser mayor a 0.'); esValido = false; }
  if (isNaN(p.stock) || p.stock < 0) { mostrarErrorCampo('error-stock', 'No puede ser negativo.'); esValido = false; }
  if (isNaN(p.stockMinimo) || p.stockMinimo < 0) { mostrarErrorCampo('error-stockMinimo', 'No puede ser negativo.'); esValido = false; }
  if (!p.productor) { mostrarErrorCampo('error-productor', 'Obligatorio.'); esValido = false; }

  return esValido;
}

function mostrarErrorCampo(idSpan, msg) {
  const span = document.getElementById(idSpan);
  if (span) span.textContent = msg;
}

function limpiarErroresModal() {
  document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');
}

function actualizarGrafico(lista) {
  const canvas = document.getElementById('chart-categorias');
  if (!canvas || typeof Chart === 'undefined') return;

  const conteo = CATEGORIAS_VALIDAS.reduce((acc, cat) => {
    acc[cat] = lista.filter(p => p.categoria === cat).length;
    return acc;
  }, {});

  const labels = Object.keys(conteo);
  const data = Object.values(conteo);

  if (graficoCategoriasInstance) {
    graficoCategoriasInstance.data.labels = labels;
    graficoCategoriasInstance.data.datasets[0].data = data;
    graficoCategoriasInstance.update();
  } else {
    graficoCategoriasInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Productos',
          data: data,
          backgroundColor: ['#2E8B57', '#1E3F20', '#D96B43', '#A3B8A5'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}