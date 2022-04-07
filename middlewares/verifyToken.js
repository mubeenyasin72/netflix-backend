const jwt = require('jsonwebtoken')
const ErrorHandler = require('../utils/ErrorHandler')

function verify(req, res, next) {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
            if (err) return next(new ErrorHandler("Token is not valid!", 500))
            req.user = user;
            next();
        });
    } else {
        return next(new ErrorHandler("You are not authenticated!", 500))
    }
}
module.exports = verify;