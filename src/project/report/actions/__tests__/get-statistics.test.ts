/**
 * @jest-environment node
 */

import { getStatistics } from '../get-statistics'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		movement: {
			count: jest.fn(),
			findMany: jest.fn(),
		},
		pharmacy: {
			count: jest.fn(),
		},
		driver: {
			count: jest.fn(),
		},
		incident: {
			count: jest.fn(),
		},
	},
}))

describe('getStatistics', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe retornar estadísticas completas', async () => {
		const { prisma } = require('@/lib/prisma')

		prisma.movement.count
			.mockResolvedValueOnce(150) // totalMovements
			.mockResolvedValueOnce(80) // deliveredThisMonth
			.mockResolvedValueOnce(20) // activeDrivers
		prisma.pharmacy.count.mockResolvedValue(50)
		prisma.driver.count
			.mockResolvedValueOnce(25) // totalDrivers
			.mockResolvedValueOnce(20) // activeDrivers
		prisma.incident.count.mockResolvedValue(10)
		prisma.movement.findMany.mockResolvedValue([
			{
				departureDate: new Date('2025-10-18T10:00:00'),
				deliveryDate: new Date('2025-10-18T10:30:00'),
			},
			{
				departureDate: new Date('2025-10-18T11:00:00'),
				deliveryDate: new Date('2025-10-18T11:45:00'),
			},
		])

		const result = await getStatistics()

		expect(result.success).toBe(true)
		expect(result.data).toHaveProperty('totalMovements')
		expect(result.data).toHaveProperty('totalPharmacies')
		expect(result.data).toHaveProperty('totalDrivers')
		expect(result.data).toHaveProperty('totalIncidents')
		expect(result.data).toHaveProperty('avgDeliveryTime')
		expect(result.data).toHaveProperty('successRate')
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.movement.count.mockRejectedValue(new Error('Database error'))

		const result = await getStatistics()

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al obtener estadísticas')
		consoleErrorSpy.mockRestore()
	})
})
