import { prisma } from "@/lib/prisma"
import { MovementStatus } from "../../src/generated/prisma"

// Datos de ejemplo para motoristas
const DRIVERS_DATA = [
	{
		name: "Carlos Rodríguez",
		rut: "12345678-9",
		email: "carlos.rodriguez@logico.test",
		phone: "+56912345678",
		address: "Av. Libertador Bernardo O'Higgins 1234",
	},
	{
		name: "María González",
		rut: "23456789-0",
		email: "maria.gonzalez@logico.test",
		phone: "+56923456789",
		address: "Av. Providencia 2345",
	},
	{
		name: "Juan Pérez",
		rut: "34567890-1",
		email: "juan.perez@logico.test",
		phone: "+56934567890",
		address: "Av. Apoquindo 3456",
	},
	{
		name: "Ana Martínez",
		rut: "45678901-2",
		email: "ana.martinez@logico.test",
		phone: "+56945678901",
		address: "Av. Vicuña Mackenna 4567",
	},
	{
		name: "Pedro Sánchez",
		rut: "56789012-3",
		email: "pedro.sanchez@logico.test",
		phone: "+56956789012",
		address: "Av. Grecia 5678",
	},
	{
		name: "Laura Torres",
		rut: "67890123-4",
		email: "laura.torres@logico.test",
		phone: "+56967890123",
		address: "Av. Irarrázaval 6789",
	},
	{
		name: "Diego Ramírez",
		rut: "78901234-5",
		email: "diego.ramirez@logico.test",
		phone: "+56978901234",
		address: "Av. Tobalaba 7890",
	},
	{
		name: "Sofía Flores",
		rut: "89012345-6",
		email: "sofia.flores@logico.test",
		phone: "+56989012345",
		address: "Av. Las Condes 8901",
	},
	{
		name: "Andrés Castro",
		rut: "90123456-7",
		email: "andres.castro@logico.test",
		phone: "+56990123456",
		address: "Av. Vitacura 9012",
	},
	{
		name: "Valentina Morales",
		rut: "01234567-8",
		email: "valentina.morales@logico.test",
		phone: "+56901234567",
		address: "Av. Kennedy 1234",
	},
]

// Direcciones de ejemplo para movimientos
const ADDRESSES = [
	"Av. Providencia 1234, Providencia",
	"Av. Apoquindo 5678, Las Condes",
	"Av. Vicuña Mackenna 9012, Ñuñoa",
	"Av. Grecia 3456, Peñalolén",
	"Av. Irarrázaval 7890, Ñuñoa",
	"Av. Tobalaba 2345, Providencia",
	"Av. Las Condes 6789, Las Condes",
	"Av. Vitacura 4567, Vitacura",
	"Av. Kennedy 8901, Vitacura",
	"Av. Libertador Bernardo O'Higgins 1234, Santiago Centro",
	"Av. Matta 5678, Santiago",
	"Av. Santa Rosa 9012, La Pintana",
	"Av. La Florida 3456, La Florida",
	"Av. Américo Vespucio 7890, Maipú",
	"Av. Pajaritos 2345, Maipú",
	"Av. Gran Avenida 6789, San Miguel",
	"Av. Departamental 4567, La Cisterna",
	"Av. Macul 8901, Macul",
	"Av. Quilín 1234, Macul",
	"Av. Bilbao 5678, Providencia",
]

// Direcciones adicionales para segmentos
const SEGMENT_ADDRESSES = [
	"Calle Los Leones 123",
	"Calle Suecia 456",
	"Calle Orrego Luco 789",
	"Calle Nueva Providencia 234",
	"Calle Pedro de Valdivia 567",
	"Calle Manuel Montt 890",
	"Calle Román Díaz 345",
	"Calle Eliodoro Yáñez 678",
	"Calle General Holley 901",
	"Calle Antonio Varas 234",
]

const STATUSES: MovementStatus[] = [
	MovementStatus.PENDING,
	MovementStatus.IN_TRANSIT,
	MovementStatus.DELIVERED,
	MovementStatus.INCIDENT,
]

// Función para generar fecha aleatoria entre dos fechas
function randomDate(start: Date, end: Date): Date {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Función para generar número de movimiento único
function generateMovementNumber(index: number): string {
	const date = new Date()
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	return `MOV-${year}${month}-${String(index).padStart(5, "0")}`
}

// Función para seleccionar elemento aleatorio de un array
function randomElement<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)]
}

async function createDrivers() {
	console.log("👤 Iniciando creación de motoristas...\n")

	// Obtener motos sin motorista asignado
	const availableMotorbikes = await prisma.motorbike.findMany({
		where: {
			driverId: null,
		},
		take: DRIVERS_DATA.length,
	})

	if (availableMotorbikes.length === 0) {
		console.log("⚠️  No hay motos disponibles sin motorista asignado")
		return []
	}

	console.log(`🏍️  Motos disponibles: ${availableMotorbikes.length}`)

	// Obtener regiones y ciudades para asignar a los motoristas
	const regions = await prisma.region.findMany({
		include: {
			cities: true,
		},
	})

	if (regions.length === 0) {
		console.log("⚠️  No hay regiones disponibles")
		return []
	}

	const drivers = []
	let created = 0

	for (let i = 0; i < Math.min(DRIVERS_DATA.length, availableMotorbikes.length); i++) {
		const driverData = DRIVERS_DATA[i]
		const motorbike = availableMotorbikes[i]
		const region = randomElement(regions)
		const city = region.cities.length > 0 ? randomElement(region.cities) : null

		try {
			// Verificar si el RUT ya existe
			const existingDriver = await prisma.driver.findUnique({
				where: { rut: driverData.rut },
			})

			if (existingDriver) {
				console.log(`⏭️  Motorista con RUT ${driverData.rut} ya existe, omitiendo...`)
				drivers.push(existingDriver)
				continue
			}

			const driver = await prisma.driver.create({
				data: {
					name: driverData.name,
					rut: driverData.rut,
					email: driverData.email,
					phone: driverData.phone,
					address: driverData.address,
					active: true,
					regionId: region.id,
					cityId: city?.id || null,
				},
			})

			// Asignar moto al motorista
			await prisma.motorbike.update({
				where: { id: motorbike.id },
				data: { driverId: driver.id },
			})

			drivers.push(driver)
			created++

			console.log(`✅ Motorista creado: ${driver.name}`)
			console.log(`   - RUT: ${driver.rut}`)
			console.log(`   - Email: ${driver.email}`)
			console.log(`   - Moto asignada: ${motorbike.brand} ${motorbike.model} (${motorbike.plate})`)
			console.log(`   - Región: ${region.name}`)
			if (city) console.log(`   - Ciudad: ${city.name}`)
			console.log()
		} catch (error) {
			console.error(`❌ Error creando motorista ${driverData.name}:`, error)
		}
	}

	console.log("=".repeat(60))
	console.log("📊 RESUMEN DE MOTORISTAS")
	console.log("=".repeat(60))
	console.log(`✅ Motoristas creados: ${created}`)
	console.log(`📋 Total procesado: ${DRIVERS_DATA.length}`)
	console.log("=".repeat(60))
	console.log()

	return drivers
}

async function createMovements(minMovements = 150) {
	console.log(`📦 Iniciando creación de movimientos (mínimo ${minMovements})...\n`)

	// Obtener motoristas activos
	const drivers = await prisma.driver.findMany({
		where: { active: true },
	})

	if (drivers.length === 0) {
		console.log("⚠️  No hay motoristas disponibles")
		return
	}

	// Obtener farmacias
	const pharmacies = await prisma.pharmacy.findMany()

	if (pharmacies.length === 0) {
		console.log("⚠️  No hay farmacias disponibles")
		return
	}

	console.log(`👤 Motoristas disponibles: ${drivers.length}`)
	console.log(`🏥 Farmacias disponibles: ${pharmacies.length}`)
	console.log()

	// Fechas límite: 1 octubre 2025 - 10 noviembre 2025
	const startDate = new Date("2025-10-01T00:00:00")
	const endDate = new Date("2025-11-10T23:59:59")

	let created = 0
	let errors = 0

	// Obtener el último número de movimiento para continuar la secuencia
	const lastMovement = await prisma.movement.findFirst({
		orderBy: { number: "desc" },
	})

	let startIndex = 1
	if (lastMovement) {
		const match = lastMovement.number.match(/MOV-\d{6}-(\d{5})/)
		if (match) {
			startIndex = parseInt(match[1]) + 1
		}
	}

	for (let i = 0; i < minMovements; i++) {
		try {
			const driver = randomElement(drivers)
			const pharmacy = randomElement(pharmacies)
			const status = randomElement(STATUSES)
			const createdAt = randomDate(startDate, endDate)

			// Determinar fechas según el estado
			let departureDate: Date | null = null
			let deliveryDate: Date | null = null

			if (status === "IN_TRANSIT" || status === "DELIVERED" || status === "INCIDENT") {
				departureDate = new Date(createdAt.getTime() + Math.random() * 3600000) // +0-1 hora
			}

			if (status === "DELIVERED") {
				deliveryDate = new Date(departureDate!.getTime() + Math.random() * 7200000 + 1800000) // +0.5-2.5 horas
			}

			// Generar segmentos aleatorios (0-5)
			const segments = Math.floor(Math.random() * 6)
			const segmentCost = segments > 0 ? 1500 + Math.random() * 1000 : null
			const segmentsAddress =
				segments > 0 ? Array.from({ length: segments }, () => randomElement(SEGMENT_ADDRESSES)) : []

			const hasRecipe = Math.random() > 0.5

			const movementNumber = generateMovementNumber(startIndex + i)

			await prisma.movement.create({
				data: {
					number: movementNumber,
					pharmacyId: pharmacy.id,
					driverId: driver.id,
					address: randomElement(ADDRESSES),
					departureDate,
					deliveryDate,
					status,
					segments: segments > 0 ? segments : null,
					segmentCost: segmentCost ? segmentCost.toFixed(2) : null,
					segmentsAddress,
					hasRecipe,
					createdAt,
					updatedAt: createdAt,
				},
			})

			created++

			if (created % 25 === 0) {
				console.log(`✅ Movimientos creados: ${created}/${minMovements}`)
			}
		} catch (error) {
			console.error(`❌ Error creando movimiento ${i + 1}:`, error)
			errors++
		}
	}

	console.log()
	console.log("=".repeat(60))
	console.log("📊 RESUMEN DE MOVIMIENTOS")
	console.log("=".repeat(60))
	console.log(`✅ Movimientos creados: ${created}`)
	console.log(`❌ Errores: ${errors}`)
	console.log(`📋 Total procesado: ${minMovements}`)
	console.log(`📅 Rango de fechas: 01/10/2025 - 10/11/2025`)
	console.log("=".repeat(60))
	console.log()

	// Mostrar estadísticas por estado
	const stats = await prisma.movement.groupBy({
		by: ["status"],
		_count: true,
	})

	console.log("📈 ESTADÍSTICAS POR ESTADO:")
	console.log("-".repeat(60))
	stats.forEach((stat) => {
		console.log(`   ${stat.status}: ${stat._count} movimientos`)
	})
	console.log("-".repeat(60))
}

async function main() {
	try {
		console.log("🚀 Iniciando seed de motoristas y movimientos...\n")
		console.log("=".repeat(60))
		console.log()

		// Crear motoristas y asignarles motos
		const drivers = await createDrivers()

		if (drivers.length === 0) {
			console.log("⚠️  No se pudieron crear motoristas. Abortando...")
			return
		}

		// Crear movimientos (mínimo 150)
		await createMovements(150)

		console.log()
		console.log("🎉 ¡Seed completado exitosamente!")
	} catch (error) {
		console.error("❌ Error fatal durante el seed:", error)
		process.exit(1)
	} finally {
		await prisma.$disconnect()
	}
}

main()
