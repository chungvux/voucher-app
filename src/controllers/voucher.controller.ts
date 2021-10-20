import { Request, ResponseToolkit } from "@hapi/hapi"
import { Job } from "agenda"
import { VoucherModel, ProductModel } from '../models/Model'
import Queue = require("bull");
const nodemailer = require('nodemailer')
const Agenda = require('agenda')


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

const sendMailQueue = new Queue('sendMail', client)

let agenda = new Agenda()
agenda.database("mongodb+srv://chung:1234@cluster0.plitd.mongodb.net/voucherdb?retryWrites=true&w=majority", "agendaJobs");

export const addVoucher = async (req: Request, res: ResponseToolkit) => {
    const sessionProduct = await ProductModel.startSession()
    sessionProduct.startTransaction()
    const idProduct = req.params.id    

    const options = {
        delay: 60000, // 60 seconds in ms
        attempts: 1
    }

    try {
        const optProduct = { sessionProduct }
        const product = await ProductModel.findById(idProduct, null, optProduct)
        if (product) {
            const max_quantity = Number(product.max_quantity)
            const quantity = Number(req.params.quantity)
            if (max_quantity > quantity) {
                const sessionVoucher = await VoucherModel.startSession()
                sessionVoucher.startTransaction()
                const optVoucher = { sessionVoucher }

                
                const email = req.params.email

                
                await sendMailQueue.add(sendMail(email), { delay: 60000 })
                const dateTime = new Date().toISOString()
                const left_quantity: Number = max_quantity - quantity

                const voucher = await new VoucherModel(req.payload).save(optVoucher)
                const product = await ProductModel.findByIdAndUpdate(idProduct, { max_quantity: left_quantity })
                // await sendMail(email)
                sendMailQueue.process((job: Queue.Job, done: Queue.DoneCallback) => {
                    job.progress(42)
                    done()
                    done(Error('error transcoding'))
                })

                

                await sessionVoucher.commitTransaction()
                sessionVoucher.endSession()

                return res.response({ voucher, product, dateTime})
            } else {
                await sessionProduct.abortTransaction()
                sessionProduct.endSession()

                return res.response("Not enough item")
            }
        } else {
            await sessionProduct.abortTransaction()
            sessionProduct.endSession()

            return res.response("have no item")
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
        return res.response(req)
    } catch (error) {
        console.log(error)
    }
}
export const getOneVoucher = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await VoucherModel.findById(req.params.id)
        return res.response(user)
    } catch (error) {
        console.log(error)
    }
}
export const updateVoucher = async (req: Request, res: ResponseToolkit) => {
    try {
        const user = await VoucherModel.findByIdAndUpdate(req.params.id, req.payload)
        return res.response(user)
    } catch (error) {
        console.log(error)
    }
}

export const tempIDVoucher = async (req: Request, res: ResponseToolkit) => {
    const product = await client.getAsync(req.params.id);
    if (product) {
        return res.response("Other people is oddering, please wait...")
    } else {
        await client.setAsync(req.params.id, req.params.id)

        agenda.define('deleteID', (job: Job, done: Function) => {
            deleteID(req.params.id)
            done()
        })
            

        return await client.getAsync(req.params.id)
    }
}


let sendMail = (email: String) => {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: 'chung.vu@hdwebsoft.co',
            to: email,
            subject: 'Bull - npm',
            text: "This email is from Chung and bull job scheduler tutorial.",
        };
        let mailConfig = {
            service: 'gmail',
            auth: {
                user: 'chung.vu@hdwebsoft.co',
                pass: 'vuvanchung123'
            }
        };
        nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err: Error, res: Response) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
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
    await agenda.every('1 minute', 'deleteID')
})()
