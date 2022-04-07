const router = require('express').Router()
const { ListMovie, Validate } = require('../models/ListModel')
const CatchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')
const verify = require('../middlewares/verifyToken')

//CREATE

router.post("/", verify, CatchAsyncError(async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new ListMovie(req.body);
        const savedList = await newList.save();
        res.status(200).json({
            success: true,
            message: "List created Successfully...",
            savedList
        })
    } else {
        return next(new ErrorHandler("You are not allowed!", 500))
    }
}));

//DELETE

router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        await ListMovie.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "The list has been delete..."
        })
    } else {
        return next(new ErrorHandler("You are not allowed!", 500))
    }
});

//Get

router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    if (typeQuery) {
        if (genreQuery) {
            list = await ListMovie.aggregate([
                { $sample: { size: 10 } },
                { $match: { type: typeQuery, genre: genreQuery } },
            ]);
        } else {
            list = await ListMovie.aggregate([
                { $sample: { size: 10 } },
                { $match: { type: typeQuery } },
            ]);
        }
    } else {
        list = await ListMovie.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json({
        success: true,
        message: "The list loaded successfully...",
        list
    })
});





module.exports = router;