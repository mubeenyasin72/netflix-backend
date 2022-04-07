const mongoose = require('mongoose')
const Joi = require('joi')

const MoviesSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    imgSm: { type: String },
    trailer: { type: String },
    video: { type: String },
    year: { type: String },
    limit: { type: Number },
    genre: { type: String },
    isSeries: { type: Boolean, default: false }
}, { timestamps: true })


const Movies = mongoose.model('Movie', MoviesSchema)

function validateMovies(movie) {
    const schema = {
        title: Joi.string().required().unique(),
        desc: Joi.string(),
        img: Joi.string(),
        imgTitle: Joi.string(),
        imgSm: Joi.string(),
        trailer: Joi.string(),
        video: Joi.string(),
        year: Joi.string(),
        limit: Joi.string(),
        genre: Joi.string(),
    }
    return Joi.validate(movie, schema)
}
exports.Movies = Movies;
exports.Validate = validateMovies;