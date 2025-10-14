"use client"

import { useState } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Edit, Trash2, User, Search, Shield, Briefcase, UserCog } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import Link from "next/link"

// TODO: Replace with real data from database
const mockUsers = [
	{
		id: "1",
		name: "Admin Principal",
		email: "admin@logico.test",
		role: "admin",
		createdAt: new Date("2024-01-01"),
		banned: false,
	},
	{
		id: "2",
		name: "María Operadora",
		email: "operadora@logico.test",
		role: "operadora",
		createdAt: new Date("2024-01-15"),
		banned: false,
	},
	{
		id: "3",
		name: "Carlos Gerente",
		email: "gerente@logico.test",
		role: "gerente",
		createdAt: new Date("2024-01-20"),
		banned: false,
	},
]

const roleConfig = {
	admin: {
		label: "Administrador",
		color: "bg-red-100 text-red-800",
		icon: Shield,
	},
	operadora: {
		label: "Operadora",
		color: "bg-blue-100 text-blue-800",
		icon: UserCog,
	},
	gerente: {
		label: "Gerente",
		color: "bg-purple-100 text-purple-800",
		icon: Briefcase,
	},
}

export function UsersTable() {
	const [users] = useState(mockUsers)
	const [searchTerm, setSearchTerm] = useState("")

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Buscar usuarios..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-9 focus:border-green-500 focus:ring-green-500"
					/>
				</div>
			</div>

			<Card className="">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-green-50/50">
								<TableHead className="font-semibold text-green-800">Usuario</TableHead>
								<TableHead className="font-semibold text-green-800">Correo</TableHead>
								<TableHead className="font-semibold text-green-800">Rol</TableHead>
								<TableHead className="font-semibold text-green-800">Fecha de Creación</TableHead>
								<TableHead className="text-right font-semibold text-green-800">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.map((user) => {
								const role = roleConfig[user.role as keyof typeof roleConfig]
								const RoleIcon = role.icon

								return (
									<TableRow key={user.id} className="border-green-100">
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
													<User className="h-5 w-5 text-green-600" />
												</div>
												<div>
													<p className="font-medium">{user.name}</p>
													{user.banned && (
														<Badge
															variant="secondary"
															className="mt-1 bg-red-100 text-xs text-red-800"
														>
															Bloqueado
														</Badge>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<p className="text-sm">{user.email}</p>
										</TableCell>
										<TableCell>
											<Badge variant="secondary" className={role.color}>
												<RoleIcon className="mr-1 h-3 w-3" />
												{role.label}
											</Badge>
										</TableCell>
										<TableCell>{user.createdAt.toLocaleDateString("es-CL")}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Link href={`/usuarios/${user.id}`}>
													<Button
														variant="ghost"
														size="sm"
														className="text-green-600 hover:bg-green-50 hover:text-green-700"
													>
														<Edit className="h-4 w-4" />
													</Button>
												</Link>
												<Button
													variant="ghost"
													size="sm"
													className="text-red-600 hover:bg-red-50 hover:text-red-700"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}
