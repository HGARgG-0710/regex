import { PatternTokenizer, RegExpMap, regex } from "@hgargg-0710/parsers.js"
import {
	Escape,
	RectOp,
	RectCl,
	Hyphen,
	Pipe,
	OpBrack,
	ClBrack,
	QMark,
	ExclMark,
	Eq,
	Wildcard,
	Star,
	Plus,
	OpBrace,
	ClBrace,
	Colon,
	LeftAngular,
	RightAngular,
	RegexSymbol,
	Dollar,
	Xor,
	Comma
} from "./tokens.mjs"

const { global } = regex

export const tokenizerMap = RegExpMap(
	new Map(
		[
			[/\\/, Escape],
			[/-/, Hyphen],
			[/\|/, Pipe],
			[/\[/, RectOp],
			[/\]/, RectCl],
			[/\(/, OpBrack],
			[/\)/, ClBrack],
			[/\?/, QMark],
			[/\*/, Star],
			[/\+/, Plus],
			[/:/, Colon],
			[/</, LeftAngular],
			[/>/, RightAngular],
			[/\!/, ExclMark],
			[/\{/, OpBrace],
			[/\}/, ClBrace],
			[/=/, Eq],
			[/\./, Wildcard],
			[/\$/, Dollar],
			[/\^/, Xor],
			[/,/, Comma],
			[/./, RegexSymbol]
		].map(([regexp, token]) => [global(regexp), token])
	)
)

export const ExpressionTokenizer = PatternTokenizer(tokenizerMap)
