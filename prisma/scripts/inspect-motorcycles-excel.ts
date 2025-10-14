import * as XLSX from "xlsx"
import path from "path"

async function inspectExcel() {
	console.log("📊 Inspeccionando archivo Excel de permisos de circulación...")

	const excelPath = path.join(
		process.cwd(),
		"base-data",
		"permiso-de-circulacion-2023.xlsx"
	)
	console.log(`📁 Leyendo archivo: ${excelPath}`)

	const workbook = XLSX.readFile(excelPath)
	console.log(`📄 Hojas disponibles: ${workbook.SheetNames.join(", ")}`)

	const sheetName = workbook.SheetNames[0]
	console.log(`\n🔍 Inspeccionando hoja: ${sheetName}`)

	const worksheet = workbook.Sheets[sheetName]
	const data: any[] = XLSX.utils.sheet_to_json(worksheet)

	console.log(`📋 Total de filas: ${data.length}`)

	if (data.length > 0) {
		console.log(`\n📝 Columnas encontradas:`)
		const columns = Object.keys(data[0])
		columns.forEach((col, idx) => {
			console.log(`  ${idx + 1}. ${col}`)
		})

		console.log(`\n📋 Muestra de la primera fila:`)
		console.log(JSON.stringify(data[0], null, 2))

		if (data.length > 1) {
			console.log(`\n📋 Muestra de la segunda fila:`)
			console.log(JSON.stringify(data[1], null, 2))
		}
	}
}

inspectExcel()
