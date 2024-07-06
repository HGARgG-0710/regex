import {
	BasicParser,
	PredicateMap,
	TypeMap,
	forward,
	limit,
	output,
	skip,
	InputStream,
	delimited,
	is,
	current,
	preserve
} from "@hgargg-0710/parsers.js"
import { Pipe } from "../chars/tokens.mjs"
import { Disjunction, DisjunctionArgument, EmptyExpression } from "./tokens.mjs"

import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

const isnotPipe = (input) => !Pipe.is(input.curr())
export const [limitPipe, skipTilPipes] = [limit, skip].map((f) => f(isnotPipe))

// TODO: MAKE A PART OF 'parsers.js' v0.3 - the 'has' utility. Then, refactor from there...
export const hasDisjunctions = (stream) => {
	skipTilPipes(stream)
	return !stream.isEnd()
}

export const DisjunctionTokenizer = BasicParser(
	TypeMap(PredicateMap)(
		new Map([[Pipe, forward]]),
		trivialCompose(output, DisjunctionArgument, (input) => limitPipe(input, []))
	)
)

const _disjdelim = delimited(() => true, trivialCompose(is(Pipe), current))

export const DisjunctionDelimiter = (input) => _disjdelim(input, preserve)

export const EmptyFixer = BasicParser(
	TypeMap(PredicateMap)(
		new Map([
			[
				Pipe,
				(input) =>
					[input.next()].concat(
						Pipe.is(input.curr()) ? [EmptyExpression()] : []
					)
			]
		]),
		forward
	)
)

export const DisjunctionParser = trivialCompose(
	Disjunction,
	...[DisjunctionDelimiter, DisjunctionTokenizer, EmptyFixer]
		.map((x) => [x, InputStream])
		.flat()
)
