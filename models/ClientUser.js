import mongoose from 'mongoose';

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String, 
        required: true
    },
    token: {
        type: String
    },
    enabled: {
        type: Boolean, 
        default: true
    },
    phone: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Client = mongoose.model('Client', clientSchema)
export default Client