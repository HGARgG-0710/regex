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

export function HandleQMark(input) {
	input.next()
	return OutNoGreedy
}

export const QuantifierHandler = TableParser(
	TypeMap(PredicateMap)(new Map([[QMark, HandleQMark]]), () => output)
)

export function HandleQuantifier(input) {
	const curr = input.next()
	return QuantifierHandler(input)(curr)
}

export const noGreedyMap = PredicateMap(
	new Map([[isQuantifier, HandleQuantifier]]),
	forward
)

export const ParseNoGreedy = BasicParser(noGreedyMap)
