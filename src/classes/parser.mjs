import {
	BasicMap,
	BasicParser,
	PredicateMap,
	TypeMap,
	ValueMap,
	forward,
	limit,
	wrapped,
	InputStream,
	output
} from "@hgargg-0710/parsers.js"
import { Escape, Hyphen, RectOp, RectCl, Xor } from "../chars/tokens.mjs"
import { CharacterClass, ClassRange, NegCharacterClass } from "./tokens.mjs"
import { BackspaceClass } from "../escaped/tokens.mjs"
import { escapedHandler, escapedMap } from "../escaped/parser.mjs"

import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export const classLimit = limit((input) => !RectCl.is(input.curr()))

export const InClassEscapedHandler = ValueMap(BasicMap)(
	new Map([["b", BackspaceClass]]),
	(curr, input) => escapedMap.index(curr)(curr, input)
)

export function HandleRange(input) {
	const curr = input.next()
	if (Hyphen.is(input.curr())) {
		input.next() // -
		return ClassRange([curr, input.next()])
	}
	return curr
}

export const IdentifyRanges = BasicParser(trivialCompose(output, HandleRange))

export const HandleEscaped = escapedHandler(InClassEscapedHandler)

export const EscapeInner = BasicParser(
	TypeMap(PredicateMap)(
		new Map([[Escape, trivialCompose(output, HandleEscaped)]]),
		forward
	)
)

export const ClassHandler = trivialCompose(
	IdentifyRanges,
	InputStream,
	EscapeInner,
	InputStream,
	classLimit
)

export const HandleClass = wrapped(function (input) {
	const isNegative = Xor.is(input.curr())
	const ClassType = isNegative ? NegCharacterClass : CharacterClass
	if (isNegative) input.next()
	return ClassType(ClassHandler(input))
})

export const classMap = TypeMap(PredicateMap)(
	new Map([[RectOp, trivialCompose(output, HandleClass)]]),
	forward
)

export const CharacterClassParser = BasicParser(classMap)
