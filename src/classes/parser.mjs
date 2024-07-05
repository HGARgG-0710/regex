import {
	BasicMap,
	BasicParser,
	PredicateMap,
	TypeMap,
	ValueMap,
	forward,
	limit,
	wrapped,
	InputStream
} from "@hgargg-0710/parsers.js"
import { Escape, Hyphen, RectOp, RectCl, Xor } from "../chars/tokens.mjs"
import { CharacterClass, ClassRange, NegCharacterClass } from "./tokens.mjs"
import { BackspaceClass } from "../escaped/tokens.mjs"
import { escapedMap } from "../escaped/parser.mjs"

export const classLimit = limit((input) => !RectCl.is(input.curr()))

export const InClassEscapedHandler = ValueMap(BasicMap)(
	new Map([["b", BackspaceClass]]),
	(curr, input) => escapedMap.index(curr)(curr, input)
)

export function HandleEscaped(input) {
	input.next() // \
	const toEscape = input.next()
	return [InClassEscapedHandler.index(toEscape)(toEscape, input)]
}

export function HandleRegular(input) {
	const current = input.next()
	if (Hyphen.is(input.curr())) {
		input.next()
		return [ClassRange([current, input.next()])]
	}
	return [current]
}

export const parseClass = BasicParser(
	TypeMap(PredicateMap)(new Map([[Escape, HandleEscaped]]), HandleRegular)
)

export const HandleClass = wrapped(function (input) {
	const isNegative = Xor.is(input.curr())
	const ClassType = isNegative ? NegCharacterClass : CharacterClass
	if (isNegative) input.next()
	return [ClassType(parseClass(InputStream(classLimit(input))))]
})

export const classMap = TypeMap(PredicateMap)(new Map([[RectOp, HandleClass]]), forward)

export const CharacterClassParser = BasicParser(classMap)
