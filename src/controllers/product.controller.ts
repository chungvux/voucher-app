import { Request, ResponseToolkit } from "@hapi/hapi"
import { ProductModel } from '../models/Model'

export const addProduct = async (req: Request, res: ResponseToolkit) => {
    const session = await ProductModel.startSession()
    session.startTransaction()
    try {
        const opts = { session }
        const user = await new ProductModel(req.payload).save(opts)

        await session.commitTransaction()
        session.endSession()

        return res.response(user).code(200)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()

        console.log(error)
    }
}

export const getAllProducts = async (req: Request, res: ResponseToolkit) => {
    try {
        const users = await ProductModel.find()
        if (users) {
            return res.response(users).code(200)
        } else {
            return res.response("Null users").code(404)
        }

    } catch (error) {
        console.log(error)
    }
}
export const getOneProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await ProductModel.findById(req.params.id)
        if (user) {
            return res.response(user).code(200)
        } else {
            return res.response("null user").code(404)
        }

    } catch (error) {
        console.log(error)
    }
}
export const updateProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await ProductModel.findByIdAndUpdate(req.params.id, req.payload)
        return res.response(user).code(200)
    } catch (error) {
        console.log(error)
    }
}
export const deleteProduct = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await ProductModel.findByIdAndDelete(req.params.id)
        if (user) {
            return res.response(user).code(200)
        } else {
            return res.response("null ID").code(404)
        }
    } catch (error) {
        console.log(error)
    }
}