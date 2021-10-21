import { Server } from '@hapi/hapi'
const Joi = require('joi')
import {
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller"

export const product = async (server: Server) => {

    server.route({
        method: 'GET',
        path: '/product',
        options: {
            handler: getAllProducts,
            tags: ['api']
        }
    })
    server.route({
        method: 'GET',
        path: '/product/{id}',
        options: {
            handler: getOneProduct,
            tags: ['api'],
            validate: {
                params: Joi.object().keys({
                    id: Joi.string().min(5)
                })
            }
        }
    })
    server.route({
        method: 'POST',
        path: '/product',
        options: {
            handler: addProduct,
            tags: ['api'],
            validate: {
                payload: Joi.object().keys({
                    name: Joi.string().min(5).error((err: Error) => console.log(err)),
                    max_quantity: Joi.number().integer().greater(0),
                    thumbnail: Joi.string().min(5)
                })
            }
        }
    })
    server.route({
        method: 'PUT',
        path: '/product/{id}',
        options: {
            handler: updateProduct,
            tags: ['api'],
            validate: {
                params: Joi.object().keys({
                    id: Joi.string().min(5)
                }),
                payload: Joi.object().keys({
                    name: Joi.string().min(5),
                    max_quantity: Joi.number().integer().greater(0),
                    thumbnail: Joi.string().min(5)
                })
            }
        }
    })
    server.route({
        method: 'DELETE',
        path: '/product/{id}',
        options: {
            handler: deleteProduct,
            tags: ['api'],
            validate: {
                params: Joi.object().keys({
                    id: Joi.string().min(5)
                })
            }
        }
    })
}