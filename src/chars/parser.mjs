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
			[/\[/, RectOp],
			[/-/, Hyphen],
			[/\|/, Pipe],
			[/=/, Eq],
			[/\]/, RectCl],
			[/\(/, OpBrack],
			[/\)/, ClBrack],
			[/\{/, OpBrace],
			[/\}/, ClBrace],
			[/:/, Colon],
			[/</, LeftAngular],
			[/>/, RightAngular],
			[/\?/, QMark],
			[/\!/, ExclMark],
			[/\./, Wildcard],
			[/\*/, Star],
			[/\+/, Plus],
			[/\$/, Dollar],
			[/\^/, Xor],
			[/,/, Comma], 
			[/./, RegexSymbol]
		].map(([regexp, token]) => [global(regexp), token])
	)
)

export const ExpressionTokenizer = PatternTokenizer(tokenizerMap)
