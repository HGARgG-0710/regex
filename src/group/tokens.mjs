import { TokenType } from "@hgargg-0710/parsers.js"

export const [
	CaptureGroup,
	NoCaptureGroup,
	NamedCapture,
	LookAhead,
	LookBehind,
	NegLookAhead,
	NegLookBehind
] = [
	"capture",
	"non-capture",
	"named-capture",
	"lookahead",
	"lookbehind",
	"neg-lookahead",
	"neg-lookbehind"
].map(TokenType)
