import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/middleware/verifyToken'
import { generatePassword } from '@/utils/helper'

export async function GET(request) {
    const token = await verifyToken(request)
    if (token.status === 401) return token

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '3')
    const username = searchParams.get('username')
    const sortBy = searchParams.get('sortBy') || 'id'
    const sortMode = searchParams.get('sortMode') === 'asc' ? 'asc' : 'desc'

    const where = username
        ? { username: { contains: username, mode: 'insensitive' } }
        : {}

    const total = await prisma.user.count({ where })
    const pages = Math.ceil(total / limit)
    const users = await prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortMode },
        include: { todos: true }
    })

    return Response.json({ data: users, page, pages })
}

export async function POST(request) {
    const token = await verifyToken(request)
    if (token.status === 401) return token

    try {
        const { username, password } = await request.json()
        const user = await prisma.user.create({
            data: { username, password: generatePassword(password) }
        })
        return Response.json(user, { status: 201 })
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }
}
