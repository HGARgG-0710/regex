import { parse } from "../regex.mjs"
import { writeFile } from "fs/promises"

const parseTests = [
	"//",
	"//vgiysdum",
	"/ababaac/gi",
	"/[anx-triglf\\b\\B\\[()]/ms",
	"/([A-Fsimu]+)*?/",
	"/^baemo|((?:aee..ro.|limili??)|P+?3*K{2}S{2, 7})+|||\\BRs\\bK\\B[^BU\\\\SAl]\\b$/m"
	// ! Left to test: 
	// * 1. \u
	// * 2. \p
	// * 3. backreferences (named and unnamed)
	// * 4. lookaheads (positive and negative)
	// * 5. lookbehinds (positive and negative)
	// * 6. character classes
	// * 7. named capture
]

writeFile("out.json", JSON.stringify(parseTests.map(parse)))
