/**
 * @jest-environment node
 */

import { getTodayStats } from '../get-today-stats'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		movement: {
			count: jest.fn(),
		},
	},
}))

describe('getTodayStats', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe retornar estadísticas del día', async () => {
		const { prisma } = require('@/lib/prisma')

		prisma.movement.count
			.mockResolvedValueOnce(50) // deliveriesToday
			.mockResolvedValueOnce(20) // inTransit
			.mockResolvedValueOnce(120) // completedThisMonth
			.mockResolvedValueOnce(5) // incidentsPending

		const result = await getTodayStats()

		expect(result.success).toBe(true)
		expect(result.data).toHaveProperty('deliveriesToday', 50)
		expect(result.data).toHaveProperty('inTransit', 20)
		expect(result.data).toHaveProperty('completedThisMonth', 120)
		expect(result.data).toHaveProperty('incidentsPending', 5)
	})

	it('debe filtrar movimientos de hoy', async () => {
		const { prisma } = require('@/lib/prisma')
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		prisma.movement.count.mockResolvedValue(10)

		await getTodayStats()

		expect(prisma.movement.count).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					createdAt: expect.objectContaining({
						gte: expect.any(Date),
					}),
				}),
			})
		)
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.movement.count.mockRejectedValue(new Error('Database error'))

		const result = await getTodayStats()

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al obtener estadísticas')
		consoleErrorSpy.mockRestore()
	})
})
