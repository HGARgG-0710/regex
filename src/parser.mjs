import { InputStream, StringPattern } from "@hgargg-0710/parsers.js"
import { DeFlag } from "./deflag/parser.mjs"
import { function as _f } from "@hgargg-0710/one"
import { ExpressionTokenizer } from "./chars/parser.mjs"
import { CharacterClassParser } from "./classes/parsers.mjs"
import { EndParser } from "./group/parser.mjs"
import { EscapedParser } from "./escaped/parser..mjs"
import { BoundryParser } from "./boundry/parser.mjs"

const { trivialCompose } = _f

export const ExpressionParser = trivialCompose(
	...[EndParser, BoundryParser, EscapedParser, CharacterClassParser]
		.map((x) => [x, InputStream])
		.flat(),
	(x) => x.value.map((x) => ({ ...x, value: x.value.value })),
	ExpressionTokenizer,
	StringPattern
)

export default trivialCompose(
	(deflagged) => ({
		...deflagged,
		value: {
			...deflagged.value,
			expression: ExpressionParser(deflagged.value.expression)
		}
	}),
	DeFlag
)
