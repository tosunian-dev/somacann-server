import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: false,
        trim: true
    },
    companyName: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
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
        default: false
    },
    userType: {
        type: String,
        required: true
    }

})

const Admin = mongoose.model('Admin', adminSchema)
export default Admin