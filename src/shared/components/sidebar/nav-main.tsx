"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

import {
	SidebarMenu,
	SidebarGroup,
	SidebarMenuItem,
	SidebarGroupLabel,
	SidebarMenuButton,
} from "@/shared/components/ui/sidebar"

import type { LucideIcon } from "lucide-react"

export function NavMain({
	items,
	pathname,
}: {
	items: {
		title: string
		href: string
		icon?: LucideIcon
	}[]
	pathname: string
}) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menú</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<Link href={item.href}>
							<SidebarMenuButton
								tooltip={item.title}
								className={cn("", pathname === item.href && "bg-accent text-accent-foreground")}
							>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</Link>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
