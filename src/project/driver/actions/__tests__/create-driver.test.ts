/**
 * @jest-environment node
 */

import { createDriver } from '../create-driver'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		driver: {
			create: jest.fn(),
		},
	},
}))

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}))

describe('createDriver', () => {
	const validDriverData = {
		name: 'Carlos Motorista',
		rut: '12345678-9',
		email: 'carlos@logico.cl',
		phone: '+56987654321',
		active: true,
	}

	const mockCreatedDriver = {
		id: 'driver-1',
		...validDriverData,
		address: null,
		regionId: null,
		cityId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe crear motorista con datos válidos', async () => {
		const { prisma } = require('@/lib/prisma')
		const { revalidatePath } = require('next/cache')

		prisma.driver.create.mockResolvedValue(mockCreatedDriver)

		const result = await createDriver(validDriverData)

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockCreatedDriver)
		expect(revalidatePath).toHaveBeenCalledWith('/motoristas')
	})

	it('debe rechazar nombre muy corto', async () => {
		const result = await createDriver({
			...validDriverData,
			name: 'AB',
		})

		expect(result.success).toBe(false)
		expect(result.error).toBeDefined()
	})

	it('debe rechazar RUT inválido', async () => {
		const result = await createDriver({
			...validDriverData,
			rut: '123',
		})

		expect(result.success).toBe(false)
	})

	it('debe rechazar email inválido', async () => {
		const result = await createDriver({
			...validDriverData,
			email: 'not-an-email',
		})

		expect(result.success).toBe(false)
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.driver.create.mockRejectedValue(new Error('Database error'))

		const result = await createDriver(validDriverData)

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al crear motorista')
		consoleErrorSpy.mockRestore()
	})
})
