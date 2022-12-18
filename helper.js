const {options} = require('./public/options/mariaDB')
const knex = require('knex')(options)

const Contenedor = require('./api')
let test = new Contenedor(knex,"prueba")

const sendProd = async (socket) =>
  {
    
    async function prodF()
    {
      let preProd = []
      preProd = await test.getAll()
      return preProd
    }

    let prod = await prodF()
    socket.emit('productos', prod)
}

  

module.exports = sendProd