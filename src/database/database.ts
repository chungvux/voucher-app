const mongoose = require('mongoose')

import { Job } from "agenda"
const Agenda = require('agenda')

const addressDatabase = "mongodb+srv://chung:1234@cluster0.plitd.mongodb.net/voucherdb?retryWrites=true&w=majority"

const agenda = new Agenda({
    db: {
        address: addressDatabase,
        collection: 'checkdatabase'
    }
})

agenda.define('checkdatabase', (job: Job, done: Function) => {
    console.log('Check database successfully')
    done()
})

agenda.start()

mongoose.connect(addressDatabase)
    .then(() => {
        console.log("Connected successfully")
        agenda.on('ready', () => {
            agenda.every('1 minute', 'checkdatabase')
        })
    })
    .catch(() => console.log("Error connecting"))

