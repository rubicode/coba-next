import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/middleware/verifyToken'

export async function GET(request, { params }) {
  const token = await verifyToken(request)
  if (token.status === 401) return token

  const { id } = params
  const user = await prisma.user.findUnique({ where: { id } })
  return Response.json(user)
}

export async function PUT(request, { params }) {
  const token = await verifyToken(request)
  if (token.status === 401) return token

  const { id } = params
  const body = await request.json()

  try {
    const user = await prisma.user.update({
      where: { id },
      data: body
    })
    return Response.json(user, { status: 200 })
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const token = await verifyToken(request)
  if (token.status === 401) return token

  const { id } = params
  try {
    const user = await prisma.user.delete({ where: { id } })
    return Response.json(user)
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}
