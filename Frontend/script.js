function defaultSubmit(e) {
  e.preventDefault();
  const datos = getDatosFormulario();
  datos.id = Date.now(); // ID único

  agregarFilaTabla(datos);
  guardarEnLocalStorage(datos);
  actualizarOpcionesFiltros();

  mostrarMensaje("Encargo guardado correctamente.");
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

function crearFilaHTML(datos) {
  return `
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
    <td>
      <div class="dropdown">
        <button class="dropdown-btn">⋮</button>
        <div class="dropdown-menu">
          <button class="editar">✏️ Editar</button>
          <button class="eliminar">🗑️ Eliminar</button>
        </div>
      </div>
    </td>
  `;
}

function agregarFilaTabla(datos) {
  const tabla = document.querySelector("#tablaPedidos tbody");
  const fila = tabla.insertRow();
  fila.setAttribute("data-id", datos.id);
  fila.innerHTML = crearFilaHTML(datos);

  const dropdownBtn = fila.querySelector(".dropdown-btn");
  const editarBtn = fila.querySelector(".editar");
  const eliminarBtn = fila.querySelector(".eliminar");

  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
    dropdownBtn.closest(".dropdown").classList.toggle("show");
  });

  editarBtn.addEventListener("click", () => {
    mostrarFormulario();
    cargarFormularioParaEditar(fila, datos);
    fila.querySelector(".dropdown").classList.remove("show");
  });

  eliminarBtn.addEventListener("click", () => {
    const confirmar = confirm(`¿Eliminar el pedido de ${datos.cliente} en ${datos.tienda}?`);
    if (confirmar) {
      fila.remove();
      actualizarLocalStorage();
      actualizarOpcionesFiltros();
      mostrarMensaje("Pedido eliminado.");
    }
  });
}

function cargarFormularioParaEditar(fila, datos) {
  Object.entries(datos).forEach(([key, value]) => {
    const input = document.getElementById(key);
    if (input) input.value = value;
  });

  const boton = document.querySelector("#encargo-form button");
  boton.textContent = "Actualizar pedido";

  document.getElementById("encargo-form").onsubmit = function (e) {
    e.preventDefault();
    const nuevosDatos = getDatosFormulario();
    nuevosDatos.id = datos.id;

    fila.innerHTML = crearFilaHTML(nuevosDatos);
    agregarEventosDesplegable(fila, nuevosDatos);

    document.getElementById("encargo-form").reset();
    boton.textContent = "Guardar encargo";
    document.getElementById("encargo-form").onsubmit = defaultSubmit;

    actualizarLocalStorage();
    actualizarOpcionesFiltros();
    mostrarMensaje("Pedido actualizado correctamente.");
  };
}

function agregarEventosDesplegable(fila, datos) {
  const dropdownBtn = fila.querySelector(".dropdown-btn");
  const editarBtn = fila.querySelector(".editar");
  const eliminarBtn = fila.querySelector(".eliminar");

  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
    dropdownBtn.closest(".dropdown").classList.toggle("show");
  });

  editarBtn.addEventListener("click", () => {
    mostrarFormulario();
    cargarFormularioParaEditar(fila, datos);
    fila.querySelector(".dropdown").classList.remove("show");
  });

  eliminarBtn.addEventListener("click", () => {
    const confirmar = confirm(`¿Eliminar el pedido de ${datos.cliente} en ${datos.tienda}?`);
    if (confirmar) {
      fila.remove();
      actualizarLocalStorage();
      actualizarOpcionesFiltros();
      mostrarMensaje("Pedido eliminado.");
    }
  });
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  if (isNaN(fecha)) return "";
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia} de ${nombreMesDesdeNumero(mes)} de ${anio}`;
}

function nombreMesDesdeNumero(numeroMes) {
  const meses = {
    "01": "enero", "02": "febrero", "03": "marzo", "04": "abril",
    "05": "mayo", "06": "junio", "07": "julio", "08": "agosto",
    "09": "septiembre", "10": "octubre", "11": "noviembre", "12": "diciembre"
  };
  return meses[numeroMes];
}

function formatearAISO(fechaTexto) {
  const partes = fechaTexto.split(" de ");
  if (partes.length !== 3) return "";
  const dia = partes[0].padStart(2, "0");
  const mes = {
    enero: "01", febrero: "02", marzo: "03", abril: "04",
    mayo: "05", junio: "06", julio: "07", agosto: "08",
    septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
  }[partes[1]];
  const anio = partes[2];
  return `${anio}-${mes}-${dia}`;
}

function mostrarFormulario() {
  document.getElementById("panel-formulario").classList.add("activa");
  document.body.classList.add("formulario-activo");
  document.getElementById("toggle-form").classList.add("oculto");
  document.getElementById("cerrar-formulario").classList.remove("oculto");
}

function ocultarFormulario() {
  document.getElementById("panel-formulario").classList.remove("activa");
  document.body.classList.remove("formulario-activo");
  document.getElementById("cerrar-formulario").classList.add("oculto");
  document.getElementById("toggle-form").classList.remove("oculto");
  document.querySelector("#encargo-form button").textContent = "Guardar encargo";
  document.getElementById("encargo-form").onsubmit = defaultSubmit;
  document.getElementById("encargo-form").reset();
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
      id: parseInt(fila.getAttribute("data-id")),
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

function mostrarMensaje(mensaje) {
  const respuesta = document.getElementById("respuesta");
  respuesta.textContent = mensaje;
  setTimeout(() => respuesta.textContent = "", 3000);
}

window.addEventListener("DOMContentLoaded", () => {
  const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidosGuardados.forEach(agregarFilaTabla);
  actualizarOpcionesFiltros();
});

document.getElementById("toggle-form").addEventListener("click", mostrarFormulario);
document.getElementById("cerrar-formulario").addEventListener("click", ocultarFormulario);

document.getElementById("filtroMes").addEventListener("change", aplicarFiltros);
document.getElementById("filtroAnio").addEventListener("change", aplicarFiltros);
document.getElementById("filtroTienda").addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const mes = document.getElementById("filtroMes").value;
  const anio = document.getElementById("filtroAnio").value;
  const tienda = document.getElementById("filtroTienda").value;

  const filas = document.querySelectorAll("#tablaPedidos tbody tr");

  filas.forEach(fila => {
    const fechaTexto = fila.cells[0].textContent;
    const tiendaTexto = fila.cells[1].textContent;
    const partesFecha = fechaTexto.split(" de ");
    const mesPedido = partesFecha[1];
    const anioPedido = partesFecha[2];

    const coincideMes = !mes || nombreMesDesdeNumero(mes) === mesPedido;
    const coincideAnio = !anio || anio === anioPedido;
    const coincideTienda = !tienda || tienda === tiendaTexto;

    fila.style.display = (coincideMes && coincideAnio && coincideTienda) ? "" : "none";
  });
}

function actualizarOpcionesFiltros() {
  const filas = document.querySelectorAll("#tablaPedidos tbody tr");

  const meses = new Set();
  const anios = new Set();
  const tiendas = new Set();

  filas.forEach(fila => {
    const partesFecha = fila.cells[0].textContent.split(" de ");
    const mes = {
      enero: "01", febrero: "02", marzo: "03", abril: "04",
      mayo: "05", junio: "06", julio: "07", agosto: "08",
      septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
    }[partesFecha[1]];

    const anio = partesFecha[2];
    const tienda = fila.cells[1].textContent;

    meses.add(mes);
    anios.add(anio);
    tiendas.add(tienda);
  });

  actualizarSelect("filtroMes", Array.from(meses).sort());
  actualizarSelect("filtroAnio", Array.from(anios).sort());
  actualizarSelect("filtroTienda", Array.from(tiendas).sort());
}

function actualizarSelect(id, valores) {
  const select = document.getElementById(id);
  const valorActual = select.value;

  select.innerHTML = `<option value="">Todos</option>`;
  valores.forEach(valor => {
    const option = document.createElement("option");
    option.value = valor;
    option.textContent = id === "filtroMes" ? nombreMesDesdeNumero(valor) : valor;
    select.appendChild(option);
  });

  if (valores.includes(valorActual)) {
    select.value = valorActual;
  }
}

// Cerrar menús desplegables al hacer clic fuera
document.addEventListener("click", function (e) {
  document.querySelectorAll(".dropdown").forEach(drop => {
    if (!drop.contains(e.target)) {
      drop.classList.remove("show");
    }
  });
});
