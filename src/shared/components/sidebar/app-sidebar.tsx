"use client"

import { usePathname, useRouter } from "next/navigation"
import {
	Users,
	MapPin,
	LogOut,
	Package,
	FileText,
	Hospital,
	TruckIcon,
	Motorbike,
	SquareUser,
	LayoutDashboard,
} from "lucide-react"

import { hasAccessToRoute } from "@/lib/permissions"
import { authClient } from "@/lib/auth-client"

import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent } from "../ui/sidebar"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { NavMain } from "./nav-main"

const menuItems = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Movimientos",
		href: "/movimientos",
		icon: Package,
	},
	{
		title: "Farmacias",
		href: "/farmacias",
		icon: Hospital,
	},
	{
		title: "Motoristas",
		href: "/motoristas",
		icon: SquareUser,
	},
	{
		title: "Motos",
		href: "/motos",
		icon: Motorbike,
	},
	{
		title: "Regiones",
		href: "/regiones",
		icon: MapPin,
	},
	{
		title: "Usuarios",
		href: "/usuarios",
		icon: Users,
	},
	{
		title: "Reportes",
		href: "/reportes",
		icon: FileText,
	},
]

export function AppSidebar({
	user,
}: Readonly<{ user: { name: string; email: string; role?: string | null } }>) {
	const pathname = usePathname()
	const router = useRouter()

	const filteredMenuItems = menuItems.filter((item) => hasAccessToRoute(user.role, item.href))

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login")
				},
			},
		})
	}

	return (
		<Sidebar variant="floating">
			<SidebarHeader className="flex flex-row items-center gap-2">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
					<TruckIcon className="h-7 w-7 text-white" />
				</div>
				<span className="text-lg font-bold">LogiCo</span>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={filteredMenuItems} pathname={pathname} />
			</SidebarContent>

			<SidebarFooter className="p-2">
				<div className="bg-accent flex flex-row items-center gap-2 rounded-lg p-2">
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarFallback className="rounded-lg">
							{user.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{user.name}</span>
						<span className="truncate text-xs">{user.email}</span>
					</div>

					<Button variant="ghost" onClick={handleLogout}>
						<LogOut />
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
