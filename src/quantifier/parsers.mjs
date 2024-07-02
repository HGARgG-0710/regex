import {
	BasicParser,
	InputStream,
	PredicateMap,
	TableParser,
	TypeMap,
	wrapped,
	limit,
	Token,
	current,
	TokenSource,
	output,
	read, 
} from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"

import { ClBrace, Comma, OpBrace, Plus, QMark, Star } from "../chars/tokens.mjs"
import { NOnly, NPlus, NtoM, OnePlus, Optional, ZeroPlus } from "./tokens.mjs"

const { trivialCompose } = _f

export const limitBraced = limit((input) => !ClBrace.is(input.curr()))

const _readNumber = read(trivialCompose((x) => !x, isNaN, Token.value, current))
export const readNumber = (input) => _readNumber(input, TokenSource({ value: "" })).value

export const handleBraced = (input) => {
	const first = readNumber(input)
	if (Comma.is(input.curr())) {
		input.next()
		if (input.isEnd()) return (argument) => [NPlus({ argument, range: first })]
		return (argument) => [
			NtoM({
				argument,
				range: [first, readNumber(input)]
			})
		]
	}
	return (argument) => [NOnly({ argument, range: first })]
}

const [OutOptional, OutZeroPlus, OutOnePlus] = [Optional, ZeroPlus, OnePlus].map((f) =>
	trivialCompose(output, f)
)

export const NonEscapeHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[
				OpBrace,
				wrapped(
					trivialCompose(handleBraced, InputStream, (input) =>
						limitBraced(input)
					)
				)
			],
			[
				QMark,
				function (input) {
					input.next()
					return OutOptional
				}
			],
			[
				Star,
				function (input) {
					input.next()
					return OutZeroPlus
				}
			],
			[
				Plus,
				function (input) {
					input.next()
					return OutOnePlus
				}
			]
		]),
		() => output
	)
)

export const QuantifierParser = BasicParser(function (input) {
	const curr = input.next()
	return NonEscapeHandler(input)(curr)
})
