const express = require('express')
const AuthRoute = require('../controllers/authController')
const UserRoute = require('../controllers/userController')
const MoviesRoute = require('../controllers/moviesController')
const ListRoute = require('../controllers/listController')
const error = require('../middlewares/error')


module.exports = function (app) {
    app.use(express.json());
    app.use("/api/v1/auth", AuthRoute)
    app.use("/api/v1/users", UserRoute)
    app.use("/api/v1/movies", MoviesRoute)
    app.use("/api/v1/lists", ListRoute)
    app.use(error)
}