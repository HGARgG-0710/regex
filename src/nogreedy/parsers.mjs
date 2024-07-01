import {
	BasicParser,
	PredicateMap,
	TableParser,
	TypeMap,
	forward
} from "@hgargg-0710/parsers.js"
import { QMark } from "../chars/tokens.mjs"
import { NoGreedy, isQuantifier } from "./tokens.mjs"

export const NonEscapeHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[
				QMark,
				function (input) {
					input.next()
					return NoGreedy
				}
			]
		]),
		() => output
	)
)

export const noGreedyMap = TypeMap(PredicateMap)(
	new Map([
		[
			isQuantifier,
			function (input) {
				const curr = input.next()
				return NonEscapeHandler(input)(curr)
			}
		]
	]),
	forward
)

export const ParseNoGreedy = BasicParser(noGreedyMap)
