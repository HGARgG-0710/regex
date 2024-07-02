import { BasicMap } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"

import {
	CaseInsensitive,
	DotAll,
	Flags,
	GlobalSearch,
	MatchIndicies,
	Multiline,
	Sticky,
	Unicode,
	UnicodeSets
} from "./tokens.mjs"

const { trivialCompose } = _f

export const flagTable = BasicMap(
	new Map([
		["d", MatchIndicies],
		["g", GlobalSearch],
		["i", CaseInsensitive],
		["m", Multiline],
		["s", DotAll],
		["u", Unicode],
		["v", UnicodeSets],
		["y", Sticky]
	])
)

// ! REFACTOR INTO 'parsers.js' v0.3!
const fromTable = (map) => (x) => map.index(x)(x)

export const flagInstance = fromTable(flagTable)

export const identifyFlags = (x) => x.map(flagInstance)

export const DeFlag = trivialCompose(
	(x) =>
		Flags(
			((i) => ({
				flags: identifyFlags(x.slice(0, i).reverse()),
				expression: x
					.slice(i + 1, x.length - 1)
					.reverse()
					.join("")
			}))(x.indexOf("/"))
		),
	(x) => x.split("").reverse()
)
