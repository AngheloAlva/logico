import { QueryClient } from "@tanstack/react-query"

export function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minuto
				gcTime: 5 * 60 * 1000, // 5 minutos (antes cacheTime)
				retry: 1,
				refetchOnWindowFocus: false,
			},
			mutations: {
				retry: 0,
			},
		},
	})
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: siempre crea un nuevo query client
		return makeQueryClient()
	} else {
		// Browser: crea el query client si no existe
		if (!browserQueryClient) browserQueryClient = makeQueryClient()
		return browserQueryClient
	}
}
