"use client"

import { useState, useEffect } from "react"
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
import { Edit, Trash2, Bike, Search, User } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import Link from "next/link"
import { Badge } from "@/shared/components/ui/badge"
import { getMotorbikes } from "../actions/motorbikes-actions"
import { toast } from "sonner"
import { Spinner } from "@/shared/components/ui/spinner"

export function MotorbikesTable() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [motorbikes, setMotorbikes] = useState<any[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadMotorbikes() {
			setLoading(true)
			const result = await getMotorbikes()
			if (result.success && result.data) {
				setMotorbikes(result.data)
			} else {
				toast.error(result.error || "Error al cargar motos")
			}
			setLoading(false)
		}

		loadMotorbikes()
	}, [])

	const filteredMotorbikes = motorbikes.filter(
		(motorbike) =>
			motorbike.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
			motorbike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
			motorbike.plate.toLowerCase().includes(searchTerm.toLowerCase())
	)

	if (loading) {
		return (
			<div className="flex items-center justify-center">
				<Spinner className="h-6 w-6 animate-spin" />
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Buscar motos..."
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
								<TableHead className="font-semibold text-green-800">Moto</TableHead>
								<TableHead className="font-semibold text-green-800">Patente</TableHead>
								<TableHead className="font-semibold text-green-800">Especificaciones</TableHead>
								<TableHead className="font-semibold text-green-800">Motorista</TableHead>
								<TableHead className="text-right font-semibold text-green-800">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredMotorbikes.map((motorbike) => (
								<TableRow key={motorbike.id} className="border-green-100">
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
												<Bike className="h-5 w-5 text-green-600" />
											</div>
											<div>
												<p className="font-medium">
													{motorbike.brand} {motorbike.model}
												</p>
												<p className="text-muted-foreground text-sm">
													{motorbike.color} - {motorbike.year}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="secondary" className="bg-gray-100 font-mono text-gray-900">
											{motorbike.plate}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="text-sm">
											<p>
												<span className="font-medium">{motorbike.cylinders}</span> cc
											</p>
											<p className="text-muted-foreground">
												{motorbike.mileage.toLocaleString()} km
											</p>
										</div>
									</TableCell>
									<TableCell>
										{motorbike.isAssigned ? (
											<div className="flex items-center gap-2">
												<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
													<User className="h-3 w-3 text-green-600" />
												</div>
												<span className="text-sm">{motorbike.driverName}</span>
											</div>
										) : (
											<Badge variant="secondary" className="bg-orange-100 text-orange-800">
												Disponible
											</Badge>
										)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Link href={`/motos/${motorbike.id}`}>
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
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}
