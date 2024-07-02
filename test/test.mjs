import { parse } from "../regex.mjs"
import { writeFile } from "fs/promises"

const parseTests = [
	"//",
	"//vgiysdum",
	"/ababaac/gi"
	// TODO: for EACH and every layer, WRITE A TEST! After - make complex tests that handle "combination" cases, multiple in a single one.
]

writeFile("out.json", JSON.stringify(parseTests.map(parse)))
