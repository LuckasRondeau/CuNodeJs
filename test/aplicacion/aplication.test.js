const assert = require('assert')
const { crearPacientesDao } = require('../../src/pacientes/dao/PacientesDaoFactory.js')
const { crearPaciente } = require('../../src/pacientes/modelos/Paciente.js')
const { crearPacientesApi } = require('../../src/pacientes/aplicacion/PacientesApi.js')


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

describe('aplicacion', () => {
    describe('si la base de datos anda bien', () => {

        let dao
        let api

        before(async () => {
            dao = await crearPacientesDao()
        })

        beforeEach(async () => {
            api = crearPacientesApi(dao)
        })

        afterEach(async () => {
            await dao.deleteAll()
        })

        after(async () => {
            await dao.close()
        })

        describe('getAll', () => {
            describe('si no hay pacientes', () => {
                it('devuelve una coleccion vacia', async () => {
                    const pacientes = await api.getAll()
                    const esperado = []
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })

            describe('si hay pacientes', () => {
                it('devuelve una coleccion con esos pacientes', async () => {
                    const creado1 = crearPaciente(pacVal)
                    const creado2 = crearPaciente(pacVal2)
                    await dao.addAll([creado1, creado2])
                    const pacientes = await api.getAll()
                    const esperado = [creado1, creado2]
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })
        })

        describe('getByDni', () => {
            describe('si hay pacientes pero ninguno con ese dni', () => {
                it('devuelve una coleccion vacia', async () => {
                    await dao.add(crearPaciente(pacVal2))
                    const pacientes = await api.getByDni('31321156')
                    const esperado = []
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })

            describe('si hay pacientes y alguno con ese dni', () => {
                it('devuelve una coleccion con ese paciente', async () => {
                    const creado1 = crearPaciente(pacVal)
                    const creado2 = crearPaciente(pacVal2)
                    await dao.addAll([creado1, creado2])
                    const pacientes = await api.getByDni('31321156')
                    const esperado = [creado1]
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })
        })

        describe('getByAge', () => {
            describe('si hay pacientes pero ninguno con edad en rango', () => {
                it('devuelve una coleccion vacia', async () => {
                    const creado1 = crearPaciente(pacVal)
                    const creado2 = crearPaciente(pacVal2)
                    await dao.addAll([creado1, creado2])
                    const pacientes = await api.getByAge({
                        desde: 90,
                        hasta: 100
                    })
                    const esperado = []
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })

            describe('si hay pacientes y alguno con edad en rango', () => {
                it('devuelve una coleccion con esos pacientes', async () => {
                    const creado1 = crearPaciente(pacVal)
                    const creado2 = crearPaciente(pacVal2)
                    await dao.addAll([creado1, creado2])
                    const pacientes = await api.getByAge({
                        desde: 20,
                        hasta: 37
                    })
                    const esperado = [creado1]
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })
        })

        describe('create', () => {
            describe('si hay pacientes con el mismo dni', () => {
                it('lanza un error de argumentos invalidos y no lo agrega a la coleccion', async () => {
                    await dao.add(crearPaciente(pacVal))
                    await assert.rejects(async () => {
                        await api.create(pacVal)
                    },
                        (err) => {
                            assert.strictEqual(err.type, 'INVALID_ARGS')
                            return true
                        })
                })
            })

            describe('si no hay pacientes con el nuevo dni', () => {
                it('asigna un id al paciente y lo agrega a la coleccion', async () => {
                    const paciente = await api.create(pacVal)
                    assert(!!paciente.id)
                    delete paciente.id
                    assert.deepStrictEqual(paciente, pacVal)
                })
            })

            describe('al agregar nuevos pacientes', () => {
                it('asigna nuevos ids para cada uno', async () => {
                    const paciente1 = await api.create(pacVal)
                    const paciente2 = await api.create(pacVal2)
                    assert(!!paciente1.id)
                    assert(!!paciente2.id)
                    assert(paciente1.id !== paciente2.id)
                })
            })
        })

        describe('deleteById', () => {
            describe('si no hay un pacientes con ese id', () => {
                it('lanza un error de recurso no encontrado', async () => {
                    await assert.rejects(async () => {
                        await api.deleteById(1)
                    }, (error) => {
                        assert.strictEqual(error.type, 'NOT_FOUND')
                        return true
                    })
                })
            })

            describe('si hay pacientes y alguno con ese id', () => {
                it('lo borra del sistema', async () => {
                    const creado1 = crearPaciente(pacVal)
                    const creado2 = crearPaciente(pacVal2)
                    await dao.addAll([creado1, creado2])
                    await api.deleteById(creado1.id)
                    const pacientes = await dao.getAll()
                    assert.deepStrictEqual(pacientes, [creado2])
                })
            })
        })

        describe('replaceById', () => {
            describe('si no hay un pacientes con ese id', () => {
                it('lanza un error de recurso no encontrado', async () => {
                    const estuCreado = crearPaciente(pacVal)
                    await assert.rejects(async () => {
                        await api.replaceById(estuCreado, estuCreado.id)
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

                    const paciente = await api.replaceById(estuModificado, estuModificado.id)

                    assert.deepStrictEqual(estuModificado, paciente)
                    const pacientes = await dao.getAll()
                    assert.deepStrictEqual(pacientes, [estuModificado])
                })
            })
        })
    })
 })
