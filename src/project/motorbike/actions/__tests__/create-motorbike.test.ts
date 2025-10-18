/**
 * @jest-environment node
 */

import { createMotorbike } from '../create-motorbike'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		motorbike: {
			create: jest.fn(),
		},
	},
}))

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}))

describe('createMotorbike', () => {
	const validMotorbikeData = {
		brand: 'Honda',
		model: 'CB 190',
		plate: 'ABC123',
		class: 'Moto',
		color: 'Rojo',
		cylinders: 190,
		year: 2023,
		mileage: 5000,
	}

	const mockCreatedMotorbike = {
		id: 'motorbike-1',
		...validMotorbikeData,
		driverId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe crear moto con datos válidos', async () => {
		const { prisma } = require('@/lib/prisma')
		const { revalidatePath } = require('next/cache')

		prisma.motorbike.create.mockResolvedValue(mockCreatedMotorbike)

		const result = await createMotorbike(validMotorbikeData)

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockCreatedMotorbike)
		expect(revalidatePath).toHaveBeenCalledWith('/motos')
	})

	it('debe rechazar marca muy corta', async () => {
		const result = await createMotorbike({
			...validMotorbikeData,
			brand: 'H',
		})

		expect(result.success).toBe(false)
	})

	it('debe rechazar patente muy corta', async () => {
		const result = await createMotorbike({
			...validMotorbikeData,
			plate: 'AB',
		})

		expect(result.success).toBe(false)
	})

	it('debe rechazar año inválido', async () => {
		const result = await createMotorbike({
			...validMotorbikeData,
			year: 1800,
		})

		expect(result.success).toBe(false)
	})

	it('debe rechazar kilometraje negativo', async () => {
		const result = await createMotorbike({
			...validMotorbikeData,
			mileage: -100,
		})

		expect(result.success).toBe(false)
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.motorbike.create.mockRejectedValue(new Error('Database error'))

		const result = await createMotorbike(validMotorbikeData)

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al crear moto')
		consoleErrorSpy.mockRestore()
	})
})
