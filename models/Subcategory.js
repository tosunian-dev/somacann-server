import mongoose, { Schema } from 'mongoose';

const subcategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.ObjectId, ref: 'Category',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    categoryName: {
        type: String,
        required: true
    }
})

const Subcategory = mongoose.model('Subcategory', subcategorySchema)
export default Subcategory