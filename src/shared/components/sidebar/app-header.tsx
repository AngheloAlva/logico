"use client"

import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { Separator } from "@/shared/components/ui/separator"
import { usePathname } from "next/navigation"

export default function AppHeader(): React.ReactElement {
	const pathname = usePathname()

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

			<Breadcrumb>
				<BreadcrumbList>
					{pathname.split("/").map((item, index) => (
						<div key={index} className="flex items-center gap-2">
							<BreadcrumbItem key={index} className="capitalize">
								<BreadcrumbLink>{item.replaceAll("-", " ")}</BreadcrumbLink>
							</BreadcrumbItem>

							{index < pathname.split("/").length - 1 && index !== 0 && (
								<BreadcrumbSeparator className="hidden md:block" />
							)}
						</div>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	)
}
