import jwt from 'jsonwebtoken';
import User from '../models/User';

export const authenticate = async (req, res) => {
    const token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json({
            message: "Unauthorized - No Token"
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).populate('roleId');
    if(!user || !user.isActive) {
        return res.status(401).json({
            message: "Unauthorized - Invalid token"
        });
    }
}

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        const roleName = req.user?.roleId.name;
        if(!roles.includes(roleName)) {
            return res.status(403).json({
                message: "Forbidden - Permission denied"
            });
        }
        next();
    }
}