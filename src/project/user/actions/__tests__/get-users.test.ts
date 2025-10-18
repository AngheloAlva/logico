/**
 * @jest-environment node
 */

import { getUsers } from "../get-users"

jest.mock("@/lib/prisma", () => ({
	prisma: {
		user: {
			findMany: jest.fn(),
		},
	},
}))

describe("getUsers", () => {
	const mockUsers = [
		{
			id: "1",
			name: "Admin User",
			email: "admin@logico.cl",
			emailVerified: true,
			image: null,
			banned: false,
			banReason: null,
			banExpires: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "2",
			name: "Operadora User",
			email: "operadora@logico.cl",
			emailVerified: true,
			image: null,
			banned: false,
			banReason: null,
			banExpires: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	]

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("debe retornar todos los usuarios", async () => {
		const { prisma } = require("@/lib/prisma")
		prisma.user.findMany.mockResolvedValue(mockUsers)

		const result = await getUsers()

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockUsers)
		expect(prisma.user.findMany).toHaveBeenCalledWith({
			orderBy: {
				createdAt: "desc",
			},
		})
	})

	it("debe ordenar por fecha de creación descendente", async () => {
		const { prisma } = require("@/lib/prisma")
		prisma.user.findMany.mockResolvedValue(mockUsers)

		await getUsers()

		expect(prisma.user.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				orderBy: {
					createdAt: "desc",
				},
			})
		)
	})

	it("debe retornar array vacío cuando no hay usuarios", async () => {
		const { prisma } = require("@/lib/prisma")
		prisma.user.findMany.mockResolvedValue([])

		const result = await getUsers()

		expect(result.success).toBe(true)
		expect(result.data).toEqual([])
	})

	it("debe manejar errores de base de datos", async () => {
		const { prisma } = require("@/lib/prisma")
		const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation()

		prisma.user.findMany.mockRejectedValue(new Error("Database error"))

		const result = await getUsers()

		expect(result.success).toBe(false)
		expect(result.error).toBe("Error al obtener usuarios")
		consoleErrorSpy.mockRestore()
	})
})
