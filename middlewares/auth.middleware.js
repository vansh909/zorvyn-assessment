const jwt = require('jsonwebtoken');

//middleware to protect routes
exports.authMiddleware = async(req, res, next)=>{
    const token = req.cookies.token;
    try {
        
    
    if(!token){
        return res.status(401).json({message: "Invalid token"});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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



