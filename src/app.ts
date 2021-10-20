const Hapi = require('@hapi/hapi')
const Vision = require('@hapi/vision')
const Handlebars = require('handlebars')
const {voucher} = require('./routes/voucher.route')
const { product } = require('./routes/product.route')



export const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(Vision)
    server.views({
        engines: { html: Handlebars },
        path: __dirname + '/views'
    });

    
    voucher(server)
    product(server)

    

    await server.start()
    console.log('server started on port: ' + server.info.uri)
}