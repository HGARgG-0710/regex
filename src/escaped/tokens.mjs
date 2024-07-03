import { TokenInstance, TokenType } from "@hgargg-0710/parsers.js"
export const [
	Escaped,
	ControlCharacter,
	Backreference,
	NamedBackreference,
	UnicodeClassProperty,
	RegexIdentifier
] = ["escaped", "control-char", "backref", "named-backref", "uniprop", "identifier"].map(
	TokenType
)

export const [
	CarriageReturn,
	NonWordBoundry,
	WordBoundry,
	NULClass,
	FormFeed,
	DigitClass,
	NonDigitClass,
	WordClass,
	NonWordClass,
	WhitespaceClass,
	NonWhitespaceClass,
	HorizontalTab,
	VerticalTab,
	BackspaceClass,
	Newline
] = [
	"cr",
	"non-word-boundry",
	"word-boundry",
	"nul-class",
	"form-feed",
	"digit-class",
	"non-digit-class",
	"word-class",
	"non-word-class",
	"whitespace-class",
	"non-whitespace-class",
	"tab",
	"vtab",
	"backspace",
	"newline"
].map(TokenInstance)
