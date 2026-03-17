const jwt = require('jsonwebtoken')

const userMiddleware = async (req,res,next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return req.status(401).json({
                message:"Authentication token missing"
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next()
    }
    catch(error) {
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }

}

module.exports = userMiddleware