import mongoose, { Schema } from 'mongoose';

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    enabled: {
        type: String,
        required: true,
        default: true
    },
    slug: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Category = mongoose.model('Category', categorySchema)
export default Category