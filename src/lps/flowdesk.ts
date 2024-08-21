import { readPdf } from "@/lib/pdf"

export const parseFlowdeskTransactionReport = async (
	files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined
) => {
	if (!files) throw new Error("No files found")
	if (!Array.isArray(files)) throw new Error("Files not in array format")

	const fileArr = await readPdf(files[0])

	const [m, d, y] = fileArr[3].split("/")
	console.log(m, d, y)

	const date = String(Math.floor(new Date(`${y}-${m}-${d}T00:00:00Z`).getTime() / 1000))
	const coin = fileArr[13]
	const side = fileArr[15]
	const quantity = parseFloat(fileArr[17].replace(/,/g, "")).toString()
	const price = parseFloat(fileArr[19].replace(/,/g, "")).toString()
	const settlementCurrency = fileArr[21]
	const notional = parseFloat(fileArr[23].replace(/,/g, "")).toString()

	const report: string[][] = []
	report.push(
		["LP", "Flowdesk"],
		["Date", date],
		["Coin", coin],
		["Side", side],
		["Quantity", quantity],
		["Price", price],
		["Settlement Currency", settlementCurrency],
		["Notional", notional]
	)

	return report
}
