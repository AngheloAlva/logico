import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { hasAccessToRoute, getHomeRouteByRole } from "@/lib/permissions"

interface RouteGuardProps {
	readonly children: React.ReactNode
	readonly requiredPath: string
}

/**
 * Componente para proteger rutas según el rol del usuario
 * Uso: Envolver el contenido de una página con este componente
 */
export async function RouteGuard({ children, requiredPath }: Readonly<RouteGuardProps>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	// Si no hay sesión, redirigir a login
	if (!session) {
		return redirect("/login")
	}

	const userRole = session.user.role

	// Verificar si el usuario tiene acceso a esta ruta
	const hasAccess = hasAccessToRoute(userRole, requiredPath)

	if (!hasAccess) {
		// Redirigir a la ruta de inicio según el rol
		const homeRoute = getHomeRouteByRole(userRole)
		return redirect(homeRoute)
	}

	return <>{children}</>
}
