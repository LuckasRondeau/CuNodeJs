const { MongoClient } = require('mongodb')
const { crearPaciente } = require('../modelos/Paciente.js')
const {crearErrorRecursoNoEncontrado, crearErrorArgumentosInvalidos, crearErrorDeBaseDeDatos
} = require('../../compartido/errores/ApiError.js')
const config = require('../../config/config.js')

function log(line) {
    if (config.isLogEnabled()) console.log(line)
}

async function crearPacienteDaoDb({ cnxStr, dbName, collectionName }) {

    const client = new MongoClient(cnxStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    try {
        log('conectandose a mongodb...')
        await client.connect()
        log('...conectado!')
    } catch (error) {
        throw crearErrorDeBaseDeDatos(error.message)
    }

    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    return {
        getAll: async () => {
            const registros = await collection.find({}).toArray()
            const pacientes = registros.map(reg => crearPaciente(reg))
            return pacientes
        },
        getByDni: async (unDni) => {
            const registros = await collection.find({ dni: unDni }).toArray()
            const pacientes = registros.map(reg => crearPaciente(reg))
            return pacientes
        },
        getByAge: async ({ desde, hasta }) => {
            const registros = await collection.find({ edad: { $gte: desde, $lte: hasta } }).toArray()
            const pacientes = registros.map(reg => crearPaciente(reg))
            return pacientes
        },
        addAll: async (elements) => {
            await collection.insertMany(elements)
            for (const e of elements) {
                delete e._id
            }
        },
        add: async (element) => {
            await collection.insertOne(element)
            delete element._id
        },
        addUnique: async (elemento, campo) => {
            const query = {}
            query[campo] = elemento[campo]

            const result = await collection.updateOne(
                query,
                { $setOnInsert: elemento },
                {
                    upsert: true,
                    returnOriginal: false
                }
            )

            if (result.matchedCount > 0) {
                throw crearErrorArgumentosInvalidos('campo unico no respetado')
            }

            delete elemento._id
            return elemento
        },
        deleteById: async (unId) => {
            const { deletedCount } = await collection.deleteOne({ id: unId })
            if (!deletedCount) {
                throw crearErrorRecursoNoEncontrado('paciente', unId)
            }
        },
        updateById: async (paciente) => {
            const { modifiedCount } = await collection.replaceOne({ id: paciente.id }, paciente)
            if (modifiedCount === 0) {
                throw crearErrorRecursoNoEncontrado('paciente', paciente.id)
            }
            delete paciente._id
            return paciente
        },
        deleteAll: async () => {
            return await collection.deleteMany({})
        },
        close: async () => {
            log('cerrando conexion a mongodb...')
            await client.close()
            log('...conexion cerrada!')
        }
    }
}

module.exports = { crearPacienteDaoDb }