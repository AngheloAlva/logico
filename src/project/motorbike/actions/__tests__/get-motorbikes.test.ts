/**
 * @jest-environment node
 */

import { getMotorbikes } from '../get-motorbikes'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		motorbike: {
			findMany: jest.fn(),
		},
	},
}))

describe('getMotorbikes', () => {
	const mockMotorbikes = [
		{
			id: '1',
			brand: 'Honda',
			model: 'CB 190',
			plate: 'ABC123',
			class: 'Moto',
			color: 'Rojo',
			cylinders: 190,
			year: 2023,
			mileage: 5000,
			driverId: 'driver-1',
			createdAt: new Date(),
			updatedAt: new Date(),
			driver: {
				id: 'driver-1',
				name: 'Carlos Motorista',
				rut: '12345678-9',
				email: 'carlos@logico.cl',
				phone: '+56987654321',
				active: true,
			},
		},
	]

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe retornar todas las motos exitosamente', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.motorbike.findMany.mockResolvedValue(mockMotorbikes)

		const result = await getMotorbikes()

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockMotorbikes)
	})

	it('debe retornar array vacío cuando no hay motos', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.motorbike.findMany.mockResolvedValue([])

		const result = await getMotorbikes()

		expect(result.success).toBe(true)
		expect(result.data).toEqual([])
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.motorbike.findMany.mockRejectedValue(new Error('Database error'))

		const result = await getMotorbikes()

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al obtener motos')
		consoleErrorSpy.mockRestore()
	})

	it('debe incluir relación con motorista', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.motorbike.findMany.mockResolvedValue(mockMotorbikes)

		const result = await getMotorbikes()

		expect(result.success).toBe(true)
		expect(result.data?.[0]).toHaveProperty('driver')
	})
})
