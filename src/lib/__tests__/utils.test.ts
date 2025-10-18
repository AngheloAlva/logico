import { cn } from '../utils'

describe('cn utility function', () => {
	it('debe combinar clases simples', () => {
		const result = cn('class1', 'class2')
		expect(result).toBe('class1 class2')
	})

	it('debe manejar clases condicionales', () => {
		const result = cn('base', true && 'conditional', false && 'not-included')
		expect(result).toBe('base conditional')
	})

	it('debe manejar arrays de clases', () => {
		const result = cn(['class1', 'class2'], 'class3')
		expect(result).toBe('class1 class2 class3')
	})

	it('debe manejar objetos con clases condicionales', () => {
		const result = cn({
			base: true,
			active: true,
			disabled: false,
		})
		expect(result).toBe('base active')
	})

	it('debe fusionar clases de Tailwind conflictivas', () => {
		// tailwind-merge debe mantener solo la última clase del mismo grupo
		const result = cn('px-2', 'px-4')
		expect(result).toBe('px-4')
	})

	it('debe manejar valores undefined y null', () => {
		const result = cn('class1', undefined, null, 'class2')
		expect(result).toBe('class1 class2')
	})

	it('debe manejar strings vacíos', () => {
		const result = cn('', 'class1', '', 'class2')
		expect(result).toBe('class1 class2')
	})

	it('debe combinar clases de Tailwind sin conflicto', () => {
		const result = cn('text-red-500', 'bg-blue-500', 'p-4')
		expect(result).toBe('text-red-500 bg-blue-500 p-4')
	})

	it('debe manejar casos complejos de uso real', () => {
		const isActive = true
		const isDisabled = false
		const variant = 'primary'

		const result = cn(
			'base-class',
			isActive && 'active-class',
			isDisabled && 'disabled-class',
			{
				'primary-variant': variant === 'primary',
				'secondary-variant': variant === 'secondary',
			}
		)

		expect(result).toBe('base-class active-class primary-variant')
	})
})
