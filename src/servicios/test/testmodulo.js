const { programarFecha } = require("../../../src/servicios/programarFecha.js")
const {crearTemporizador} = require( "../../../src/servicios/temporizador.js")
const { crearPacientesDao } = require('../../pacientes/dao/PacientesDaoFactory')
const { crearPacientesApi } = require('../../pacientes/aplicacion/PacientesApi')


function main() {
  //Programo por default el horario de la tarea Y nombre
  const FECHA = new Date().toLocaleString();
  let fechaCronJob = programarFecha();
  let nombreTemp = "TEMP1";

  // Creo el temporizador con el nombre
  const temp1 = crearTemporizador(nombreTemp);

  function evento() {
    console.log("------------------------------------------------");
    console.log(`Iniciando Tarea : ${nombreTemp} => `, FECHA);
    console.log("------------------------------------------------");
    // ejecuta la tarea programada
    console.log("<<<<<<<<<<<<<<[EVENTO PROGRAMADO]>>>>>>>>>>>>>>>");
    //tarea de ejemplo pacientes dados de alta !
    mostrar();
  }

  const id = temp1.crearTarea(fechaCronJob, evento);

  setTimeout(() => {
    console.log("");
    console.log("------------------------------------------------");
    console.log(`    Tarea Detenida ${nombreTemp}`, FECHA);
    console.log("------------------------------------------------");
    temp1.cancelar(id);
  }, 20000);
}
async function mostrar() {

  const FECHA = new Date().toLocaleString();
  daoPacientes = await crearPacientesDao()

  api = crearPacientesApi(daoPacientes)

  const pacientes = await api.getAll()

  console.log("");
    console.log("------------------------------------------------");
    console.log(`    Usuarios registrados al `, FECHA);
    console.log("------------------------------------------------");

  for (const paciente of pacientes) {    
      console.log(paciente.nombre);    
  }
}

main();
module.exports = { main }
