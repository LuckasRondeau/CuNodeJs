const cron = require("node-cron");

function crearTemporizador(nombreTemp) {
  const programarTareaDia = {
    crearTarea: (fechaCJ, evento) => {
      console.log(nombreTemp ,"Tarea programada => cronExpression = ", fechaCJ);
      const cronJob = cron.schedule(fechaCJ,evento);
      return cronJob;
    },
    cancelar:(id)=>{
      const cronJob =(id);
      return cronJob.stop();
    }
  };
  return programarTareaDia;
}


module.exports ={crearTemporizador};
