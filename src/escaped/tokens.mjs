import { TokenInstance, TokenType } from "@hgargg-0710/parsers.js"
export const [
	Escaped,
	DigitClass,
	NonDigitClass,
	WordClass,
	NonWordClass,
	WhitespaceClass,
	NonWhitespaceClass,
	HorizontalTab,
	VerticalTab,
	BackspaceClass,
	NULClass,
	FormFeed,
	Newline,
	CarriageReturn,
	ControlCharacter,
	Backreference,
	NamedBackreference,
	UnicodeClassProperty
] = [
	"escaped",
	"digit-class",
	"non-digit-class",
	"word-class",
	"non-word-class",
	"whitespace-class",
	"non-whitespace-class",
	"tab",
	"vtab",
	"backspace",
	"nul-class",
	"form-feed",
	"newline",
	"cr",
	"control-char",
	"backref",
	"named-backref",
	"uniprop"
].map(TokenType)

export const [NonWordBoundry, WordBoundry] = ["non-word-boundry", "word-boundry"].map(
	TokenInstance
)
