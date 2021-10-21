import { Request, ResponseToolkit } from "@hapi/hapi"
import { Job } from "agenda"

import { VoucherModel, ProductModel } from '../models/Model'
import Queue = require("bull") 
const nodemailer = require('nodemailer')
const Agenda = require('agenda')



const redis = require('redis') 
const { promisifyAll } = require('bluebird') 

promisifyAll(redis)


const client = redis.createClient({
    host: 'localhost',
    port: 6379
}) 
client.on('error', (err: Error) => {
    console.log('Error ' + err) 
}) 

const sendMailQueue = new Queue('sendMail', client)

sendMailQueue.process((job: Queue.Job, done: Queue.DoneCallback) => {
    sendMail(job.data.email, job.data.product)
    done()
    done(Error('error transcoding'))
})

let agenda = new Agenda()
agenda.database("mongodb+srv://chung:1234@cluster0.plitd.mongodb.net/voucherdb?retryWrites=true&w=majority", "agendaJobs")


interface AddVoucherRequest extends Request {
    payload: {
        name: string
        quantity: number
        email: string
    }
}

interface Product {
    name: string
    max_quantity: number
    thumbnail: string
}

export const addVoucher = async (req: AddVoucherRequest, res: ResponseToolkit) => {
    const sessionProduct = await ProductModel.startSession()
    sessionProduct.startTransaction()
    const idProduct = req.params.id    

    const options = {
        delay: 60000, // 8 hours in ms
        attempts: 2
    }

    try {
        const optProduct = { sessionProduct }
        const product: Product = await ProductModel.findById(idProduct, null, optProduct)
        if (product) {
            const max_quantity = Number(product.max_quantity)
            const quantity = Number(req.payload.quantity)
            if (max_quantity >= quantity) {
                const sessionVoucher = await VoucherModel.startSession()
                sessionVoucher.startTransaction()
                const optVoucher = { sessionVoucher }
                
                const left_quantity: number = max_quantity - quantity

                const voucher = await new VoucherModel(req.payload).save(optVoucher)
                const updateProduct = await ProductModel.findByIdAndUpdate(idProduct, { max_quantity: left_quantity })
                const email = req.payload.email
                product.max_quantity = quantity

                const data = {
                    email: email,
                    product: product
                }
                await sendMailQueue.add(data, options)

                await sessionVoucher.commitTransaction()
                sessionVoucher.endSession()
                const time = new Date()

                return res.response({ voucher, updateProduct, email, time})
            } else {
                await sessionProduct.abortTransaction()
                sessionProduct.endSession()

                return res.response("Not enough item").code(400)
            }
        } else {
            await sessionProduct.abortTransaction()
            sessionProduct.endSession()

            return res.response("have no item").code(404)
        }
    } catch (error) {
        await sessionProduct.abortTransaction()
        sessionProduct.endSession()

        console.log(error)
    }
}

export const getAllVouchers = async (req: Request, res: ResponseToolkit) => {
    try {
        const users = await VoucherModel.find()
        return res.response(users).code(200)
    } catch (error) {
        console.log(error)
    }
}
export const getOneVoucher = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await VoucherModel.findById(req.params.id)
        return res.response(user).code(200)
    } catch (error) {
        console.log(error)
    }
}
export const updateVoucher = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await VoucherModel.findByIdAndUpdate(req.params.id, req.payload)
        return res.response(user).code(200)
    } catch (error) {
        console.log(error)
    }
}

export const tempIDVoucher = async (req: Request, res: ResponseToolkit) => {
    const product = await client.getAsync(req.params.id)
    if (product) {
        return res.response("Other people is oddering, please wait...").code(409)
    } else {
        await client.setAsync(req.params.id, req.params.id)

        agenda.define('deleteID', (job: Job, done: Function) => {
            deleteID(req.params.id)
            done()
        })
        
        await agenda.schedule('1 minute', 'deleteID')

        await client.getAsync(req.params.id)
        return res.response(req.params.id).code(200)
    }
}


let sendMail = (email: String, product: Product) => {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: 'chung.vu@hdwebsoft.co',
            to: email,
            subject: 'Email of something',
            text: `${product.name}  ----  ${product.max_quantity}  ----  ${product.thumbnail}`,
        } 
        let mailConfig = {
            service: 'gmail',
            auth: {
                user: 'chung.vu@hdwebsoft.co',
                pass: 'vuvanchung123'
            }
        } 
        nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err: Error, res: Response) => {
            if (err) {
                reject(err) 
            } else {
                resolve(res) 
            }
        }) 
    }) 
}

const deleteID = async (id: String) => {
    const data = await client.getAsync(id)
    if (data) {
        client.del(id)
        return "completely deleted"
    } else {
        return "nothing to delete"
    }    
}



(async function () {
    await agenda.start()    
})()
