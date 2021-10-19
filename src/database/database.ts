const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://chung:1234@cluster0.plitd.mongodb.net/voucherdb?retryWrites=true&w=majority")
    .then(() => console.log("Connected successfully"))
    .catch(() => console.log("Error connecting"))

