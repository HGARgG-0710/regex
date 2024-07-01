import {
	BasicMap,
	BasicParser,
	PredicateMap,
	TypeMap,
	ValueMap,
	forward,
	limit,
	wrapped
} from "@hgargg-0710/parsers.js"
import { Escape, Hyphen, RectCl } from "../chars/tokens.mjs"
import { CharacterClass, ClassRange, NegCharacterClass } from "./tokens.mjs"
import { BackspaceClass } from "../escaped/tokens.mjs"
import { escapedMap } from "../escaped/parser..mjs"

export const classLimit = limit((input) => !RectCl.is(input.curr()))

export const InClassEscapedHandler = ValueMap(BasicMap)(
	new Map([["b", BackspaceClass]]),
	(curr, input) => escapedMap.index(curr)(curr, input)
)

export const ClassHandler = TypeMap(PredicateMap)(
	new Map([
		[
			Escape,
			function (input) {
				input.next() // \
				const toEscape = input.next()
				return [InClassEscapedHandler.index(toEscape)(toEscape, input)]
			}
		]
	]),
	function (input) {
		const current = input.next()
		if (Hyphen.is(input.curr())) {
			input.next()
			return [ClassRange([current, input.next()])]
		}
		return [current]
	}
)

export const handleClass = BasicParser(ClassHandler)

export const classMap = TypeMap(PredicateMap)(
	new Map([
		[
			RectOp,
			wrapped(function (input) {
				const isNegative = Xor.is(input.curr())
				const ClassType = isNegative ? NegCharacterClass : CharacterClass
				if (isNegative) input.next()
				return [ClassType(handleClass(InputStream(classLimit(input))))]
			})
		]
	]),
	forward
)

export const CharacterClassParser = BasicParser(classMap)
