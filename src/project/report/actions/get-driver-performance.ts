"use server"

import { prisma } from "@/lib/prisma"

import type { Driver } from "@/generated/prisma"

export async function getDriverPerformance(startDate: Date, endDate: Date) {
	try {
		const movements = await prisma.movement.findMany({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
				status: "DELIVERED",
			},
			include: {
				driver: true,
			},
		})

		// Agrupar por motorista
		const performanceByDriver = movements.reduce(
			(acc, mov) => {
				const driverId = mov.driver.id
				if (!acc[driverId]) {
					acc[driverId] = {
						driver: mov.driver,
						totalDeliveries: 0,
						avgTime: 0,
						times: [],
					}
				}

				acc[driverId].totalDeliveries++

				if (mov.departureDate && mov.deliveryDate) {
					const time = mov.deliveryDate.getTime() - mov.departureDate.getTime()
					acc[driverId].times.push(time)
				}

				return acc
			},
			{} as Record<
				string,
				{ driver: Driver; totalDeliveries: number; avgTime: number; times: number[] }
			>
		)

		// Calcular promedios y formatear resultado
		const result = Object.keys(performanceByDriver).map((driverId) => {
			const data = performanceByDriver[driverId]
			if (data.times.length > 0) {
				const avgTime = data.times.reduce((a: number, b: number) => a + b, 0) / data.times.length
				data.avgTime = Math.round(avgTime / 60000) // en minutos
			}

			return {
				driver: data.driver,
				totalDeliveries: data.totalDeliveries,
				avgTime: data.avgTime,
			}
		})

		return {
			success: true,
			data: result,
		}
	} catch (error) {
		console.error("Error fetching driver performance:", error)
		return { success: false, error: "Error al obtener desempeño de motoristas" }
	}
}
