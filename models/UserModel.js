const mongoose = require('mongoose')
const Joi = require('joi')


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model("User", UserSchema)

function validateUser(user) {
    const schema = {
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        profilePic: Joi.string()
    };

    return Joi.validate(user, schema);
}




exports.User = User;
exports.Validate = validateUser;