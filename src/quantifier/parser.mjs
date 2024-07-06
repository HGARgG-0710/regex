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
	read
} from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"

import { ClBrace, Comma, OpBrace, Plus, QMark, Star } from "../chars/tokens.mjs"
import { NOnly, NPlus, NtoM, OnePlus, Optional, ZeroPlus } from "./tokens.mjs"

const { trivialCompose } = _f

export const limitBraced = limit((input) => !ClBrace.is(input.curr()))

const _readNumber = read(trivialCompose((x) => !x, isNaN, Token.value, current))
export const readNumber = (input) =>
	_readNumber(input, TokenSource({ value: "" })).value.value

export function HandleBraced(input) {
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

export const BraceHandler = wrapped(
	trivialCompose(HandleBraced, InputStream, (input) => limitBraced(input))
)
export function HandleQMark(input) {
	input.next()
	return OutOptional
}

export function HandleStar(input) {
	input.next()
	return OutZeroPlus
}

export function HandlePlus(input) {
	input.next()
	return OutOnePlus
}

export const QuantifierHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[OpBrace, BraceHandler],
			[QMark, HandleQMark],
			[Star, HandleStar],
			[Plus, HandlePlus]
		]),
		() => output
	)
)

export const QuantifierParser = BasicParser(function (input) {
	const curr = input.next()
	return QuantifierHandler(input)(curr)
})
