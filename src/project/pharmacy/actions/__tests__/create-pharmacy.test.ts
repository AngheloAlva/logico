/**
 * @jest-environment node
 */

import { createPharmacy } from '../create-pharmacy'
import { pharmacySchema } from '@/shared/schemas/pharmacy.schema'

// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
	prisma: {
		pharmacy: {
			create: jest.fn(),
		},
	},
}))

// Mock de next/cache
jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}))

describe('createPharmacy', () => {
	const validPharmacyData = {
		name: 'Farmacia Test',
		address: 'Av. Siempre Viva 742',
		contactName: 'Juan Pérez',
		contactPhone: '+56912345678',
		contactEmail: 'test@farmacia.cl',
		regionId: '123e4567-e89b-12d3-a456-426614174000',
		cityId: '123e4567-e89b-12d3-a456-426614174001',
	}

	const mockCreatedPharmacy = {
		id: 'pharmacy-1',
		...validPharmacyData,
		createdAt: new Date(),
		updatedAt: new Date(),
		createdBy: 'user-1',
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('Creación exitosa', () => {
		it('debe crear farmacia con datos válidos', async () => {
			const { prisma } = require('@/lib/prisma')
			const { revalidatePath } = require('next/cache')

			prisma.pharmacy.create.mockResolvedValue(mockCreatedPharmacy)

			const result = await createPharmacy(validPharmacyData)

			expect(result.success).toBe(true)
			expect(result.data).toEqual(mockCreatedPharmacy)
			expect(prisma.pharmacy.create).toHaveBeenCalledWith({
				data: validPharmacyData,
			})
			expect(revalidatePath).toHaveBeenCalledWith('/farmacias')
		})

		it('debe revalidar la ruta después de crear', async () => {
			const { prisma } = require('@/lib/prisma')
			const { revalidatePath } = require('next/cache')

			prisma.pharmacy.create.mockResolvedValue(mockCreatedPharmacy)

			await createPharmacy(validPharmacyData)

			expect(revalidatePath).toHaveBeenCalledTimes(1)
			expect(revalidatePath).toHaveBeenCalledWith('/farmacias')
		})
	})

	describe('Validación de datos', () => {
		it('debe rechazar datos con nombre muy corto', async () => {
			const invalidData = {
				...validPharmacyData,
				name: 'AB',
			}

			const result = await createPharmacy(invalidData)

			expect(result.success).toBe(false)
			expect(result.error).toBeDefined()
		})

		it('debe rechazar email inválido', async () => {
			const invalidData = {
				...validPharmacyData,
				contactEmail: 'not-an-email',
			}

			const result = await createPharmacy(invalidData)

			expect(result.success).toBe(false)
			expect(result.error).toBeDefined()
		})

		it('debe rechazar UUID inválido en regionId', async () => {
			const invalidData = {
				...validPharmacyData,
				regionId: 'not-a-uuid',
			}

			const result = await createPharmacy(invalidData)

			expect(result.success).toBe(false)
			expect(result.error).toBeDefined()
		})

		it('debe rechazar datos incompletos', async () => {
			const incompleteData = {
				name: 'Farmacia',
			}

			const result = await createPharmacy(incompleteData)

			expect(result.success).toBe(false)
			expect(result.error).toBeDefined()
		})
	})

	describe('Manejo de errores', () => {
		it('debe manejar error de base de datos', async () => {
			const { prisma } = require('@/lib/prisma')
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			prisma.pharmacy.create.mockRejectedValue(
				new Error('Database error')
			)

			const result = await createPharmacy(validPharmacyData)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Error al crear farmacia')
			expect(consoleErrorSpy).toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})

		it('debe manejar error de unicidad', async () => {
			const { prisma } = require('@/lib/prisma')
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			prisma.pharmacy.create.mockRejectedValue({
				code: 'P2002',
				meta: { target: ['name'] },
			})

			const result = await createPharmacy(validPharmacyData)

			expect(result.success).toBe(false)
			expect(consoleErrorSpy).toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})
	})

	describe('Validación de schema Zod', () => {
		it('debe validar todos los campos requeridos', () => {
			const result = pharmacySchema.safeParse(validPharmacyData)
			expect(result.success).toBe(true)
		})

		it('debe validar formato de teléfono', () => {
			const result = pharmacySchema.safeParse({
				...validPharmacyData,
				contactPhone: '12345678',
			})
			expect(result.success).toBe(true)
		})

		it('debe rechazar dirección muy corta', () => {
			const result = pharmacySchema.safeParse({
				...validPharmacyData,
				address: 'Dir',
			})
			expect(result.success).toBe(false)
		})
	})
})
