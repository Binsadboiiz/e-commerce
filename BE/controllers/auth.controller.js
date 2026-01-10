import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';

export const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).populate('role');
    if(!user) {
        return res.status(400).json({message: "Invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({message: "Invalid credentials"});
    }
    const token = signToken({userId: user._id, role: user.roleId.name});

    res.coookie("access_token", token), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000
    };

    res.json({ message: "Login successfull", role: user.roleId.name});
}

export const logout = (req, res) => {
    res.clearCookie("access_token");
    res.json({ message: "Logout successful" });
}