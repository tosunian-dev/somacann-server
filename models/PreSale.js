import mongoose, { Schema } from 'mongoose';

const preSaleSchema = mongoose.Schema({
    total: {
        type: Number,
        required: true
    },
    shippingPrice: {
        type: Number,
        required: true
    },
    shipMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: false
    },
    statusStr: {
        type: String,
        required: false,
        default: 'En preparación'
    },
    client: {
        type: Schema.ObjectId, ref: 'Client',
        required: true
    },
    address: {
        type: Schema.ObjectId, ref: 'Address',
        required: true
    },
    transaction: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

const PreSale = mongoose.model('PreSale', preSaleSchema)
export default PreSale