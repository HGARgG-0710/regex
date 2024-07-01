import { TokenType, TokenInstance } from "@hgargg-0710/parsers.js"

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
