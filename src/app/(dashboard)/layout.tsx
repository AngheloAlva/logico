import { Sidebar } from "@/shared/components/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-background flex h-screen overflow-hidden">
			<Sidebar />
			<main className="flex-1 overflow-y-auto">
				<div className="container mx-auto p-6">{children}</div>
			</main>
		</div>
	)
}
