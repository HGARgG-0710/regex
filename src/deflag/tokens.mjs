import { TokenType, TokenInstance, is } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"

const { or } = _f

// * TokenTypes
export const [Flags, Expression] = ["flags", "expression"].map(TokenType)

// * TokenInstances (flags)
export const [
	MatchIndicies,
	GlobalSearch,
	CaseInsensitive,
	Multiline,
	DotAll,
	Unicode,
	UnicodeSets,
	Sticky
] = [
	"indicies",
	"global",
	"case-insensitive",
	"multiline",
	"dot-all",
	"unicode",
	"unicode-sets",
	"sticky"
].map(TokenInstance)
