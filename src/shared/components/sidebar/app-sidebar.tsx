"use client"

import { usePathname, useRouter } from "next/navigation"
import {
	Bike,
	Truck,
	Users,
	MapPin,
	LogOut,
	Package,
	FileText,
	TruckIcon,
	Building2,
	LayoutDashboard,
} from "lucide-react"

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
		icon: Building2,
	},
	{
		title: "Motoristas",
		href: "/motoristas",
		icon: Truck,
	},
	{
		title: "Motos",
		href: "/motos",
		icon: Bike,
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

export function AppSidebar({ user }: { user: { name: string; email: string } }) {
	const pathname = usePathname()
	const router = useRouter()

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
		<Sidebar>
			<SidebarHeader>
				<TruckIcon />
				<span>LogiCo</span>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={menuItems} pathname={pathname} />
			</SidebarContent>

			<SidebarFooter>
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
			</SidebarFooter>
		</Sidebar>
	)
}
