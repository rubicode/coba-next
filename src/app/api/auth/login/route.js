import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/utils/helper'
import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const { username, password } = await req.json()

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) throw new Error('Username not found')

        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) throw new Error('Incorrect password')

        const token = generateToken({ userId: user.id })

        await prisma.user.update({
            where: { id: user.id },
            data: { token },
        })

        const res = NextResponse.json({ username: user.username })
        res.cookies.set('token', token, {
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
