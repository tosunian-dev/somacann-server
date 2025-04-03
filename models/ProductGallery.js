import mongoose, { Schema } from 'mongoose';

const gallerySchema = mongoose.Schema({

    product: {
        type: Schema.ObjectId, ref: 'Product',
        required: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

const Gallery = mongoose.model('Gallery', gallerySchema)
export default Gallery