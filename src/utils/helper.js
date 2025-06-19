import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10;
const secretKey = 'rubicamp';


export const generatePassword = (password) => bcrypt.hashSync(password, saltRounds)

export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash)

export const generateToken = (data) => jwt.sign(data, secretKey)

export const decodeToken = (token) => jwt.verify(token, secretKey)

export const verifyToken = async function () {
    try {
        const cookieStore = await cookies();
        const token = await cookieStore.get('token')?.value;

        if (!token) throw new Error('No access token found')

        const payload = decodeToken(token)

        return payload
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 401 })
    }

}