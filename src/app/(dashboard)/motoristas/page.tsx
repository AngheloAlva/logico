import { Button } from "@/shared/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DriversTable } from "./components/drivers-table"

export default function MotoristasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-800">Motoristas</h1>
          <p className="text-muted-foreground">
            Gestiona los motoristas del sistema
          </p>
        </div>
        <Link href="/motoristas/nuevo">
          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Motorista
          </Button>
        </Link>
      </div>

      <DriversTable />
    </div>
  )
}
