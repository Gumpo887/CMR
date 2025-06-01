function defaultSubmit(e) {
  e.preventDefault();
  const datos = getDatosFormulario();

  agregarFilaTabla(datos);
  guardarEnLocalStorage(datos);
  document.getElementById("respuesta").textContent = "Encargo guardado correctamente.";
  document.getElementById("encargo-form").reset();
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

    fila.querySelector(".btn-editar").addEventListener("click", () => {
      mostrarFormulario();
      cargarFormularioParaEditar(fila, nuevosDatos);
    });

    document.getElementById("encargo-form").reset();
    boton.textContent = "Guardar encargo";
    document.getElementById("respuesta").textContent = "Pedido actualizado correctamente.";
    document.getElementById("encargo-form").onsubmit = defaultSubmit;

    actualizarLocalStorage();
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

function guardarEnLocalStorage(pedido) {
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

function actualizarLocalStorage() {
  const filas = document.querySelectorAll("#tablaPedidos tbody tr");
  const pedidos = Array.from(filas).map(fila => {
    const celdas = fila.querySelectorAll("td");
    return {
      diaMes: formatearAISO(celdas[0].textContent),
      tienda: celdas[1].textContent,
      empleado: celdas[2].textContent,
      cliente: celdas[3].textContent,
      telefono: celdas[4].textContent,
      nombre: celdas[5].textContent,
      direccion: celdas[6].textContent,
      estado: celdas[7].textContent,
      encargo: celdas[8].textContent,
      observaciones: celdas[9].textContent
    };
  });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

function formatearAISO(fechaTexto) {
  const partes = fechaTexto.split(" de ");
  const meses = {
    enero: "01", febrero: "02", marzo: "03", abril: "04",
    mayo: "05", junio: "06", julio: "07", agosto: "08",
    septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
  };
  const dia = partes[0].padStart(2, "0");
  const mes = meses[partes[1].toLowerCase()];
  const anio = partes[2];
  return `${anio}-${mes}-${dia}`;
}

window.addEventListener("DOMContentLoaded", () => {
  const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidosGuardados.forEach(agregarFilaTabla);
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