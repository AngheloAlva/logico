import { Button } from "@/shared/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { MotorbikesTable } from "./components/motorbikes-table"

export default function MotosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-800">Motos</h1>
          <p className="text-muted-foreground">
            Gestiona las motocicletas del sistema
          </p>
        </div>
        <Link href="/motos/nueva">
          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Moto
          </Button>
        </Link>
      </div>

      <MotorbikesTable />
    </div>
  )
}
