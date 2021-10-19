import { Request, ResponseToolkit } from "@hapi/hapi"
import { ProductModel } from '../models/Model'

const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

export const addProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await new ProductModel(req.payload).save()
        return res.response(user)
    } catch (error) {
        console.log(error)
    }
}

export const getAllProducts = async (req: Request, res: ResponseToolkit) => {
    try {
        const users = await ProductModel.find()
        return res.response(users)
    } catch (error) {
        console.log(error)
    }
}
export const getOneProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await ProductModel.findById(req.params.id)
        return user
    } catch (error) {
        console.log(error)
    }
}
export const updateProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await ProductModel.findByIdAndUpdate(req.params.id, req.payload)
        return user
    } catch (error) {
        console.log(error)
    }
}
export const deleteProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await ProductModel.findByIdAndDelete(req.params.id)
        return user
    } catch (error) {
        console.log(error)
    }
}