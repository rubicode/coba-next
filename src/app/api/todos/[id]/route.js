import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/utils/helper'


export async function GET(request, { params }) {
    const result = await verifyToken(request)
    if (result.status === 401) return result

    const todo = await prisma.todo.findUnique({
        where: { id: params.id },
    })

    return Response.json(todo)
}

export async function PUT(request, { params }) {
    const result = await verifyToken(request)
    if (result.status === 401) return result

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
    const result = await verifyToken(request)
    if (result.status === 401) return result

    try {
        const todo = await prisma.todo.delete({
            where: { id: params.id },
        })

        return Response.json(todo)
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 })
    }
}
