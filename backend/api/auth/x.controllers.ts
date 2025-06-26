import Users from '../../models/User';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from '../../middleware/passport';

const createToken = (user: any) => {
    return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' })
}
const encryptPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const encryptedPassword = await encryptPassword(req.body.password)
        const user = await Users.create({ ...req.body, password: encryptedPassword })
        const token = createToken(user)
        return res.json({ token, user })
    } catch (error: any) {
        next(error)
    }
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { phoneNumber, password } = req.body
    const user = await Users.findOne({ phoneNumber })
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" })
    }
    const token = createToken(user)
    return res.json({token, user})
    } catch (error: any) {
        next(error)
    }
}

