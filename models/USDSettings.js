import mongoose, { Schema } from 'mongoose';

const variantSchema = mongoose.Schema({

    value: {
        type: Number,
        required: true,
        trim: true
    },
    enabled: {
        type: Boolean, 
        required: true,
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

const USDSettings = mongoose.model('USDSettings', variantSchema)
export default USDSettings