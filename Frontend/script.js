function defaultSubmit(e) {
  e.preventDefault();
  const datos = getDatosFormulario();

  fetch("http://localhost:8080/api/encargos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then(res => res.ok ? res.json() : Promise.reject("Error del servidor"))
    .then(() => {
      document.getElementById("respuesta").textContent = "Encargo guardado correctamente.";
      agregarFilaTabla(datos);
      document.getElementById("encargo-form").reset();
    })
    .catch(err => {
      document.getElementById("respuesta").textContent = "Error al guardar el encargo.";
      console.error(err);
    });
}

document.getElementById("encargo-form").onsubmit = defaultSubmit;

function getDatosFormulario() {
  return {
    diaMes: document.getElementById("diaMes").value,
    tienda: document.getElementById("tienda").value,
    empleado: document.getElementById("empleado").value,
    cliente: document.getElementById("cliente").value,
    telefono: document.getElementById("telefono").value,
    nombre: document.getElementById("nombre").value,
    direccion: document.getElementById("direccion").value,
    estado: document.getElementById("estado").value,
    encargo: document.getElementById("encargo").value,
    observaciones: document.getElementById("observaciones").value,
  };
}

function agregarFilaTabla(datos) {
  const tabla = document.querySelector("#tablaPedidos tbody");
  const fila = tabla.insertRow();

  fila.innerHTML = `
    <td>${formatearFecha(datos.diaMes)}</td>
    <td>${datos.tienda}</td>
    <td>${datos.empleado}</td>
    <td>${datos.cliente}</td>
    <td>${datos.telefono}</td>
    <td>${datos.nombre}</td>
    <td>${datos.direccion}</td>
    <td>${datos.estado}</td>
    <td>${datos.encargo}</td>
    <td>${datos.observaciones}</td>
    <td><button class="btn-editar">Editar</button></td>
  `;

  fila.querySelector(".btn-editar").addEventListener("click", () => {
    mostrarFormulario();
    cargarFormularioParaEditar(fila, datos);
  });
}

function cargarFormularioParaEditar(fila, datos) {
  // Remover resaltado previo
  document.querySelectorAll("#tablaPedidos tbody tr").forEach(row => row.classList.remove("resaltado"));
  fila.classList.add("resaltado");

  Object.entries(datos).forEach(([key, value]) => {
    document.getElementById(key).value = value;
  });

  const boton = document.querySelector("#encargo-form button");
  boton.textContent = "Actualizar pedido";

  document.getElementById("encargo-form").onsubmit = function (e) {
    e.preventDefault();
    const nuevosDatos = getDatosFormulario();

    fila.innerHTML = `
      <td>${formatearFecha(nuevosDatos.diaMes)}</td>
      <td>${nuevosDatos.tienda}</td>
      <td>${nuevosDatos.empleado}</td>
      <td>${nuevosDatos.cliente}</td>
      <td>${nuevosDatos.telefono}</td>
      <td>${nuevosDatos.nombre}</td>
      <td>${nuevosDatos.direccion}</td>
      <td>${nuevosDatos.estado}</td>
      <td>${nuevosDatos.encargo}</td>
      <td>${nuevosDatos.observaciones}</td>
      <td><button class="btn-editar">Editar</button></td>
    `;

    fila.classList.remove("resaltado");

    fila.querySelector(".btn-editar").addEventListener("click", () => {
      mostrarFormulario();
      cargarFormularioParaEditar(fila, nuevosDatos);
    });

    document.getElementById("encargo-form").reset();
    boton.textContent = "Guardar encargo";
    document.getElementById("respuesta").textContent = "Pedido actualizado correctamente.";
    document.getElementById("encargo-form").onsubmit = defaultSubmit;
  };
}

function formatearFecha(fechaISO) {
  const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', opciones);
}

function mostrarFormulario() {
  const panelFormulario = document.getElementById("panel-formulario");
  const abrirBtn = document.getElementById("toggle-form");
  const cerrarBtn = document.getElementById("cerrar-formulario");

  panelFormulario.classList.add("activa");
  document.body.classList.add("formulario-activo");
  abrirBtn.classList.add("oculto");
  cerrarBtn.classList.remove("oculto");
}

const pedidosEjemplo = [
  {
    diaMes: "2025-05-29",
    tienda: "Martínez del Campo",
    empleado: "Marta",
    cliente: "Lucía González",
    telefono: "612345678",
    nombre: "Lucía",
    direccion: "Calle Rosa 12",
    estado: "Pendiente",
    encargo: "Ramo de rosas rojas",
    observaciones: "Entregar antes de las 14:00"
  },
  {
    diaMes: "2025-06-01",
    tienda: "Calle Vitoria",
    empleado: "Carlos",
    cliente: "Pedro López",
    telefono: "698765432",
    nombre: "Pedro",
    direccion: "Avenida Madrid 45",
    estado: "Entregado",
    encargo: "Centro floral para cumpleaños",
    observaciones: "Incluye tarjeta personalizada"
  },
  {
    diaMes: "2025-06-02",
    tienda: "Hospital Universitario",
    empleado: "Ana",
    cliente: "Laura Martín",
    telefono: "677889900",
    nombre: "Laura",
    direccion: "Calle Sol 3",
    estado: "En preparación",
    encargo: "Decoración boda",
    observaciones: "Confirmar colores con la novia"
  }
];

window.addEventListener("DOMContentLoaded", () => {
  pedidosEjemplo.forEach(agregarFilaTabla);
});

// Animación de panel lateral y alternancia de botones
const panelFormulario = document.getElementById("panel-formulario");
const abrirBtn = document.getElementById("toggle-form");
const cerrarBtn = document.getElementById("cerrar-formulario");

abrirBtn.addEventListener("click", mostrarFormulario);

cerrarBtn.addEventListener("click", () => {
  panelFormulario.classList.remove("activa");
  document.body.classList.remove("formulario-activo");
  cerrarBtn.classList.add("oculto");
  abrirBtn.classList.remove("oculto");
});