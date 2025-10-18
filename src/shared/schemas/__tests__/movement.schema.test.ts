import { movementSchema, incidentSchema } from '../movement.schema'

describe('movementSchema', () => {
	describe('Validación exitosa', () => {
		it('debe validar un movimiento completo y válido', () => {
			const validMovement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
				hasRecipe: true,
				segments: 2,
				segmentCost: 5000,
				segmentsAddress: ['Dirección 1', 'Dirección 2'],
			}

			const result = movementSchema.safeParse(validMovement)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data).toEqual(validMovement)
			}
		})

		it('debe aceptar movimiento con valores por defecto', () => {
			const minimalMovement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
			}

			const result = movementSchema.safeParse(minimalMovement)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data.hasRecipe).toBe(false)
				expect(result.data.segments).toBe(1)
				expect(result.data.segmentsAddress).toEqual([])
			}
		})
	})

	describe('Validación de número', () => {
		it('debe rechazar número muy corto', () => {
			const movement = {
				number: '123',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					'El número debe tener al menos 10 caracteres'
				)
			}
		})

		it('debe aceptar número de 10 caracteres', () => {
			const movement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(true)
		})
	})

	describe('Validación de IDs', () => {
		it('debe rechazar pharmacyId inválido', () => {
			const movement = {
				number: '1234567890',
				pharmacyId: 'not-a-uuid',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('ID de farmacia inválido')
			}
		})

		it('debe rechazar driverId inválido', () => {
			const movement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: 'not-a-uuid',
				address: 'Av. Principal 123',
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('ID de motorista inválido')
			}
		})
	})

	describe('Validación de dirección', () => {
		it('debe rechazar dirección muy corta', () => {
			const movement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av',
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					'La dirección debe tener al menos 5 caracteres'
				)
			}
		})
	})

	describe('Validación de segments', () => {
		it('debe rechazar segments negativos', () => {
			const movement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
				segments: -1,
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(false)
		})

		it('debe rechazar segments con decimales', () => {
			const movement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
				segments: 1.5,
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(false)
		})
	})

	describe('Validación de segmentCost', () => {
		it('debe rechazar costo negativo', () => {
			const movement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
				segmentCost: -100,
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('El costo debe ser positivo')
			}
		})

		it('debe aceptar costo positivo', () => {
			const movement = {
				number: '1234567890',
				pharmacyId: '123e4567-e89b-12d3-a456-426614174000',
				driverId: '123e4567-e89b-12d3-a456-426614174001',
				address: 'Av. Principal 123',
				segmentCost: 5000,
			}

			const result = movementSchema.safeParse(movement)
			expect(result.success).toBe(true)
		})
	})
})

describe('incidentSchema', () => {
	describe('Validación exitosa', () => {
		it('debe validar una incidencia completa y válida', () => {
			const validIncident = {
				movementId: '123e4567-e89b-12d3-a456-426614174000',
				type: 'cliente_no_encontrado',
				description: 'El cliente no estaba en la dirección indicada',
			}

			const result = incidentSchema.safeParse(validIncident)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data).toEqual(validIncident)
			}
		})
	})

	describe('Validación de movementId', () => {
		it('debe rechazar movementId inválido', () => {
			const incident = {
				movementId: 'not-a-uuid',
				type: 'cliente_no_encontrado',
				description: 'Descripción de la incidencia',
			}

			const result = incidentSchema.safeParse(incident)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('ID de movimiento inválido')
			}
		})
	})

	describe('Validación de tipo', () => {
		it('debe aceptar todos los tipos válidos', () => {
			const validTypes = [
				'direccion_erronea',
				'cliente_no_encontrado',
				'reintento',
				'cobro_rechazado',
				'otro',
			]

			validTypes.forEach((type) => {
				const incident = {
					movementId: '123e4567-e89b-12d3-a456-426614174000',
					type,
					description: 'Descripción de la incidencia',
				}

				const result = incidentSchema.safeParse(incident)
				expect(result.success).toBe(true)
			})
		})

		it('debe rechazar tipo no permitido', () => {
			const incident = {
				movementId: '123e4567-e89b-12d3-a456-426614174000',
				type: 'tipo_invalido',
				description: 'Descripción de la incidencia',
			}

			const result = incidentSchema.safeParse(incident)
			expect(result.success).toBe(false)
		})
	})

	describe('Validación de descripción', () => {
		it('debe rechazar descripción muy corta', () => {
			const incident = {
				movementId: '123e4567-e89b-12d3-a456-426614174000',
				type: 'otro',
				description: 'Corta',
			}

			const result = incidentSchema.safeParse(incident)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					'La descripción debe tener al menos 10 caracteres'
				)
			}
		})

		it('debe aceptar descripción de 10 caracteres o más', () => {
			const incident = {
				movementId: '123e4567-e89b-12d3-a456-426614174000',
				type: 'otro',
				description: 'Descripción válida suficiente',
			}

			const result = incidentSchema.safeParse(incident)
			expect(result.success).toBe(true)
		})
	})
})
