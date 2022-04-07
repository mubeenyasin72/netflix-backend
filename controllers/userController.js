const router = require('express').Router()
const { User, Validate } = require('../models/UserModel')
const CatchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')
const verify = require('../middlewares/verifyToken')
const CryptoJS = require('crypto-js')

//Update User

router.put('/:id', verify, CatchAsyncError(async (req, res, next) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PRIVATE_KEY
            ).toString()
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json({
            success: true,
            message: "user updated successfully...",
            updatedUser
        })
    } else {
        return next(new ErrorHandler("you can update only your account!", 500))
    }
}))

//Delete User
router.delete('/:id', verify, CatchAsyncError(async (req, res, next) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {

        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return next(new ErrorHandler("User Not Exsit!", 500))
        }
        res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
        })

    } else {
        return next(new ErrorHandler("You can Delete only your account!", 500))
    }
}))

//Get All User
router.get('/', verify, CatchAsyncError(async (req, res, next) => {
    const query = req.query.new;
    if (req.user.isAdmin) {
        const users = query ? await User.find().sort({ _id: -1 }) : await User.find()
        res.status(200).json({
            success: true,
            message: "User Loaded Successfully...",
            users
        })
    } else {
        return next(new ErrorHandler("you are not allow to access!", 500))
    }
}))

//Get Single User
router.get('/find/:id', verify, CatchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id)
    if (!user) return next(new ErrorHandler("Your account not exist!", 500))

    const { password, ...info } = user._doc
    res.status(200).json({
        success: true,
        message: "User Loaded Successfully...",
        info
    })
}))

// Get User Stat
router.get('/stats', verify, CatchAsyncError(async (req, res, next) => {
    const today = new Date()
    const lastyear = today.setFullYear(today.setFullYear() - 1)
    const monthArray = []
    const data = await User.aggregate([
        {
            $project: {
                month: { $month: "$createdAt" },
            },
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: 1 },
            },
        },
    ])
    res.status(200).json({
        success: true,
        message: "User Stats Loaded Successfully...",
        data
    })
}))

module.exports = router;
