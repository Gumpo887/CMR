const assert = require('assert');

function nombreMesDesdeNumero(numeroMes) {
  const meses = {
    "01": "enero", "02": "febrero", "03": "marzo", "04": "abril",
    "05": "mayo", "06": "junio", "07": "julio", "08": "agosto",
    "09": "septiembre", "10": "octubre", "11": "noviembre", "12": "diciembre"
  };
  return meses[numeroMes];
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  if (isNaN(fecha)) return "";
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia} de ${nombreMesDesdeNumero(mes)} de ${anio}`;
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

assert.strictEqual(formatearFecha("2023-09-05"), "05 de septiembre de 2023");
assert.strictEqual(formatearFecha("invalid"), "");
assert.strictEqual(formatearAISO("05 de septiembre de 2023"), "2023-09-05");
assert.strictEqual(formatearAISO("invalid"), "");

console.log("All tests passed.");
