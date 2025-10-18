import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

import { AppSidebar } from "@/shared/components/sidebar/app-sidebar"
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const user = await auth.api.getSession({
		headers: await headers(),
	})

	if (!user) {
		return redirect("/login")
	}

	return (
		<SidebarProvider>
			<AppSidebar user={{ name: user.user.name, email: user.user.email }} />

			<main className="flex-1">
				<SidebarTrigger />

				<div className="mx-auto p-8">{children}</div>
			</main>
		</SidebarProvider>
	)
}
