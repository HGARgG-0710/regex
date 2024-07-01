import { TokenType } from "@hgargg-0710/parsers.js"

export const [
	CaptureGroup,
	NoCaptureGroup,
	NamedCapture,
	LookAheadSingle,
	LookBehindSingle,
	NegLookAheadSingle,
	NegLookBehindSingle
] = [
	"capture",
	"non-capture",
	"named-capture",
	"lookahead-single",
	"lookbehind-single",
	"neg-lookahead-single",
	"neg-lookbehind-single"
].map(TokenType)
