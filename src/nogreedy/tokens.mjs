import { function as _f } from "@hgargg-0710/one"
import { TokenType, is } from "@hgargg-0710/parsers.js"
import { NOnly, NPlus, NtoM, OnePlus, Optional, ZeroPlus } from "../quantifier/tokens.mjs"

const { or } = _f

export const NoGreedy = TokenType("nogreedy")
export const isQuantifier = or(
	...[ZeroPlus, OnePlus, Optional, NOnly, NPlus, NtoM].map(is)
)
