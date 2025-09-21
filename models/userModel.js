const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    profilePicture: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    }
}, {timestamps: true});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
