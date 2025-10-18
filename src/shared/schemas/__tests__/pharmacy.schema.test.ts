import { pharmacySchema } from '../pharmacy.schema'

describe('pharmacySchema', () => {
	describe('Validación exitosa', () => {
		it('debe validar un objeto de farmacia completo y válido', () => {
			const validPharmacy = {
				name: 'Farmacia Test',
				address: 'Av. Siempre Viva 742',
				contactName: 'Juan Pérez',
				contactPhone: '+56912345678',
				contactEmail: 'juan@farmacia.cl',
				regionId: '123e4567-e89b-12d3-a456-426614174000',
				cityId: '123e4567-e89b-12d3-a456-426614174001',
			}

			const result = pharmacySchema.safeParse(validPharmacy)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data).toEqual(validPharmacy)
			}
		})
	})

	describe('Validación de nombre', () => {
		it('debe rechazar nombre muy corto', () => {
			const pharmacy = {
				name: 'AB',
				address: 'Dirección válida',
				contactName: 'Juan Pérez',
				contactPhone: '+56912345678',
				contactEmail: 'test@test.cl',
				regionId: '123e4567-e89b-12d3-a456-426614174000',
				cityId: '123e4567-e89b-12d3-a456-426614174001',
			}

			const result = pharmacySchema.safeParse(pharmacy)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					'El nombre debe tener al menos 3 caracteres'
				)
			}
		})

		it('debe aceptar nombre de 3 caracteres', () => {
			const pharmacy = {
				name: 'ABC',
				address: 'Dirección válida',
				contactName: 'Juan Pérez',
				contactPhone: '+56912345678',
				contactEmail: 'test@test.cl',
				regionId: '123e4567-e89b-12d3-a456-426614174000',
				cityId: '123e4567-e89b-12d3-a456-426614174001',
			}

			const result = pharmacySchema.safeParse(pharmacy)
			expect(result.success).toBe(true)
		})
	})

	describe('Validación de dirección', () => {
		it('debe rechazar dirección muy corta', () => {
			const pharmacy = {
				name: 'Farmacia',
				address: 'Dir',
				contactName: 'Juan Pérez',
				contactPhone: '+56912345678',
				contactEmail: 'test@test.cl',
				regionId: '123e4567-e89b-12d3-a456-426614174000',
				cityId: '123e4567-e89b-12d3-a456-426614174001',
			}

			const result = pharmacySchema.safeParse(pharmacy)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					'La dirección debe tener al menos 5 caracteres'
				)
			}
		})
	})

	describe('Validación de email', () => {
		it('debe rechazar email inválido', () => {
			const pharmacy = {
				name: 'Farmacia',
				address: 'Dirección válida',
				contactName: 'Juan Pérez',
				contactPhone: '+56912345678',
				contactEmail: 'notanemail',
				regionId: '123e4567-e89b-12d3-a456-426614174000',
				cityId: '123e4567-e89b-12d3-a456-426614174001',
			}

			const result = pharmacySchema.safeParse(pharmacy)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Email inválido')
			}
		})

		it('debe aceptar email válido', () => {
			const pharmacy = {
				name: 'Farmacia',
				address: 'Dirección válida',
				contactName: 'Juan Pérez',
				contactPhone: '+56912345678',
				contactEmail: 'valid@email.com',
				regionId: '123e4567-e89b-12d3-a456-426614174000',
				cityId: '123e4567-e89b-12d3-a456-426614174001',
			}

			const result = pharmacySchema.safeParse(pharmacy)
			expect(result.success).toBe(true)
		})
	})

	describe('Validación de UUIDs', () => {
		it('debe rechazar regionId con formato incorrecto', () => {
			const pharmacy = {
				name: 'Farmacia',
				address: 'Dirección válida',
				contactName: 'Juan Pérez',
				contactPhone: '+56912345678',
				contactEmail: 'test@test.cl',
				regionId: 'not-a-uuid',
				cityId: '123e4567-e89b-12d3-a456-426614174001',
			}

			const result = pharmacySchema.safeParse(pharmacy)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('ID de región inválido')
			}
		})

		it('debe rechazar cityId con formato incorrecto', () => {
			const pharmacy = {
				name: 'Farmacia',
				address: 'Dirección válida',
				contactName: 'Juan Pérez',
				contactPhone: '+56912345678',
				contactEmail: 'test@test.cl',
				regionId: '123e4567-e89b-12d3-a456-426614174000',
				cityId: 'not-a-uuid',
			}

			const result = pharmacySchema.safeParse(pharmacy)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('ID de ciudad inválido')
			}
		})
	})

	describe('Validación de campos faltantes', () => {
		it('debe rechazar objeto sin campos requeridos', () => {
			const pharmacy = {}

			const result = pharmacySchema.safeParse(pharmacy)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThan(0)
			}
		})
	})
})
