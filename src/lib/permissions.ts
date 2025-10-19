export type UserRole = "admin" | "operadora" | "supervisor" | "gerente"

export interface RoutePermission {
	path: string
	allowedRoles: UserRole[]
	label: string
	icon?: string
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
	{
		path: "/dashboard",
		allowedRoles: ["admin", "operadora", "supervisor", "gerente"],
		label: "Dashboard",
	},
	{
		path: "/movimientos",
		allowedRoles: ["admin", "operadora", "supervisor", "gerente"],
		label: "Movimientos",
	},
	{
		path: "/farmacias",
		allowedRoles: ["admin", "supervisor"],
		label: "Farmacias",
	},
	{
		path: "/motoristas",
		allowedRoles: ["admin", "supervisor"],
		label: "Motoristas",
	},
	{
		path: "/motos",
		allowedRoles: ["admin", "supervisor"],
		label: "Motos",
	},
	{
		path: "/regiones",
		allowedRoles: ["admin", "supervisor"],
		label: "Regiones",
	},
	{
		path: "/usuarios",
		allowedRoles: ["admin"],
		label: "Usuarios",
	},
	{
		path: "/reportes",
		allowedRoles: ["admin", "supervisor", "gerente"],
		label: "Reportes",
	},
]

export function hasAccessToRoute(userRole: string | null | undefined, path: string): boolean {
	if (!userRole) return false

	if (userRole === "admin") return true

	const route = ROUTE_PERMISSIONS.find((r) => path.startsWith(r.path))

	if (!route) {
		return userRole === "admin"
	}

	return route.allowedRoles.includes(userRole as UserRole)
}

export function getAllowedRoutes(userRole: string | null | undefined): RoutePermission[] {
	if (!userRole) return []

	if (userRole === "admin") return ROUTE_PERMISSIONS

	return ROUTE_PERMISSIONS.filter((route) => route.allowedRoles.includes(userRole as UserRole))
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
	admin: "Acceso completo a todas las funcionalidades del sistema",
	operadora: "Gestión de movimientos, incidencias y visualización de información operativa",
	supervisor: "Gestión de farmacias, motoristas, motos, regiones y aprobación de operaciones",
	gerente: "Visualización de reportes, estadísticas y dashboard ejecutivo",
}

export const ROLE_PERMISSIONS = {
	admin: {
		canManageUsers: true,
		canManagePharmacies: true,
		canManageDrivers: true,
		canManageMotorbikes: true,
		canManageMovements: true,
		canManageIncidents: true,
		canManageRegions: true,
		canViewReports: true,
		canExportData: true,
		canDeleteRecords: true,
		canApproveOperations: true,
	},
	operadora: {
		canManageUsers: false,
		canManagePharmacies: false,
		canManageDrivers: false,
		canManageMotorbikes: false,
		canManageMovements: true,
		canManageIncidents: true,
		canManageRegions: false,
		canViewReports: false,
		canExportData: false,
		canDeleteRecords: false,
		canApproveOperations: false,
	},
	supervisor: {
		canManageUsers: false,
		canManagePharmacies: true,
		canManageDrivers: true,
		canManageMotorbikes: true,
		canManageMovements: true,
		canManageIncidents: true,
		canManageRegions: true,
		canViewReports: true,
		canExportData: true,
		canDeleteRecords: true,
		canApproveOperations: true,
	},
	gerente: {
		canManageUsers: false,
		canManagePharmacies: false,
		canManageDrivers: false,
		canManageMotorbikes: false,
		canManageMovements: false,
		canManageIncidents: false,
		canManageRegions: false,
		canViewReports: true,
		canExportData: true,
		canDeleteRecords: false,
		canApproveOperations: false,
	},
}

export function hasPermission(
	userRole: string | null | undefined,
	permission: keyof (typeof ROLE_PERMISSIONS)["admin"]
): boolean {
	if (!userRole) return false
	if (userRole === "admin") return true

	const rolePermissions = ROLE_PERMISSIONS[userRole as UserRole]
	if (!rolePermissions) return false

	return rolePermissions[permission]
}

export function getHomeRouteByRole(userRole: string | null | undefined): string {
	if (!userRole) return "/login"

	switch (userRole) {
		case "admin":
		case "supervisor":
			return "/dashboard"
		case "operadora":
			return "/movimientos"
		case "gerente":
			return "/reportes"
		default:
			return "/dashboard"
	}
}
