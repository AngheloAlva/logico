import { Plus } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import Link from "next/link"

import { MovementsTable } from "@/project/movement/components/movements-table"

export default function MovimientosPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-green-800">Movimientos</h1>
					<p className="text-muted-foreground">Gestiona los despachos y entregas del sistema</p>
				</div>
				<Link href="/movimientos/nuevo">
					<Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
						<Plus className="mr-2 h-4 w-4" />
						Nuevo Movimiento
					</Button>
				</Link>
			</div>

			<MovementsTable />
		</div>
	)
}
