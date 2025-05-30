// Modo normal: envío de nuevo pedido
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

// Asignar comportamiento inicial
document.getElementById("encargo-form").onsubmit = defaultSubmit;

// Obtener datos del formulario
function getDatosFormulario() {
  return {
    diaMes: document.getElementById("diaMes").value,
    tienda: document.getElementById("tienda").value,
    empleado: document.getElementById("empleado").value,
    cliente: document.getElementById("cliente").value,
    estado: document.getElementById("estado").value,
    telefono: document.getElementById("telefono").value,
    nombre: document.getElementById("nombre").value,
    direccion: document.getElementById("direccion").value,
    encargo: document.getElementById("encargo").value,
    observaciones: document.getElementById("observaciones").value,
  };
}

// Insertar fila y botón Editar
function agregarFilaTabla(datos) {
  const tabla = document.querySelector("#tablaPedidos tbody");
  const fila = tabla.insertRow();

  fila.innerHTML = `
    <td>${formatearFecha(datos.diaMes)}</td>
    <td>${datos.tienda}</td>
    <td>${datos.empleado}</td>
    <td>${datos.cliente}</td>
    <td>${datos.estado}</td>
    <td>${datos.telefono}</td>
    <td>${datos.nombre}</td>
    <td>${datos.direccion}</td>
    <td>${datos.encargo}</td>
    <td>${datos.observaciones}</td>
    <td><button class="btn-editar">Editar</button></td>
  `;

  fila.querySelector(".btn-editar").addEventListener("click", () => {
    cargarFormularioParaEditar(fila, datos);
  });
}

// Cargar pedido en formulario para editar
function cargarFormularioParaEditar(fila, datos) {
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
      <td>${nuevosDatos.estado}</td>
      <td>${nuevosDatos.telefono}</td>
      <td>${nuevosDatos.nombre}</td>
      <td>${nuevosDatos.direccion}</td>
      <td>${nuevosDatos.encargo}</td>
      <td>${nuevosDatos.observaciones}</td>
      <td><button class="btn-editar">Editar</button></td>
    `;

    fila.querySelector(".btn-editar").addEventListener("click", () => {
      cargarFormularioParaEditar(fila, nuevosDatos);
    });

    document.getElementById("encargo-form").reset();
    boton.textContent = "Guardar encargo";
    document.getElementById("respuesta").textContent = "Pedido actualizado correctamente.";
    document.getElementById("encargo-form").onsubmit = defaultSubmit;
  };
}

// Mostrar la fecha en formato largo en español
function formatearFecha(fechaISO) {
  const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', opciones);
}

// Pedido de ejemplo
const pedidoEjemplo = {
  diaMes: "2025-05-29",
  tienda: "Floristería Central",
  empleado: "Marta",
  cliente: "Lucía González",
  estado: "Pendiente",
  telefono: "612345678",
  nombre: "Lucía",
  direccion: "Calle Rosa 12",
  encargo: "Ramo de rosas rojas",
  observaciones: "Entregar antes de las 14:00"
};

// Cargar ejemplo al iniciar
window.addEventListener("DOMContentLoaded", () => {
  agregarFilaTabla(pedidoEjemplo);
});
