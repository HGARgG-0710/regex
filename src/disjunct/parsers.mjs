import {
	BasicParser,
	PredicateMap,
	TypeMap,
	forward,
	limit
} from "@hgargg-0710/parsers.js"
import { Pipe } from "../chars/tokens.mjs"
import { Disjunction, DisjunctionArgument } from "./tokens.mjs"

import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export const limitPipe = limit((input) => !Pipe.is(input.curr()))

export const DisjunctionTokenizer = BasicParser(
	TypeMap(PredicateMap)(
		new Map([[Pipe, forward]]),
		trivialCompose(ouptut, DisjunctionArgument, (input) => limitPipe(input, []))
	)
)

export const DisjunctionParser = BasicParser(
	TypeMap(PredicateMap)(new Map([]), function (input, parser) {
		if (Pipe.is(input.curr())) {
			if (input.pos) {
				input.prev()
				const first = input.next()
				input.next() // |
				return Disjunction([first, ...parser(input)])
			}
			input.next()
			return Disjunction(parser(input))
		}
		const curr = input.next()
		if (Pipe.is(input.curr())) return []
		return [curr]
	})
)
