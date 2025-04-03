import mongoose, { Schema } from 'mongoose';

const variantSchema = mongoose.Schema({

    product: {
        type: Schema.ObjectId, ref: 'Product',
        required: true
    },
    provider: {
        type: String,
        required: true,
        trim: true
    },
    variant: {
        type: String, 
        required: true,
        trim: true
    },
    skuCode : {
        type: String, 
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: false
    }

})

const Variant = mongoose.model('Variant', variantSchema)
export default Variant