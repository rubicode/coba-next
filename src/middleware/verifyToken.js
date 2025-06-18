import { NextResponse } from 'next/server'
import { decodeToken } from '@/utils/helper'

export async function verifyToken(request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) throw new Error('Unauthorized')

        const token = authHeader.replace('Bearer ', '')
        const payload = await decodeToken(token)

        return payload
    } catch (err) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
}
