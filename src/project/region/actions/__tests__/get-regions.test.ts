/**
 * @jest-environment node
 */

import { getRegions } from '../get-regions'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		region: {
			findMany: jest.fn(),
		},
	},
}))

describe('getRegions', () => {
	const mockRegions = [
		{
			id: '1',
			name: 'Metropolitana',
			createdAt: new Date(),
			updatedAt: new Date(),
			cities: [
				{
					id: 'city-1',
					name: 'Santiago',
					regionId: '1',
				},
				{
					id: 'city-2',
					name: 'Puente Alto',
					regionId: '1',
				},
			],
		},
		{
			id: '2',
			name: 'Valparaíso',
			createdAt: new Date(),
			updatedAt: new Date(),
			cities: [],
		},
	]

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe retornar todas las regiones con ciudades', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.region.findMany.mockResolvedValue(mockRegions)

		const result = await getRegions()

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockRegions)
		expect(prisma.region.findMany).toHaveBeenCalledWith({
			include: {
				cities: true,
			},
			orderBy: {
				name: 'asc',
			},
		})
	})

	it('debe ordenar por nombre ascendente', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.region.findMany.mockResolvedValue(mockRegions)

		await getRegions()

		expect(prisma.region.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				orderBy: {
					name: 'asc',
				},
			})
		)
	})

	it('debe retornar array vacío cuando no hay regiones', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.region.findMany.mockResolvedValue([])

		const result = await getRegions()

		expect(result.success).toBe(true)
		expect(result.data).toEqual([])
	})

	it('debe incluir ciudades en la respuesta', async () => {
		const { prisma } = require('@/lib/prisma')
		prisma.region.findMany.mockResolvedValue(mockRegions)

		const result = await getRegions()

		expect(result.data?.[0]).toHaveProperty('cities')
		expect(Array.isArray(result.data?.[0].cities)).toBe(true)
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.region.findMany.mockRejectedValue(new Error('Database error'))

		const result = await getRegions()

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al obtener regiones')
		consoleErrorSpy.mockRestore()
	})
})
