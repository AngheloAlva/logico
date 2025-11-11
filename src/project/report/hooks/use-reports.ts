"use client"

import { useQuery } from "@tanstack/react-query"
import { getDailyReport } from "../actions/get-daily-report"
import { getStatistics } from "../actions/get-statistics"
import { getDriverPerformance } from "../actions/get-driver-performance"

// Query Keys
export const reportKeys = {
	all: ["reports"] as const,
	daily: (date: Date, pharmacyId?: string) => [...reportKeys.all, "daily", date, pharmacyId] as const,
	statistics: () => [...reportKeys.all, "statistics"] as const,
	driverPerformance: (startDate: Date, endDate: Date) =>
		[...reportKeys.all, "driver-performance", startDate, endDate] as const,
}

// Hook para obtener reporte diario
export function useDailyReport(date: Date, pharmacyId?: string) {
	return useQuery({
		queryKey: reportKeys.daily(date, pharmacyId),
		queryFn: () => getDailyReport(date, pharmacyId),
	})
}

// Hook para obtener estadísticas
export function useStatistics() {
	return useQuery({
		queryKey: reportKeys.statistics(),
		queryFn: () => getStatistics(),
	})
}

// Hook para obtener rendimiento de motorista
export function useDriverPerformance(startDate: Date, endDate: Date) {
	return useQuery({
		queryKey: reportKeys.driverPerformance(startDate, endDate),
		queryFn: () => getDriverPerformance(startDate, endDate),
		enabled: !!startDate && !!endDate,
	})
}
