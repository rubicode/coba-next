import { prisma } from '@/lib/prisma'
import { decodeToken, generateAccessToken } from '@/utils/helper'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const cookieStore = cookies()
        const refreshToken = cookieStore.get('refreshToken')?.value

        if (!refreshToken) throw new Error('No refresh token found')

        const decoded = decodeToken(refreshToken)

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
        if (!user || user.token !== refreshToken) throw new Error('Invalid refresh token')

        const accessToken = generateAccessToken({ userId: user.id })

        return NextResponse.json({ accessToken })
    } catch (e) {
        return NextResponse.json({ message: e.message }, { status: 403 })
    }
}
