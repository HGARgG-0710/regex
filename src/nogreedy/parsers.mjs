import {
	BasicParser,
	PredicateMap,
	TableParser,
	TypeMap,
	forward,
	output
} from "@hgargg-0710/parsers.js"
import { QMark } from "../chars/tokens.mjs"
import { NoGreedy, isQuantifier } from "./tokens.mjs"
import { trivialCompose } from "@hgargg-0710/one/src/functions/functions.mjs"

const OutNoGreedy = trivialCompose(output, NoGreedy)

export const NonEscapeHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[
				QMark,
				function (input) {
					input.next()
					return OutNoGreedy
				}
			]
		]),
		() => output
	)
)

export const noGreedyMap = PredicateMap(
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
