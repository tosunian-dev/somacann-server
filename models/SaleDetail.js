import mongoose, { Schema } from 'mongoose';

const saleDetailSchema = mongoose.Schema({
    items: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    sale: {
        type: Schema.ObjectId, ref: 'Sale',
        required: true
    },
    client: {
        type: Schema.ObjectId, ref: 'Client',
        required: true
    },
    product: {
        type: Schema.ObjectId, ref: 'Product',
        required: true
    },
    variant: {
        type: Schema.ObjectId, ref: 'Variant',
        required: false
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

})

const SaleDetail = mongoose.model('SaleDetail', saleDetailSchema)
export default SaleDetail