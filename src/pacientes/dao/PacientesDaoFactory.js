const { crearPacienteDaoDb } = require('./PacientesDaoDb.js')
const { crearPacientesDaoMemory } = require('./PacientesDaoMemory.js')
const config = require('../../config/config.js')

async function crearPacientesDao() {

    const tipoPersistencia = config.getTipoPers()

    if (tipoPersistencia === 'memoria')
        return await crearPacientesDaoMemory()
    else if (tipoPersistencia === 'db')
        return await crearPacienteDaoDb(config.getCnxObj())
    else
        throw new Error('invalid type of db')
}

module.exports = { crearPacientesDao }