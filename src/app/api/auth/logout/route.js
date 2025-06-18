import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const { username } = await req.json()

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) throw new Error('User not found')

        await prisma.user.update({
            where: { id: user.id },
            data: { token: null },
        })

        const res = NextResponse.json({ success: true })
        res.cookies.delete('refreshToken')

        return res
    } catch (e) {
        return NextResponse.json({ message: e.message }, { status: 401 })
    }
}
