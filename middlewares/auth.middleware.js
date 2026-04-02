const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

exports.authMiddleware = async(req, res, next)=>{
    const token = req.cookies.token;
    try {
        
    
    if(!token){
        return res.status(401).json({message: "Invalid token"});
    }
    const decoded = jwt.verify(token, jwt_secret);
    if(!decoded) return res.status(401).json({message:"Unauthorized"});

    req.user = {
        id: decoded.id,
        role: decoded.role
    }
    next();
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
    
}



