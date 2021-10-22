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
    mongoose.connect(addressDatabase)
        .then(() => {
            console.log("Connected successfully")
        })
        .catch(() => console.log("Error connecting"))
    done()
})

agenda.start()



agenda.on('ready', () => {
    agenda.every('1 minute', 'checkdatabase')
})