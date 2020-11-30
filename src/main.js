const { createServer } = require('./compartido/servidor/Server.js')
const { crearPacientesDao } = require('./pacientes/dao/PacientesDaoFactory.js')
const { crearPacientesApi } = require('./pacientes/aplicacion/PacientesApi.js')
const config = require('../src/config/config.js')
const { crearTareaCU } = require('./casosdeuso/CU.js')
const {programarFecha} = require("../src/servicios/programarFecha.js")

let daoPacientes
let server

async function main() {
    try {
        daoPacientes = await crearPacientesDao()
        console.log(`base de datos conectada`)

        aplicacion = crearPacientesApi(daoPacientes)

        server = await createServer({ aplicacion, port: config.getServerPort() })
        console.log(`servidor conectado en puerto: ${server.port} y escuchando`)
        //EJECUTO CASO DE USO
        const CU = crearTareaCU()
        // Fecha programada Todos los dias a mediaNoche
        //CU.invocar(programarFecha("0 0 * * *"))
        CU.invocar(programarFecha())//fecha por default
    } catch (e) {
        console.log(e.message)
    }
   
}

process.on('SIGINT', async () => {
    try {
        if (server) {
            server.close()
            console.log('servidor cerrado con exito')
        }
        if (daoPacientes) {
            await daoPacientes.close()
            console.log('base de datos desconectada con exito')
        }
    } catch (error) {
        console.err(error)
    } finally {
        process.exit(0)
    }
})

main()
