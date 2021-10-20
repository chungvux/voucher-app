import { Request, ResponseToolkit } from "@hapi/hapi"
import { ProductModel } from '../models/Model'

export const addProduct = async (req: Request, res: ResponseToolkit) => {
    const session = await ProductModel.startSession()
    session.startTransaction()
    try {
        const opts = { session }
        const user = await new ProductModel(req.payload).save(opts)

        await session.commitTransaction();
        session.endSession();

        return res.response(user)
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

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
        return res.response(user)
    } catch (error) {
        console.log(error)
    }
}
export const updateProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await ProductModel.findByIdAndUpdate(req.params.id, req.payload)
        return res.response(user)
    } catch (error) {
        console.log(error)
    }
}
export const deleteProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await ProductModel.findByIdAndDelete(req.params.id)
        return res.response(user)
    } catch (error) {
        console.log(error)
    }
}