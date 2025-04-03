import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String, 
        required: true
    },
    subcategory: {
        type: String, 
        required: false
    },
    price: {
        type: Number, 
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    discount: {
        type: Boolean,
        required: false,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    forSale: {
        type: Boolean,
        default: true,
        required: false
    },
    str_variant: {
        type: String,
        required: false
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

const Admin = mongoose.model('Product', productSchema)
export default Admin