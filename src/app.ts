const Hapi = require('@hapi/hapi')
const Handlebars = require('handlebars')
const {voucher} = require('./routes/voucher.route')
const { product } = require('./routes/product.route')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')

const { dependencies } = require('../package.json')



export const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // server.views({
    //     engines: { html: Handlebars },
    //     path: __dirname + '/views'
    // })

    const swaggerOptions = {
        info: {
            title: 'Hapi/MongoDB/Bull/Agenda CRUD API Documentation',
            version: dependencies["hapi-swagger"],
        },
    }

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    
    voucher(server)
    product(server)

    

    await server.start()
    console.log('server started on port: ' + server.info.uri)
}