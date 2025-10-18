/**
 * @jest-environment node
 */

import { getDrivers } from '../get-drivers'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		driver: {
			findMany: jest.fn(),
		},
	},
}))

describe('getDrivers', () => {
	const mockDrivers = [
		{
			id: '1',
			name: 'Carlos Motorista',
			rut: '12345678-9',
			email: 'carlos@logico.cl',
			phone: '+56987654321',
			address: 'Calle Test 123',
			regionId: 'region-1',
			cityId: 'city-1',
			active: true,
			createdAt: new Date(),
			updatedAt: new Date(),
			region: {
				id: 'region-1',
				name: 'Metropolitana',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			city: {
				id: 'city-1',
				name: 'Santiago',
				regionId: 'region-1',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			motorbike: null,
		},
	]

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe retornar todos los motoristas exitosamente', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.driver.findMany.mockResolvedValue(mockDrivers)

		const result = await getDrivers()

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockDrivers)
		expect(prisma.driver.findMany).toHaveBeenCalledWith({
			include: {
				region: true,
				city: true,
				motorbike: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	})

	it('debe retornar array vacío cuando no hay motoristas', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.driver.findMany.mockResolvedValue([])

		const result = await getDrivers()

		expect(result.success).toBe(true)
		expect(result.data).toEqual([])
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.driver.findMany.mockRejectedValue(new Error('Database error'))

		const result = await getDrivers()

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al obtener motoristas')
		consoleErrorSpy.mockRestore()
	})

	it('debe incluir relaciones de región, ciudad y moto', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.driver.findMany.mockResolvedValue(mockDrivers)

		const result = await getDrivers()

		expect(result.success).toBe(true)
		expect(result.data?.[0]).toHaveProperty('region')
		expect(result.data?.[0]).toHaveProperty('city')
		expect(result.data?.[0]).toHaveProperty('motorbike')
	})
})
