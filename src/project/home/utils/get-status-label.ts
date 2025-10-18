export const getStatusLabel = (status: string) => {
	const labels: Record<string, string> = {
		PENDING: "Pendiente",
		IN_TRANSIT: "En Tránsito",
		DELIVERED: "Entregado",
		INCIDENT: "Incidencia",
	}
	return labels[status] || status
}
