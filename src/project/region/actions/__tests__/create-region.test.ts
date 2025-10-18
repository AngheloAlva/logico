/**
 * @jest-environment node
 */

import { createRegion } from '../create-region'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		region: {
			create: jest.fn(),
		},
	},
}))

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}))

describe('createRegion', () => {
	const validRegionData = {
		name: 'Metropolitana',
	}

	const mockCreatedRegion = {
		id: 'region-1',
		...validRegionData,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe crear región con datos válidos', async () => {
		const { prisma } = require('@/lib/prisma')
		const { revalidatePath } = require('next/cache')

		prisma.region.create.mockResolvedValue(mockCreatedRegion)

		const result = await createRegion(validRegionData)

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockCreatedRegion)
		expect(revalidatePath).toHaveBeenCalledWith('/regiones')
	})

	it('debe rechazar nombre muy corto', async () => {
		const result = await createRegion({
			name: 'A',
		})

		expect(result.success).toBe(false)
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.region.create.mockRejectedValue(new Error('Database error'))

		const result = await createRegion(validRegionData)

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al crear región')
		consoleErrorSpy.mockRestore()
	})
})
