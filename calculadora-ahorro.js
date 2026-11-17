// =====================================================================
// INTERACCIÓN INDIVIDUAL: calculadora de ahorro de energía (#orientador)
// ODS 7: Energía asequible y no contaminante.
// Usuario: elige un artefacto, escribe las horas de uso al día y presiona
//          "Calcular ahorro".
// Página:  muestra cuánta energía y dinero ahorraría al cambiarlo por uno
//          eficiente, o un mensaje de error si los datos no son válidos.
// =====================================================================

// PASO 1. DOM: localizar los elementos del HTML usando sus identificadores.
const formulario = document.querySelector('#form-ahorro');
const selectArtefacto = document.querySelector('#artefacto');
const campoHoras = document.querySelector('#horas');
const campoTarifa = document.querySelector('#tarifa');
const errorHoras = document.querySelector('#error-horas');
const errorTarifa = document.querySelector('#error-tarifa');
const textoCambio = document.querySelector('#cambio-propuesto');
const botonLimpiar = document.querySelector('#limpiar-calculo');
const resultado = document.querySelector('#resultado');
const resActual = document.querySelector('#res-actual');
const resNuevo = document.querySelector('#res-nuevo');
const resKwh = document.querySelector('#res-kwh');
const resMes = document.querySelector('#res-mes');
const resAnio = document.querySelector('#res-anio');
const resPorcentaje = document.querySelector('#res-porcentaje');

// PASO 2. Datos de referencia: potencia en vatios (W) del artefacto actual y del eficiente.
// Son valores aproximados para estimar; la clave coincide con el value de cada <option>.
const artefactos = {
  foco:  { actual: 'Foco incandescente',               potenciaActual: 60,   nuevo: 'foco LED',                         potenciaNueva: 9 },
  tv:    { actual: 'Televisor antiguo de plasma',      potenciaActual: 200,  nuevo: 'televisor LED',                    potenciaNueva: 60 },
  pc:    { actual: 'Computadora de escritorio antigua', potenciaActual: 200, nuevo: 'laptop eficiente',                 potenciaNueva: 50 },
  terma: { actual: 'Terma eléctrica',                  potenciaActual: 1500, nuevo: 'terma solar con apoyo eléctrico',  potenciaNueva: 300 }
};
const DIAS_POR_MES = 30;

// PASO 3. Mostrar qué cambio propone ACME para el artefacto elegido.
function mostrarCambio() {
  const a = artefactos[selectArtefacto.value];
  textoCambio.textContent = 'Cambio propuesto: ' + a.actual + ' (' + a.potenciaActual +
    ' W) por ' + a.nuevo + ' (' + a.potenciaNueva + ' W).';
}

// PASO 4. Mostrar y quitar mensajes de error.
function mostrarError(campo, parrafo, mensaje) {
  parrafo.textContent = mensaje;
  parrafo.hidden = false;                       // CAMBIO EN EL DOM: se ve el mensaje
  campo.setAttribute('aria-invalid', 'true');   // CAMBIO EN EL DOM: el campo queda marcado como inválido
}
function quitarErrores() {
  errorHoras.hidden = true;
  errorTarifa.hidden = true;
  campoHoras.removeAttribute('aria-invalid');
  campoTarifa.removeAttribute('aria-invalid');
}

// PASO 5. Validar los datos. Devuelve true si todo está bien.
function validar() {
  quitarErrores();
  let primerError = null;

  const horas = Number(campoHoras.value);
  if (campoHoras.value === '') {
    mostrarError(campoHoras, errorHoras, 'Escribe cuántas horas al día usas el artefacto.');
    primerError = campoHoras;
  } else if (horas < 0.5 || horas > 24) {
    mostrarError(campoHoras, errorHoras, 'Las horas deben estar entre 0.5 y 24.');
    primerError = campoHoras;
  }

  const tarifa = Number(campoTarifa.value);
  if (campoTarifa.value === '' || tarifa <= 0) {
    mostrarError(campoTarifa, errorTarifa, 'Escribe una tarifa mayor que 0.');
    if (!primerError) primerError = campoTarifa;
  }

  if (primerError) {
    primerError.focus();   // llevar al usuario al primer campo con problema
    return false;
  }
  return true;
}

// PASO 6. Calcular el ahorro y mostrarlo en la página.
function calcularAhorro() {
  const a = artefactos[selectArtefacto.value];
  const horas = Number(campoHoras.value);
  const tarifa = Number(campoTarifa.value);

  // Energía (kWh al mes) = potencia (W) x horas al día x días / 1000
  const kwhActual = a.potenciaActual * horas * DIAS_POR_MES / 1000;
  const kwhNuevo = a.potenciaNueva * horas * DIAS_POR_MES / 1000;
  const ahorroKwh = kwhActual - kwhNuevo;
  const ahorroMes = ahorroKwh * tarifa;
  const porcentaje = Math.round((1 - a.potenciaNueva / a.potenciaActual) * 100);

  // CAMBIOS EN EL DOM: escribir los resultados y mostrar el bloque.
  resActual.textContent = kwhActual.toFixed(2) + ' kWh/mes';
  resNuevo.textContent = kwhNuevo.toFixed(2) + ' kWh/mes';
  resKwh.textContent = ahorroKwh.toFixed(2) + ' kWh';
  resMes.textContent = 'S/ ' + ahorroMes.toFixed(2);
  resAnio.textContent = 'S/ ' + (ahorroMes * 12).toFixed(2);
  resPorcentaje.textContent = 'Con el equipo eficiente reduces el consumo de este artefacto en ' + porcentaje + '%.';
  resultado.hidden = false;
}

// PASO 7. Eventos que activan la interacción.

// Al presionar "Calcular ahorro" o Enter dentro del formulario.
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();      // evita que la página se recargue
  resultado.hidden = true;
  if (validar()) {
    calcularAhorro();
  }
});

// Al elegir otro artefacto: actualizar el cambio propuesto.
selectArtefacto.addEventListener('change', mostrarCambio);

// Si el usuario modifica cualquier dato, el resultado anterior ya no es válido: se oculta.
formulario.addEventListener('input', function () {
  resultado.hidden = true;
});

// Botón "Limpiar": volver al estado inicial.
botonLimpiar.addEventListener('click', function () {
  formulario.reset();           // restaura artefacto, horas vacías y tarifa 0.80
  quitarErrores();
  resultado.hidden = true;
  mostrarCambio();
  selectArtefacto.focus();
});

// PASO 8. Estado inicial: mostrar el cambio propuesto del primer artefacto.
mostrarCambio();
