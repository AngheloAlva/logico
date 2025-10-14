import * as XLSX from "xlsx"
import { PrismaClient } from "../../src/generated/prisma"
import path from "path"

const prisma = new PrismaClient()

const REGION_MAP: Record<string, string> = {
	"1": "Tarapacá",
	"2": "Antofagasta",
	"3": "Atacama",
	"4": "Coquimbo",
	"5": "Valparaíso",
	"6": "Valparaíso",
	"7": "Metropolitana de Santiago",
	"8": "Libertador General Bernardo O'Higgins",
	"9": "Maule",
	"10": "Ñuble",
	"11": "Biobío",
	"12": "Araucanía",
	"13": "Los Ríos",
	"14": "Los Lagos",
	"15": "Aysén del General Carlos Ibáñez del Campo",
	"16": "Magallanes y de la Antártica Chilena",
}

interface PharmacyRow {
	local_id: number
	local_nombre: string
	local_direccion: string
	comuna_nombre: string
	localidad_nombre: string
	fk_region: number
	fk_comuna: number
	fk_localidad: number
	funcionamiento_hora_apertura?: string
	funcionamiento_hora_cierre?: string
	funcionamiento_dia?: string
	local_telefono: string
	local_lat?: number
	local_lng?: number
	fecha?: string
}

async function importPharmacies() {
	console.log("📊 Iniciando importación de farmacias...")

	const excelPath = path.join(process.cwd(), "base-data", "farmacias.xlsx")
	console.log(`📁 Leyendo archivo: ${excelPath}`)

	const workbook = XLSX.readFile(excelPath)
	const sheetName = workbook.SheetNames[0]
	const worksheet = workbook.Sheets[sheetName]
	const data: PharmacyRow[] = XLSX.utils.sheet_to_json(worksheet)

	console.log(`📋 Total de filas encontradas: ${data.length}`)

	const regions = await prisma.region.findMany({
		include: { cities: true },
	})

	const regionMap = new Map<string, { id: string; cities: Map<string, string> }>()

	for (const region of regions) {
		const cityMap = new Map<string, string>()
		for (const city of region.cities) {
			cityMap.set(city.name.toLowerCase().trim(), city.id)
		}
		regionMap.set(region.name.toLowerCase().trim(), {
			id: region.id,
			cities: cityMap,
		})
	}

	let created = 0
	let updated = 0
	let skipped = 0
	let errors = 0

	for (const row of data) {
		try {
			const regionName = REGION_MAP[row.fk_region.toString()]
			if (!regionName) {
				console.warn(
					`⚠️  Región no encontrada para fk_region: ${row.fk_region} - Farmacia: ${row.local_nombre}`
				)
				skipped++
				continue
			}

			let regionData = regionMap.get(regionName.toLowerCase().trim())
			if (!regionData) {
				console.log(`➕ Creando región: ${regionName}`)
				const newRegion = await prisma.region.create({
					data: {
						name: regionName,
					},
					include: { cities: true },
				})
				regionData = {
					id: newRegion.id,
					cities: new Map(),
				}
				regionMap.set(regionName.toLowerCase().trim(), regionData)
			}

			const cityName = row.comuna_nombre.trim()
			let cityId = regionData.cities.get(cityName.toLowerCase())

			if (!cityId) {
				console.log(`➕ Creando ciudad: ${cityName} en región ${regionName}`)
				const newCity = await prisma.city.create({
					data: {
						name: cityName,
						regionId: regionData.id,
					},
				})
				cityId = newCity.id
				regionData.cities.set(cityName.toLowerCase(), cityId)
			}

			const pharmacyData = {
				name: row.local_nombre.trim(),
				address: row.local_direccion.trim(),
				contactPhone: row.local_telefono || "Sin teléfono",
				contactEmail: `contacto.${row.local_id}@cruzverde.cl`,
				contactName: "Administrador",
				regionId: regionData.id,
				cityId: cityId,
			}

			const existingPharmacy = await prisma.pharmacy.findFirst({
				where: {
					name: pharmacyData.name,
					address: pharmacyData.address,
				},
			})

			if (existingPharmacy) {
				await prisma.pharmacy.update({
					where: { id: existingPharmacy.id },
					data: pharmacyData,
				})
				updated++
				if (updated % 50 === 0) {
					console.log(`🔄 Actualizadas: ${updated}`)
				}
			} else {
				await prisma.pharmacy.create({
					data: pharmacyData,
				})
				created++
				if (created % 50 === 0) {
					console.log(`✅ Creadas: ${created}`)
				}
			}
		} catch (error) {
			console.error(`❌ Error procesando farmacia ${row.local_nombre}:`, error)
			errors++
		}
	}

	console.log("\n" + "=".repeat(50))
	console.log("📊 RESUMEN DE IMPORTACIÓN")
	console.log("=".repeat(50))
	console.log(`✅ Farmacias creadas: ${created}`)
	console.log(`🔄 Farmacias actualizadas: ${updated}`)
	console.log(`⏭️  Farmacias omitidas: ${skipped}`)
	console.log(`❌ Errores: ${errors}`)
	console.log(`📋 Total procesado: ${data.length}`)
	console.log("=".repeat(50))
}

async function main() {
	try {
		await importPharmacies()
	} catch (error) {
		console.error("❌ Error fatal durante la importación:", error)
		process.exit(1)
	} finally {
		await prisma.$disconnect()
	}
}

main()
