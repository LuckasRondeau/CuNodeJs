import daoLibros from '../src/'  // mi modulo de negocio no deberia saber que implementacion uso 

    function crearCUSaludar(mailer){
     return {
        run:(nombre , dir)=>{
            mailer.enviar(dir, nombre)
        }
    
    function crearCUSolicitudDeListadoPdf( daoLibros , mailer , contentGen , pdfGen ){
        const CU={
            invocar :(remitente, nombreAutor)=>{
            //buscar datos
            const libros =daoLibros.buscarPorAutor(nombreAutor)
            //crear pdf
            const contenidoPdf = contentGen.crear(libros)
            const ruta = pdfGen.crear(contenidoPdf)
            //enviarlo por mail
            mailer.send(remitente , mensaje , ruta )
            }
        }
    }
    return {
        CU
    }

module.exports = { crearCUSolicitudDeListadoPdf , crearCUSaludar}