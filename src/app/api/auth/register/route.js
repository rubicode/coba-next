import { prisma } from '@/lib/prisma'
import { generatePassword, generateToken } from '@/utils/helper'
import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const { username, password, rePassword } = await req.json()

        if (password !== rePassword) throw new Error("Password doesn't match")

        const existingUser = await prisma.user.findUnique({ where: { username } })
        if (existingUser) throw new Error('Username already exists')

        const hashed = await generatePassword(password)

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashed,
            },
        })

        const token = generateToken({ userId: newUser.id })

        await prisma.user.update({
            where: { id: newUser.id },
            data: { token },
        })

        const res = NextResponse.json({ username: newUser.username })
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res
    } catch (e) {
        return NextResponse.json({ message: e.message }, { status: 400 })
    }
}
