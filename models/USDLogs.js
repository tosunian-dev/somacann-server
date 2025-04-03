import mongoose, { Schema } from 'mongoose';

const variantSchema = mongoose.Schema({

    value: {
        type: Number,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },


})

const USDLogs = mongoose.model('USDLogs', variantSchema)
export default USDLogs