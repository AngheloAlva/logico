import '@testing-library/jest-dom'

// Mock de Next.js router
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			replace: jest.fn(),
			prefetch: jest.fn(),
			back: jest.fn(),
			pathname: '/',
			query: {},
			asPath: '/',
		}
	},
	usePathname() {
		return '/'
	},
	useSearchParams() {
		return new URLSearchParams()
	},
}))

// Mock de variables de entorno
process.env = {
	...process.env,
	BETTER_AUTH_SECRET: 'test-secret',
	BETTER_AUTH_URL: 'http://localhost:3000',
	DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
}
