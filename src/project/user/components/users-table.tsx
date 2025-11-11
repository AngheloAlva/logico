"use client"

import { Edit, Trash2, User, Search, Shield, Briefcase, UserCog } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { getUsers } from "../actions/get-users"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Pagination } from "@/shared/components/pagination"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
	Table,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
} from "@/shared/components/ui/table"

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
	supervisor: {
		label: "Supervisor",
		color: "bg-purple-100 text-purple-800",
		icon: Briefcase,
	},
}

export function UsersTable() {
	const [users, setUsers] = useState<Awaited<ReturnType<typeof getUsers>>["data"]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [totalItems, setTotalItems] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [loading, setLoading] = useState(true)

	const loadUsers = async () => {
		try {
			const response = await getUsers({ page: currentPage, pageSize, search: searchTerm })
			setUsers(response.data)
			setTotalItems(response.total || 0)
			setTotalPages(response.totalPages || 0)
			setLoading(false)
		} catch (error) {
			console.error("Error al cargar usuarios:", error)
			toast.error("Error al cargar usuarios")
		}
	}

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			loadUsers()
		}, 300)

		return () => clearTimeout(timeoutId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, pageSize, searchTerm])

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Buscar usuarios..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-white pl-9 focus:border-green-500 focus:ring-green-500"
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
							{loading
								? Array.from({ length: pageSize }).map((_, index) => (
										<TableRow key={index}>
											<TableCell colSpan={5}>
												<Skeleton className="h-10" />
											</TableCell>
										</TableRow>
									))
								: users.map((user) => {
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
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						pageSize={pageSize}
						totalItems={totalItems}
						onPageChange={setCurrentPage}
						onPageSizeChange={setPageSize}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
