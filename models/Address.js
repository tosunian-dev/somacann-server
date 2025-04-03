import mongoose, { Schema } from 'mongoose';

const addressSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    dni: {
        type: Number,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: false,
        trim: true,
        default: 'Argentina'
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    province: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    floor: {
        type: String,
        required: false,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    client: {
        type: Schema.ObjectId, ref: 'ClientUser',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

const Address = mongoose.model('Address', addressSchema)
export default Address