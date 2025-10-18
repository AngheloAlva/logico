import { driverSchema } from '../driver.schema'

describe('driverSchema', () => {
	describe('Validación exitosa', () => {
		it('debe validar un motorista con todos los campos', () => {
			const validDriver = {
				name: 'Carlos Pérez',
				rut: '12345678-9',
				email: 'carlos@logico.cl',
				phone: '+56987654321',
				address: 'Calle Test 123',
				regionId: '123e4567-e89b-12d3-a456-426614174000',
				cityId: '123e4567-e89b-12d3-a456-426614174001',
				active: true,
			}

			const result = driverSchema.safeParse(validDriver)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data).toEqual(validDriver)
			}
		})

		it('debe validar motorista con campos opcionales omitidos', () => {
			const minimalDriver = {
				name: 'Carlos Pérez',
				rut: '12345678-9',
				email: 'carlos@logico.cl',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(minimalDriver)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data.active).toBe(true) // default value
			}
		})
	})

	describe('Validación de nombre', () => {
		it('debe rechazar nombre muy corto', () => {
			const driver = {
				name: 'AB',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					'El nombre debe tener al menos 3 caracteres'
				)
			}
		})

		it('debe aceptar nombre de 3 caracteres', () => {
			const driver = {
				name: 'Ana',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(true)
		})
	})

	describe('Validación de RUT', () => {
		it('debe rechazar RUT muy corto', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345',
				email: 'test@test.cl',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('RUT inválido')
			}
		})

		it('debe aceptar RUT con formato chileno válido', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(true)
		})
	})

	describe('Validación de email', () => {
		it('debe rechazar email sin formato correcto', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'notanemail',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Email inválido')
			}
		})

		it('debe aceptar email válido', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'valid@email.com',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(true)
		})
	})

	describe('Validación de teléfono', () => {
		it('debe rechazar teléfono muy corto', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '123',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Teléfono inválido')
			}
		})

		it('debe aceptar teléfono chileno válido', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(true)
		})
	})

	describe('Validación de campo active', () => {
		it('debe tener valor default true cuando no se proporciona', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data.active).toBe(true)
			}
		})

		it('debe aceptar active como false', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '+56987654321',
				active: false,
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data.active).toBe(false)
			}
		})
	})

	describe('Validación de campos opcionales', () => {
		it('debe aceptar motorista sin dirección', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '+56987654321',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(true)
		})

		it('debe validar UUIDs cuando se proporcionan', () => {
			const driver = {
				name: 'Carlos',
				rut: '12345678-9',
				email: 'test@test.cl',
				phone: '+56987654321',
				regionId: 'not-a-uuid',
			}

			const result = driverSchema.safeParse(driver)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('ID de región inválido')
			}
		})
	})
})
