import mongoose, { Schema } from 'mongoose';

const shippingSchema = mongoose.Schema({

    seller: {
        type: Schema.ObjectId, ref: 'Admin',
        required: true
    },
    toAddress: {
        type: Number,
        required: true,
        trim: true
    },
    toShipperBranch: {
        type: Number, 
        required: true,
        trim: true
    },
    toBranch : {
        type: String, 
        required: false,
        default: 'Permitido'
    },
    freeShippingAmount : {
        type: Number, 
        required: false,
        default: 0
    },
    shippingCompany: {
        type: String,
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

const Shipping = mongoose.model('Shipping', shippingSchema)
export default Shipping