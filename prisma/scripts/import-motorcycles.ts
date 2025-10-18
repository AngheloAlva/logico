import * as XLSX from "xlsx"
import { PrismaClient } from "../../src/generated/prisma"
import path from "path"

const prisma = new PrismaClient()

interface VehicleRow {
	"Grupo Vehiculo": string
	"Placa": string
	"digito": number
	"Codigo SII": string
	"Año Vehículo": number
	"Tasacion": number
	"Tipo de Pago": string
	"Valor_Neto": number
	"Valor_IPC": number
	"Valor_Multa": number
	"Valor Pagado": number
	"Forma Pago": string
	"Fecha_Pago": number
	"Año Permiso": number
	"Tipo Vehiculo": string
	"Marca": string
	"Modelo": string
	"Color": string
	"Transmisión": string
	"Tipo Combustible": string
	"Cilindrada": number
	"Equipamiento": string
	"Numero Puertas": number
}

function isMotorcycle(row: VehicleRow): boolean {
	const grupoVehiculo = row["Grupo Vehiculo"]?.toLowerCase() || ""
	const tipoVehiculo = row["Tipo Vehiculo"]?.toLowerCase() || ""

	return (
		grupoVehiculo.includes("moto") ||
		tipoVehiculo.includes("moto") ||
		tipoVehiculo.includes("motocicleta") ||
		tipoVehiculo.includes("ciclomotor") ||
		tipoVehiculo.includes("cuatrimoto") ||
		tipoVehiculo.includes("tricar")
	)
}

function cleanString(value: unknown): string {
	if (!value) return ""
	return String(value).trim()
}

function normalizeColor(color: string): string {
	const cleanColor = cleanString(color).toUpperCase()
	if (!cleanColor || cleanColor === "NULL" || cleanColor === "N/A") {
		return "SIN ESPECIFICAR"
	}
	return cleanColor
}

async function importMotorcycles() {
	console.log("🏍️  Iniciando importación de motos...")

	const excelPath = path.join(process.cwd(), "base-data", "permiso-de-circulacion-2023.xlsx")
	console.log(`📁 Leyendo archivo: ${excelPath}`)

	const workbook = XLSX.readFile(excelPath)
	const sheetName = workbook.SheetNames[0]
	const worksheet = workbook.Sheets[sheetName]
	const data: VehicleRow[] = XLSX.utils.sheet_to_json(worksheet)

	console.log(`📋 Total de filas encontradas: ${data.length}`)

	const motorcycles = data.filter(isMotorcycle)
	console.log(`🏍️  Motos identificadas: ${motorcycles.length}`)

	if (motorcycles.length === 0) {
		console.log("⚠️  No se encontraron motos en el archivo Excel")
		console.log("💡 Tip: Verifica que el archivo contenga vehículos tipo motocicleta")
		return
	}

	let created = 0
	let updated = 0
	let skipped = 0
	let errors = 0

	for (const row of motorcycles) {
		try {
			const plate = cleanString(row.Placa)

			if (!plate) {
				console.warn(`⚠️  Moto sin placa, omitiendo...`)
				skipped++
				continue
			}

			const motorbikeData = {
				brand: cleanString(row.Marca) || "SIN MARCA",
				class: cleanString(row["Tipo Vehiculo"]) || "MOTOCICLETA",
				model: cleanString(row.Modelo) || "SIN MODELO",
				plate: plate.toUpperCase(),
				color: normalizeColor(row.Color),
				cylinders: Number(row.Cilindrada) || 0,
				year: Number(row["Año Vehículo"]) || new Date().getFullYear(),
				mileage: 0,
			}

			const existingMotorbike = await prisma.motorbike.findUnique({
				where: { plate: motorbikeData.plate },
			})

			if (existingMotorbike) {
				await prisma.motorbike.update({
					where: { plate: motorbikeData.plate },
					data: motorbikeData,
				})
				updated++
				if (updated % 20 === 0) {
					console.log(`🔄 Actualizadas: ${updated}`)
				}
			} else {
				await prisma.motorbike.create({
					data: motorbikeData,
				})
				created++
				if (created % 20 === 0) {
					console.log(`✅ Creadas: ${created}`)
				}
			}
		} catch (error: unknown) {
			console.error(`❌ Error procesando moto ${row.Placa}:`, error)
			errors++
		}
	}

	console.log("\n" + "=".repeat(60))
	console.log("🏍️  RESUMEN DE IMPORTACIÓN DE MOTOS")
	console.log("=".repeat(60))
	console.log(`✅ Motos creadas: ${created}`)
	console.log(`🔄 Motos actualizadas: ${updated}`)
	console.log(`⏭️  Motos omitidas: ${skipped}`)
	console.log(`❌ Errores: ${errors}`)
	console.log(`📋 Total de motos procesadas: ${motorcycles.length}`)
	console.log(`📊 Total de registros en Excel: ${data.length}`)
	console.log("=".repeat(60))
}

async function main() {
	try {
		await importMotorcycles()
	} catch (error) {
		console.error("❌ Error fatal durante la importación:", error)
		process.exit(1)
	} finally {
		await prisma.$disconnect()
	}
}

main()
