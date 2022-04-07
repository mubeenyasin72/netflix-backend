const router = require("express").Router();
const CatchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')
const verify = require('../middlewares/verifyToken')
const { Movies, Validate } = require('../models/MoviesModel')
//CREATE

router.post("/", verify, CatchAsyncError(async (req, res, next) => {
    if (req.user.isAdmin) {
        const newMovie = new Movies(req.body);
        const savedMovie = await newMovie.save();
        res.status(200).json({
            success: true,
            message: "Movie Created Successfully...",
            savedMovie
        })
    } else {
        return next(new ErrorHandler("You are not allowed!", 500))
    }
}));

//UPDATE

router.put("/:id", verify, CatchAsyncError(async (req, res, next) => {
    if (req.user.isAdmin) {
        const updatedMovie = await Movies.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Movie updated Successfully...",
            updatedMovie
        })
    } else {
        return next(new ErrorHandler("You are not allowed!", 500))
    }
}));

//DELETE

router.delete("/:id", verify, CatchAsyncError(async (req, res, next) => {
    if (req.user.isAdmin) {
        await Movies.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Movie Deleted Successfully..."
        })
    } else {
        return next(new ErrorHandler("You are not allowed!", 500))
    }
}));

//GET

router.get("/find/:id", verify, CatchAsyncError(async (req, res, next) => {
    const movie = await Movies.findById(req.params.id);
    res.status(200).json({
        success: true,
        message: "Movie Loaded Successfully...",
        movie
    })

}));

//GET RANDOM

router.get("/random", verify, CatchAsyncError(async (req, res, next) => {
    const type = req.query.type;
    let movie;
    if (type === "series") {
        movie = await Movies.aggregate([
            { $match: { isSeries: true } },
            { $sample: { size: 1 } },
        ]);
    } else {
        movie = await Movies.aggregate([
            { $match: { isSeries: false } },
            { $sample: { size: 1 } },
        ]);
    }
    res.status(200).json({
        success: true,
        message: "Movie Loaded Successfully...",
        movie
    })

}));

//GET ALL

router.get("/", verify, CatchAsyncError(async (req, res, next) => {
    if (req.user.isAdmin) {

        const movies = await Movies.find();
        res.status(200).json({
            success: true,
            message: "Movies Loaded Successfully...",
            movie: movies.reverse()
        })
    } else {
        return next(new ErrorHandler("You are not allowed!", 500))
    }
}));

module.exports = router;