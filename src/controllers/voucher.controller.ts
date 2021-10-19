import { Request, ResponseToolkit } from "@hapi/hapi"
import { VoucherModel } from '../models/Model'
import { ProductModel } from '../models/Model'


const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis)


const client = redis.createClient({
    host: 'localhost',
    port: 6379
});
client.on('error', (err: Error) => {
    console.log('Error ' + err);
});

export const addVoucher = async (req: Request, res: ResponseToolkit) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if (product) {
            if (product.max_quantity > req.payload) {
                
            }
        }
        const user = await new VoucherModel(req.payload).save()
        return res.response(user)
        return req.payload
    } catch (error) {
        console.log(error)
    }
}

export const getAllVouchers = async (req: Request, res: ResponseToolkit) => {
    try {
        const users = await VoucherModel.find()
        return res.response(users)
    } catch (error) {
        console.log(error)
    }
}
export const getOneVoucher = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await VoucherModel.findById(req.params.id)
        return user
    } catch (error) {
        console.log(error)
    }
}
export const updateVoucher = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await VoucherModel.findByIdAndUpdate(req.params.id, req.payload)
        return user
    } catch (error) {
        console.log(error)
    }
}

export const tempIDVoucher = async (req: Request, res: Response) => {
    const product = await client.getAsync(req.params.id);
    if (product) {
        return false
    } else {
        await client.setAsync(req.params.id, req.params.id);
        return true
    }
}
