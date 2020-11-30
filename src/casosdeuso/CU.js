const {crearTemporizador} = require( "../../src/servicios/temporizador.js")
const {crearPacientesDao} = require('../pacientes/dao/PacientesDaoFactory.js')
const {crearPacientesApi} = require('../pacientes/aplicacion/PacientesApi.js')


//Muestra los nombres de lo pacientes registrados a una fecha programada

function crearTareaCU() {

  return {
    invocar: (fechaCronJob) => {
      const nombreTemp="CU1"
      const temp1 = crearTemporizador(nombreTemp);
      const id = temp1.crearTarea(fechaCronJob, tarea);
    },
  };
}

function tarea() {
  const nombreTemp="CU1"
  console.log("------------------------------------------------");
  console.log(`Iniciando Tarea : ${nombreTemp} => `, Date().toLocaleString());
  console.log("------------------------------------------------");
  // ejecuta la tarea programada
  console.log("<<<<<<<<<<<<<<[EVENTO PROGRAMADO]>>>>>>>>>>>>>>>");
  //tarea de ejemplo pacientes dados de alta !
  mostrar();
}
async function mostrar() {
  daoPacientes = await crearPacientesDao();
  api = crearPacientesApi(daoPacientes);
  const pacientes = await api.getAll();

  console.log("");
  console.log("------------------------------------------------");
  console.log(`    Usuarios registrados al `,  Date().toLocaleString());
  console.log("------------------------------------------------");

  for (const paciente of pacientes) {
    console.log(paciente.nombre);
  }
}
module.exports = { crearTareaCU };
