const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({ name: String, max_quantity: Number, thumbnail: String })
const VoucherSchema = new mongoose.Schema({ name: String, quantity: Number })



export const ProductModel = mongoose.model("productdbs", ProductSchema)
export const VoucherModel = mongoose.model("voucherdbs", VoucherSchema)