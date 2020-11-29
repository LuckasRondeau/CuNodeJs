const assert = require('assert')
const { crearPacientesDao } = require('../../src/pacientes/dao/PacientesDaoFactory.js')
const { crearPaciente } = require('../../src/pacientes/modelos/Paciente.js')

const pacVal = {
    nombre: 'Pedro',
    apellido: 'Perez',
    edad: 35,
    dni: '31321156'
}

const pacVal2 = {
    nombre: 'Roberto',
    apellido: 'Gomez',
    edad: 38,
    dni: '28321156'
}

describe('dao de pacientes', () => {
    let dao

    before(async () => {
        dao = await crearPacientesDao()
    })

    after(async () => {
        await dao.close()
    })

    afterEach(async () => {
        await dao.deleteAll()
    })

    describe('getAll', () => {
        describe('si no hay pacientes', () => {
            it('devuelve una coleccion vacia', async () => {
                const pacientes = await dao.getAll()
                const esperado = []
                assert.deepStrictEqual(pacientes, esperado)
            })
        })

        describe('si hay pacientes', () => {
            it('devuelve una coleccion con esos pacientes', async () => {
                const creado1 = crearPaciente(pacVal)
                const creado2 = crearPaciente(pacVal2)
                await dao.addAll([creado1, creado2])
                const pacientes = await dao.getAll()
                const esperado = [creado1, creado2]
                assert.deepStrictEqual(pacientes, esperado)
            })
        })
    })

    describe('getByDni', () => {
        describe('si hay pacientes y alguno con ese dni', () => {
            it('devuelve una coleccion con ese paciente', async () => {
                const creado1 = crearPaciente(pacVal)
                const creado2 = crearPaciente(pacVal2)
                await dao.addAll([creado1, creado2])
                const pacientes = await dao.getByDni('31321156')
                const esperados = [creado1]
                assert.deepStrictEqual(pacientes, esperados)
            })
        })
    })

    describe('getByAge', () => {
        describe('si hay pacientes y alguno con edad en rango', () => {
            it('devuelve una coleccion con esos pacientes', async () => {
                const creado1 = crearPaciente(pacVal)
                const creado2 = crearPaciente(pacVal2)
                await dao.addAll([creado1, creado2])
                const pacientes = await dao.getByAge({
                    desde: 20,
                    hasta: 37
                })
                const esperados = [creado1]
                assert.deepStrictEqual(pacientes, esperados)
            })
        })
    })

    describe('add', () => {
        it('agrega un estudiante a la coleccion', async () => {
            const creado1 = crearPaciente(pacVal)
            await dao.add(creado1)
            const pacientes = await dao.getAll()
            const esperados = [creado1]
            assert.deepStrictEqual(pacientes, esperados)
        })
    })

    describe('deleteById', () => {
        describe('si hay pacientes y alguno con ese id', () => {
            it('lo borra del sistema', async () => {
                const creado1 = crearPaciente(pacVal)
                const creado2 = crearPaciente(pacVal2)
                await dao.addAll([creado1, creado2])
                await dao.deleteById(creado1.id)
                const all = await dao.getAll()
                assert.deepStrictEqual(all, [creado2])
            })
        })

        describe('si no hay un pacientes con ese id', () => {
            it('lanza un error', async () => {
                await assert.rejects(async () => {
                    await dao.deleteById(123)
                }, (error) => {
                    assert.strictEqual(error.type, 'NOT_FOUND')
                    return true
                })
            })
        })
    })

    describe('updateById', () => {
        describe('si no hay un pacientes con ese id', () => {
            it('lanza un error', async () => {
                const estuCreado = crearPaciente(pacVal)
                await assert.rejects(async () => {
                    await dao.updateById(estuCreado)
                }, (error) => {
                    assert.strictEqual(error.type, 'NOT_FOUND')
                    return true
                })
            })
        })

        describe('si hay pacientes y alguno con ese id', () => {
            it('lo reemplaza', async () => {
                const estuCreado = crearPaciente(pacVal)
                await dao.add(estuCreado)

                const estuModificado = { ...estuCreado }
                estuModificado.nombre = 'nuevo nombre'
                estuModificado.apellido = 'nuevo apellido'

                await dao.updateById(estuModificado)
                const all = await dao.getAll()
                assert.deepStrictEqual(all, [estuModificado])
            })
        })
    })
})