"use client"

import { useQuery } from "@tanstack/react-query"
import { getTodayStats } from "../actions/get-today-stats"
import { getActiveDrivers } from "../actions/get-active-drivers"
import { getIncidentsSummary } from "../actions/get-incidents-summary"
import { getRecentActivity } from "../actions/get-recent-activity"
import { getStatsByPharmacy } from "../actions/get-stats-by-pharmacy"

// Query Keys
export const dashboardKeys = {
	all: ["dashboard"] as const,
	todayStats: () => [...dashboardKeys.all, "today-stats"] as const,
	activeDrivers: () => [...dashboardKeys.all, "active-drivers"] as const,
	incidentsSummary: () => [...dashboardKeys.all, "incidents-summary"] as const,
	recentActivity: () => [...dashboardKeys.all, "recent-activity"] as const,
	statsByPharmacy: () => [...dashboardKeys.all, "stats-by-pharmacy"] as const,
}

// Hook para obtener estadísticas del día
export function useTodayStats() {
	return useQuery({
		queryKey: dashboardKeys.todayStats(),
		queryFn: () => getTodayStats(),
		refetchInterval: 60000, // Refrescar cada minuto
	})
}

// Hook para obtener motoristas activos
export function useActiveDrivers() {
	return useQuery({
		queryKey: dashboardKeys.activeDrivers(),
		queryFn: () => getActiveDrivers(),
		refetchInterval: 30000, // Refrescar cada 30 segundos
	})
}

// Hook para obtener resumen de incidentes
export function useIncidentsSummary() {
	return useQuery({
		queryKey: dashboardKeys.incidentsSummary(),
		queryFn: () => getIncidentsSummary(),
		refetchInterval: 60000, // Refrescar cada minuto
	})
}

// Hook para obtener actividad reciente
export function useRecentActivity() {
	return useQuery({
		queryKey: dashboardKeys.recentActivity(),
		queryFn: () => getRecentActivity(),
		refetchInterval: 30000, // Refrescar cada 30 segundos
	})
}

// Hook para obtener estadísticas por farmacia
export function useStatsByPharmacy() {
	return useQuery({
		queryKey: dashboardKeys.statsByPharmacy(),
		queryFn: () => getStatsByPharmacy(),
		refetchInterval: 60000, // Refrescar cada minuto
	})
}
