const JWT_SECRET  = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(403).json({})
    }

    //const token = authHeader.split(' ')[1];

    try {   
        const decoded = jwt.verify(authHeader, JWT_SECRET);
        if (decoded.user.username) {
            req._id = decoded.user._id;
            next();
        } else {
            return res.status(403).json({})
            } 
        }     
     catch (error) {
        return res.status(403).json({}) 
    }
}

module.exports = {
    authMiddleware
}