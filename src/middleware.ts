import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request)
	
	// Si no hay sesión, redirigir a login
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url))
	}

	// La verificación de permisos por rol se hace en el layout del dashboard
	return NextResponse.next()
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/movimientos/:path*",
		"/farmacias/:path*",
		"/motoristas/:path*",
		"/motos/:path*",
		"/regiones/:path*",
		"/usuarios/:path*",
		"/reportes/:path*",
	],
}
