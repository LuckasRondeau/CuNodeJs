const { crearErrorArgumentosInvalidos } = require('../../compartido/errores/ApiError.js')

let nextId = 1

function crearPaciente(objeto) {

    const pac = {}

    if (!objeto.nombre) {
        throw crearErrorArgumentosInvalidos('nombre', 'campo requerido')
    } else {
        pac.nombre = objeto.nombre
    }

    if (!objeto.apellido) {
        throw crearErrorArgumentosInvalidos('apellido', 'campo requerido')
    } else {
        pac.apellido = objeto.apellido
    }

    if (!objeto.edad) {
        throw crearErrorArgumentosInvalidos('edad', 'campo requerido')
    }

    if (isNaN(parseInt(objeto.edad))) {
        throw crearErrorArgumentosInvalidos('edad', 'debe ser un entero')
    } else {
        pac.edad = objeto.edad
    }

    if (!objeto.dni) {
        throw crearErrorArgumentosInvalidos('dni', 'campo requerido')
    }

    if (isNaN(parseInt(objeto.dni))) {
        throw crearErrorArgumentosInvalidos('dni', 'debe contener unicamente caracteres numericos')
    } else {
        pac.dni = objeto.dni
    }
    

    if (!objeto.id) {
    pac.id = nextId++
    } else {
        pac.id = objeto.id
    }

    return pac
}

module.exports = { crearPaciente }