import { Server } from '@hapi/hapi'
import {
    addVoucher,
    getAllVouchers,
    getOneVoucher,
    updateVoucher
} from "../controllers/voucher.controller"

export const voucher = (server: Server) => {

    server.route({
        method: 'GET',
        path: '/voucher',
        handler: getAllVouchers
    })
    server.route({
        method: 'GET',
        path: '/voucher/{id}',
        handler: getOneVoucher
    })
    server.route({
        method: 'POST',
        path: '/voucher',
        handler: addVoucher
    })
    server.route({
        method: 'PUT',
        path: '/voucher/{id}',
        handler: updateVoucher
    })
}