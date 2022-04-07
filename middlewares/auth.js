const ErrorHander = require("../utils/ErrorHandler");
const cathAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

exports.isAuthenticatedUser = cathAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (token === "j:null") {
        return next(new ErrorHander("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = await User.findById(decodedData.id);

    next();
});

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(500).json({
                success: false,
                message: `Role: ${req.user.role} is not allowed to access this resouce `
            })
        }
        next();
    };
};