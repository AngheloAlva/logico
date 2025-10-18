import { auth } from "@/lib/auth"

const USERS = [
	{
		email: "admin@logico.test",
		password: "Admin123!",
		name: "Administrador Principal",
		role: "admin",
	},
	{
		email: "operadora@logico.test",
		password: "User123!",
		name: "Operadora del Sistema",
		role: "operadora",
	},
	{
		email: "operadora2@logico.test",
		password: "User123!",
		name: "Operadora 2",
		role: "operadora",
	},
]

async function createUsers() {
	console.log("👥 Iniciando creación de usuarios de prueba...\n")

	let created = 0

	for (const userData of USERS) {
		try {
			await auth.api.signUpEmail({
				body: {
					name: userData.name,
					email: userData.email,
					password: userData.password,
				},
			})

			console.log(`✅ Usuario creado: ${userData.email}`)
			console.log(`   - Nombre: ${userData.name}`)
			console.log(`   - Rol: ${userData.role}`)
			console.log(`   - Contraseña: ${userData.password}\n`)
			created++
		} catch (error) {
			console.error(`❌ Error creando usuario ${userData.email}:`, error)
		}
	}

	console.log("=".repeat(50))
	console.log("📊 RESUMEN")
	console.log("=".repeat(50))
	console.log(`✅ Usuarios creados: ${created}`)
	console.log(`📋 Total procesado: ${USERS.length}`)
	console.log("=".repeat(50))

	if (created > 0) {
		console.log("\n🎉 ¡Usuarios creados exitosamente!")
		console.log("\nCredenciales de acceso:")
		console.log("-".repeat(50))
		USERS.forEach((user) => {
			console.log(`${user.email} / ${user.password} (${user.role})`)
		})
		console.log("-".repeat(50))
	}
}

async function main() {
	try {
		await createUsers()
	} catch (error) {
		console.error("❌ Error fatal durante la creación de usuarios:", error)
		process.exit(1)
	}
}

main()
