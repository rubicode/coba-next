import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/utils/helper'

export async function POST(req) {
    try {

        const result = await verifyToken()
        if (result.status === 401) return result

        const user = await prisma.user.findUnique({ where: { id: result.userId } })
        if (!user) throw new Error('User not found')

        await prisma.user.update({
            where: { id: user.id },
            data: { token: null },
        })

        const res = NextResponse.json({ success: true })
        res.cookies.delete('token')

        return res
    } catch (e) {
        return NextResponse.json({ message: e.message }, { status: 401 })
    }
}
