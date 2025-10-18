import '@testing-library/jest-dom'

declare global {
	namespace jest {
		interface Matchers<R> {
			toBeInTheDocument(): R
			toHaveAttribute(attr: string, value?: string): R
			toBeDisabled(): R
			toHaveClass(...classNames: string[]): R
			toHaveTextContent(text: string | RegExp): R
		}
	}
}

export {}
