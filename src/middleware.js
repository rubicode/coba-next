import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token');

    const isProtected = request.nextUrl.pathname.startsWith('/todos');

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/todos/:path*'],
};
