import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/middleware/verifyToken'

export async function GET(request) {
    const token = await verifyToken(request)
    if (token.status === 401) return token

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const title = searchParams.get('title')
    const complete = searchParams.get('complete')
    const sortBy = searchParams.get('sortBy') || 'id'
    const sortMode = searchParams.get('sortMode') === 'asc' ? 'asc' : 'desc'

    const filters = {
        executorId: token.userId,
    }

    if (title) {
        filters.title = {
            contains: title,
            mode: 'insensitive',
        }
    }

    if (complete !== null && complete !== undefined) {
        filters.complete = complete === 'true'
    }

    const total = await prisma.todo.count({ where: filters })
    const pages = Math.ceil(total / limit)

    const todos = await prisma.todo.findMany({
        where: filters,
        include: { executor: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortMode },
    })

    return Response.json({ data: todos, page, pages })
}

export async function POST(request) {
    const token = await verifyToken(request)
    if (token.status === 401) return token

    try {
        const { title } = await request.json()

        const todo = await prisma.todo.create({
            data: {
                title,
                executor: {
                    connect: { id: token.userId },
                },
            },
        })

        return Response.json(todo, { status: 201 })
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }
}
