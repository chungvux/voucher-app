const Hapi = require('@hapi/hapi');
const {voucher} = require('./routes/voucher.route')
const { product } = require('./routes/product.route')



export const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    voucher(server)
    product(server)

    await server.start()
    console.log('server started on port: ' + server.info.uri)
}