import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10;
const secretKey = 'rubicamp';


export const generatePassword = (password) => bcrypt.hashSync(password, saltRounds)

export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash)

export const generateAccessToken = (data) => jwt.sign(data, secretKey, { expiresIn: '15m' })

export const generateRefreshToken = (data) => jwt.sign(data, secretKey, { expiresIn: '7d' })

export const decodeToken = (token) => jwt.verify(token, secretKey)

export const verifyToken = async function (req, res, next) {
    try {
        const token = req.get('Authorization')?.slice(7)
        const decoded = decodeToken(token)
        req.userId = decoded.userId
        next()
    } catch (error) {
        res.status(401).json({ message: "token invalid" })
    }
}