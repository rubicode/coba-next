import { prisma } from '@/lib/prisma'
import { checkPassword, generateAccessToken, generateRefreshToken } from '@/utils/helper'
import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const { username, password } = await req.json()

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) throw new Error('Username not found')

        const isMatch = await checkPassword(password, user.password)
        if (!isMatch) throw new Error('Incorrect password')

        const accessToken = generateAccessToken({ userId: user.id })
        const refreshToken = generateRefreshToken({ userId: user.id })

        await prisma.user.update({
            where: { id: user.id },
            data: { token: refreshToken },
        })

        const res = NextResponse.json({ username: user.username, accessToken })
        res.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res
    } catch (e) {
        return NextResponse.json({ message: e.message }, { status: 401 })
    }
}
