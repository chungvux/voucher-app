import { Server } from '@hapi/hapi'
import {
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller"

export const product = (server: Server) => {

    server.route({
        method: 'GET',
        path: '/product',
        handler: getAllProducts
    })
    server.route({
        method: 'GET',
        path: '/product/{id}',
        handler: getOneProduct
    })
    server.route({
        method: 'POST',
        path: '/product',
        handler: addProduct
    })
    server.route({
        method: 'PUT',
        path: '/product/{id}',
        handler: updateProduct,

    })
    server.route({
        method: 'DELETE',
        path: '/product/{id}',
        handler: deleteProduct
    })
}