import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar"
import { AppSidebar } from "@/shared/components/sidebar/app-sidebar"

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
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

			<main className="flex-1">
				<SidebarTrigger />

				<div className="mx-auto p-8">{children}</div>
			</main>
		</SidebarProvider>
	)
}
