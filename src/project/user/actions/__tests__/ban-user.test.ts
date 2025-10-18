/**
 * @jest-environment node
 */

import { banUser } from '../ban-user'

jest.mock('@/lib/prisma', () => ({
	prisma: {
		user: {
			update: jest.fn(),
		},
	},
}))

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}))

describe('banUser', () => {
	const userId = '123e4567-e89b-12d3-a456-426614174000'
	const reason = 'Violación de términos de servicio'

	const mockBannedUser = {
		id: userId,
		name: 'User Test',
		email: 'test@logico.cl',
		banned: true,
		banReason: reason,
		banExpires: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('debe banear usuario correctamente', async () => {
		const { prisma } = require('@/lib/prisma')
		const { revalidatePath } = require('next/cache')

		prisma.user.update.mockResolvedValue(mockBannedUser)

		const result = await banUser(userId, reason)

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockBannedUser)
		expect(prisma.user.update).toHaveBeenCalledWith({
			where: { id: userId },
			data: {
				banned: true,
				banReason: reason,
				banExpires: undefined,
			},
		})
		expect(revalidatePath).toHaveBeenCalledWith('/usuarios')
	})

	it('debe banear usuario con fecha de expiración', async () => {
		const { prisma } = require('@/lib/prisma')
		const expiresAt = new Date('2025-12-31')

		prisma.user.update.mockResolvedValue({
			...mockBannedUser,
			banExpires: expiresAt,
		})

		const result = await banUser(userId, reason, expiresAt)

		expect(result.success).toBe(true)
		expect(prisma.user.update).toHaveBeenCalledWith({
			where: { id: userId },
			data: {
				banned: true,
				banReason: reason,
				banExpires: expiresAt,
			},
		})
	})

	it('debe manejar errores de base de datos', async () => {
		const { prisma } = require('@/lib/prisma')
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

		prisma.user.update.mockRejectedValue(new Error('Database error'))

		const result = await banUser(userId, reason)

		expect(result.success).toBe(false)
		expect(result.error).toBe('Error al bloquear usuario')
		consoleErrorSpy.mockRestore()
	})
})
