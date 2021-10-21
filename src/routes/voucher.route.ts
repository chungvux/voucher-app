import { Server } from '@hapi/hapi'
const Joi = require('joi')
import {
    addVoucher,
    getAllVouchers,
    getOneVoucher,
    updateVoucher,
    tempIDVoucher
} from "../controllers/voucher.controller"

export const voucher = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/voucher',
        options: {
            handler: getAllVouchers,
            tags: ['api']
        }
    })
    server.route({
        method: 'GET',
        path: '/voucher/{id}',
        options: {
            handler: getOneVoucher,
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
        path: '/voucher/{id}',
        options: {
            handler: addVoucher,
            tags: ['api'],
            validate: {
                params: Joi.object().keys({
                    id: Joi.string().min(5)
                }),
                payload: Joi.object().keys({
                    name: Joi.string().min(5),
                    quantity: Joi.number().integer().greater(0),
                    email: Joi.string().min(5).regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
                })
            }
        }
    })
    server.route({
        method: 'PUT',
        path: '/voucher/{id}',
        options: {
            handler: updateVoucher,
            tags: ['api'],
            validate: {
                params: Joi.object().keys({
                    id: Joi.string().min(5)
                }),
                payload: Joi.object().keys({
                    name: Joi.string().min(5),
                    quantity: Joi.number().integer().greater(2),
                    email: Joi.string().min(5)
                })
            }
        }
    })
    server.route({
        method: 'POST',
        path: '/ajax/product/{id}',
        options: {
            handler: tempIDVoucher,
            tags: ['api'],
            validate: {
                params: Joi.object().keys({
                    id: Joi.string().min(5)
                })
            }
        }
    })
}