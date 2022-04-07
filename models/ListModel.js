const mongoose = require('mongoose')
const Joi = require('joi')


const ListSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    type: { type: String },
    genre: { type: String },
    content: { type: Array }
}, { timestamps: true })

const ListMovie = mongoose.model('ListMovie', ListSchema)

function validateList(list) {
    const schema = {
        title: Joi.string().required().unique(),
        type: Joi.string(),
        genre: Joi.string(),
        content: Joi.array()
    }
    return Joi.validate(list, schema)
}
exports.ListMovie = ListMovie;
exports.Validate = validateList;