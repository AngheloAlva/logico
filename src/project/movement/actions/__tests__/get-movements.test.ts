/**
 * @jest-environment node
 */

import { getMovements } from '../get-movements'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		movement: {
			findMany: jest.fn(),
		},
	},
}))

describe('getMovements', () => {
	const mockMovements = [
		{
			id: '1',
			number: '1234567890',
			pharmacyId: 'pharmacy-1',
			driverId: 'driver-1',
			address: 'Dirección Test 123',
			hasRecipe: false,
			segments: 1,
			segmentCost: null,
			segmentsAddress: [],
			status: 'PENDING',
			departureDate: null,
			deliveryDate: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			pharmacy: {
				id: 'pharmacy-1',
				name: 'Farmacia Test',
			},
			driver: {
				id: 'driver-1',
				name: 'Carlos Motorista',
			},
			incidents: [],
		},
	]

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe retornar todos los movimientos sin filtros', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.movement.findMany.mockResolvedValue(mockMovements)

		const result = await getMovements()

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockMovements)
	})

	it('debe filtrar por estado', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.movement.findMany.mockResolvedValue(mockMovements)

		await getMovements({ status: 'PENDING' })

		expect(prisma.movement.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { status: 'PENDING' },
			})
		)
	})

	it('debe filtrar por farmacia', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.movement.findMany.mockResolvedValue(mockMovements)

		await getMovements({ pharmacyId: 'pharmacy-1' })

		expect(prisma.movement.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { pharmacyId: 'pharmacy-1' },
			})
		)
	})

	it('debe manejar filtro "all" sin aplicar filtro de estado', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.movement.findMany.mockResolvedValue(mockMovements)

		await getMovements({ status: 'all' })

		expect(prisma.movement.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: {},
			})
		)
	})

	it('debe incluir relaciones de farmacia, motorista e incidencias', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.movement.findMany.mockResolvedValue(mockMovements)

		const result = await getMovements()

		expect(result.data?.[0]).toHaveProperty('pharmacy')
		expect(result.data?.[0]).toHaveProperty('driver')
		expect(result.data?.[0]).toHaveProperty('incidents')
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.movement.findMany.mockRejectedValue(new Error('Database error'))

		const result = await getMovements()

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al obtener movimientos')
		consoleErrorSpy.mockRestore()
	})
})
