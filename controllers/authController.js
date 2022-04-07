const router = require('express').Router()
const { User, Validate } = require('../models/UserModel')
const CatchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
//Register Route
router.post('/register', CatchAsyncError(async (req, res, next) => {
    const { error } = Validate(req.body);
    if (error) {
        return next(new ErrorHandler(error.details[0].message, 500))
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new ErrorHandler("User Already Exist...", 500))

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PRIVATE_KEY
        ).toString(),
    })
    const users = await newUser.save()
    res.status(200).json({
        success: true,
        message: "User Successfully Created",
        users
    })
}))

//Login Route
router.post('/login', CatchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("Wrong Password or username", 500))
    }
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.PRIVATE_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
        return next(new ErrorHandler("Wrong Password or username", 500))
    }

    const accessToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.PRIVATE_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
    );
    const { password, ...info } = user._doc;
    res.status(200).json({
        success: true,
        message: "Login Successfully",
        info,
        accessToken
    })
}))



module.exports = router;