/**
 * @jest-environment node
 */

import { createMovement } from '../create-movement'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		movement: {
			create: jest.fn(),
		},
	},
}))

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}))

describe('createMovement', () => {
	const validMovementData = {
		number: '1234567890',
		pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
		driverId: '123e4567-e89b-12d3-a456-426614174001',
		address: 'Dirección Test 123',
		hasRecipe: false,
		segments: 1,
		segmentsAddress: [],
	}

	const mockCreatedMovement = {
		id: 'movement-1',
		...validMovementData,
		segmentCost: null,
		status: 'PENDING',
		departureDate: null,
		deliveryDate: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe crear movimiento con datos válidos', async () => {
		const { prisma } = require('@/lib/prisma')
		const { revalidatePath } = require('next/cache')

		prisma.movement.create.mockResolvedValue(mockCreatedMovement)

		const result = await createMovement(validMovementData)

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockCreatedMovement)
		expect(prisma.movement.create).toHaveBeenCalledWith({
			data: {
				...validMovementData,
				status: 'PENDING',
			},
		})
		expect(revalidatePath).toHaveBeenCalledWith('/movimientos')
	})

	it('debe asignar estado PENDING por defecto', async () => {
		const { prisma } = require('@/lib/prisma')

		prisma.movement.create.mockResolvedValue(mockCreatedMovement)

		await createMovement(validMovementData)

		expect(prisma.movement.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					status: 'PENDING',
				}),
			})
		)
	})

	it('debe rechazar número muy corto', async () => {
		const result = await createMovement({
			...validMovementData,
			number: '123',
		})

		expect(result.success).toBe(false)
	})

	it('debe rechazar UUID inválido en pharmacyId', async () => {
		const result = await createMovement({
			...validMovementData,
			pharmacyId: 'not-a-uuid',
		})

		expect(result.success).toBe(false)
	})

	it('debe rechazar dirección muy corta', async () => {
		const result = await createMovement({
			...validMovementData,
			address: 'Dir',
		})

		expect(result.success).toBe(false)
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.movement.create.mockRejectedValue(new Error('Database error'))

		const result = await createMovement(validMovementData)

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al crear movimiento')
		consoleErrorSpy.mockRestore()
	})
})
