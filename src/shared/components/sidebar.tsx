"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
	LayoutDashboard,
	Building2,
	Truck,
	Bike,
	Users,
	Package,
	FileText,
	MapPin,
	LogOut,
	TruckIcon,
} from "lucide-react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

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

export function Sidebar() {
	const pathname = usePathname()
	const router = useRouter()

	const handleLogout = async () => {
		await authClient.signOut()
		router.push("/login")
	}

	return (
		<div className="flex h-full w-64 flex-col border-r bg-gradient-to-b from-white to-green-50/30">
			<div className="p-6">
				<Link href="/dashboard" className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-md">
						<TruckIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-xl font-bold text-green-800">LogiCo</h1>
						<p className="text-xs text-green-600">Sistema de Distribución</p>
					</div>
				</Link>
			</div>

			<Separator className="bg-green-200" />

			<ScrollArea className="flex-1 px-3 py-4">
				<nav className="space-y-1">
					{menuItems.map((item) => {
						const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-green-100",
									isActive
										? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:from-green-600 hover:to-green-700 hover:text-white"
										: "text-green-800 hover:text-green-900"
								)}
							>
								<item.icon className="h-5 w-5" />
								{item.title}
							</Link>
						)
					})}
				</nav>
			</ScrollArea>

			<Separator className="bg-green-200" />

			<div className="p-4">
				<Button
					onClick={handleLogout}
					variant="ghost"
					className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
				>
					<LogOut className="h-5 w-5" />
					Cerrar Sesión
				</Button>
			</div>
		</div>
	)
}
