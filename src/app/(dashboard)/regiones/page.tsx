import { Button } from "@/shared/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RegionsTable } from "./components/regions-table"

export default function RegionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-800">Regiones</h1>
          <p className="text-muted-foreground">
            Gestiona las regiones y ciudades del sistema
          </p>
        </div>
        <Link href="/regiones/nueva">
          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Región
          </Button>
        </Link>
      </div>

      <RegionsTable />
    </div>
  )
}
