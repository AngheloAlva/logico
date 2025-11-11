import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

import { AppSidebar } from "@/shared/components/sidebar/app-sidebar"
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import AppHeader from "@/shared/components/sidebar/app-header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
		return redirect("/login")
	}

	const user = session.user
	const userRole = user.role

	return (
		<SidebarProvider>
			<AppSidebar
				user={{
					name: user.name,
					email: user.email,
					role: userRole,
				}}
			/>

			<main className="flex-1 overflow-hidden">
				<AppHeader />

				<div className="p-6 xl:px-8">{children}</div>
			</main>
		</SidebarProvider>
	)
}
