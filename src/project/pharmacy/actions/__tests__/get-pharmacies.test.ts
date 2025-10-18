/**
 * @jest-environment node
 */

import { getPharmacies } from "../get-pharmacies"

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
	prisma: {
		pharmacy: {
			findMany: jest.fn(),
		},
	},
}))

describe("getPharmacies", () => {
	const mockPharmacies = [
		{
			id: "1",
			name: "Farmacia Test 1",
			address: "Dirección 1",
			contactName: "Contacto 1",
			contactPhone: "+56912345678",
			contactEmail: "test1@farmacia.cl",
			regionId: "region-1",
			cityId: "city-1",
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: "user-1",
			region: {
				id: "region-1",
				name: "Metropolitana",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			city: {
				id: "city-1",
				name: "Santiago",
				regionId: "region-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		},
		{
			id: "2",
			name: "Farmacia Test 2",
			address: "Dirección 2",
			contactName: "Contacto 2",
			contactPhone: "+56987654321",
			contactEmail: "test2@farmacia.cl",
			regionId: "region-1",
			cityId: "city-1",
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: "user-1",
			region: {
				id: "region-1",
				name: "Metropolitana",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			city: {
				id: "city-1",
				name: "Santiago",
				regionId: "region-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		},
	]

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("debe retornar todas las farmacias exitosamente", async () => {
		const { prisma } = require("@/lib/prisma")
		prisma.pharmacy.findMany.mockResolvedValue(mockPharmacies)

		const result = await getPharmacies()

		expect(result.success).toBe(true)
		expect(result.data).toEqual(mockPharmacies)
		expect(prisma.pharmacy.findMany).toHaveBeenCalledWith({
			include: {
				region: true,
				city: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})
	})

	it("debe retornar array vacío cuando no hay farmacias", async () => {
		const { prisma } = require("@/lib/prisma")
		prisma.pharmacy.findMany.mockResolvedValue([])

		const result = await getPharmacies()

		expect(result.success).toBe(true)
		expect(result.data).toEqual([])
		expect(Array.isArray(result.data)).toBe(true)
	})

	it("debe manejar errores de base de datos", async () => {
		const { prisma } = require("@/lib/prisma")
		const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

		prisma.pharmacy.findMany.mockRejectedValue(new Error("Database connection error"))

		const result = await getPharmacies()

		expect(result.success).toBe(false)
		expect(result.error).toBe("Error al obtener farmacias")
		expect(consoleErrorSpy).toHaveBeenCalled()

		consoleErrorSpy.mockRestore()
	})

	it("debe incluir relaciones de región y ciudad", async () => {
		const { prisma } = require("@/lib/prisma")
		prisma.pharmacy.findMany.mockResolvedValue(mockPharmacies)

		const result = await getPharmacies()

		expect(result.success).toBe(true)
		expect(result.data?.[0]).toHaveProperty("region")
		expect(result.data?.[0]).toHaveProperty("city")
		expect(result.data?.[0].region).toHaveProperty("name", "Metropolitana")
	})

	it("debe ordenar por fecha de creación descendente", async () => {
		const { prisma } = require("@/lib/prisma")
		prisma.pharmacy.findMany.mockResolvedValue(mockPharmacies)

		await getPharmacies()

		expect(prisma.pharmacy.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				orderBy: {
					createdAt: "desc",
				},
			})
		)
	})
})
