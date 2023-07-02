import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    console.log('hitting middleware')
    const token = req.cookies.get('token')?.value

    if (token) {
        return NextResponse.redirect(new URL('/', req.url))
    }
}

export const config = {
    matcher: ['/login', '/signup'],
}
