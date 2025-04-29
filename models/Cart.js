import mongoose, { Schema } from 'mongoose';

const cartSchema = mongoose.Schema({
    amountOfProducts: {
        type: Number,
        required: true
    },
    client: {
        type: String,
        required: true,
    },
    product: {
        type: Schema.ObjectId, ref: 'Product',
        required: true,
    },
    variant: {
        type: Schema.ObjectId, ref: 'Variant',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart