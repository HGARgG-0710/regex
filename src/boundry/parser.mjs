import {
	BasicParser,
	PredicateMap,
	TypeMap,
	forward,
	next,
	output
} from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"

import { Escaped, NonWordBoundry } from "../escaped/tokens.mjs"
import { Dollar, Xor } from "../chars/tokens.mjs"
import { PatternEnd, PatternStart } from "./tokens.mjs"

const { trivialCompose } = _f

export const boundryParser = TypeMap(PredicateMap)(
	new Map(
		[
			[
				Escaped,
				function (input) {
					const curr = input.next()
					if (curr.value === "B") return NonWordBoundry()
					return curr
				}
			],
			...[
				[Xor, PatternStart],
				[Dollar, PatternEnd]
			].map(([Key, Token]) => [Key, trivialCompose(Token, next)])
		].map(([Key, Out]) => [Key, trivialCompose(output, Out)])
	),
	forward
)

export const BoundryParser = BasicParser(boundryParser)
