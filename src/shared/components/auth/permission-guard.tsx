"use client"

import { hasPermission, ROLE_PERMISSIONS } from "@/lib/permissions"

interface PermissionGuardProps {
	readonly children: React.ReactNode
	readonly userRole: string | null | undefined
	readonly permission: keyof (typeof ROLE_PERMISSIONS)["admin"]
	readonly fallback?: React.ReactNode
}

/**
 * Componente para mostrar contenido condicionalmente según permisos
 * Uso: Envolver botones, acciones o secciones que requieren permisos específicos
 */
export function PermissionGuard({
	children,
	userRole,
	permission,
	fallback = null,
}: Readonly<PermissionGuardProps>) {
	const hasRequiredPermission = hasPermission(userRole, permission)

	if (!hasRequiredPermission) {
		return <>{fallback}</>
	}

	return <>{children}</>
}
