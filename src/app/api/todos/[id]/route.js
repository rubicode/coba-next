import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/middleware/verifyToken'

export async function GET(request, { params }) {
    const token = await verifyToken(request)
    if (token.status === 401) return token

    const todo = await prisma.todo.findUnique({
        where: { id: params.id },
    })

    return Response.json(todo)
}

export async function PUT(request, { params }) {
    const token = await verifyToken(request)
    if (token.status === 401) return token

    try {
        const body = await request.json()
        const todo = await prisma.todo.update({
            where: { id: params.id },
            data: body,
        })

        return Response.json(todo, { status: 201 })
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    const token = await verifyToken(request)
    if (token.status === 401) return token

    try {
        const todo = await prisma.todo.delete({
            where: { id: params.id },
        })

        return Response.json(todo)
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }
}
