import {
	RegExpMap,
	read,
	TokenSource,
	wrapped,
	TypeMap,
	PredicateMap,
	forward,
	BasicParser,
	Token
} from "@hgargg-0710/parsers.js"

import { function as _f } from "@hgargg-0710/one"

import {
	Escaped,
	WordBoundry,
	Backreference,
	CarriageReturn,
	ControlCharacter,
	DigitClass,
	FormFeed,
	HorizontalTab,
	NULClass,
	Newline,
	NonDigitClass,
	NonWhitespaceClass,
	NonWordClass,
	VerticalTab,
	WhitespaceClass,
	WordClass,
	NamedBackreference,
	UnicodeClassProperty
} from "./tokens.mjs"
import { ClBrace, Escape, OpBrace } from "../chars/tokens.mjs"

import { readIdentifier } from "../group/parser.mjs"

import { readNumber } from "../quantifier/parsers.mjs"

const { trivialCompose } = _f

// ! REFACTOR INTO 'parsers.js'
export const isHex = (x) => /[0-9A-Fa-f]/.test(x)

const _readuBrace = read((input, i) => i < 4 || (i === 4 && isHex(input.curr().value)))
const _readu = read(4)

export const readx = read(2)
export const readu = (input) => _readu(input, TokenSource({ value: "" })).value
export const readuBrace = wrapped(
	(input) => _readuBrace(input, TokenSource({ value: "" })).value
)

export const readNamedBackreference = wrapped(function (input) {
	const name = readIdentifier(input, TokenSource({ value: "" })).value
	return NamedBackreference(name)
})

export const readBraced = read((input) => !ClBrace.is(input.curr()))

export const readUnicodeClassProperty = wrapped(function (input) {
	const property = readBraced(input, TokenSource({ value: "" })).value
	if (property.includes("=")) {
		const [prop, value] = property.split("=").slice(0, 2)
		return UnicodeClassProperty({ property: prop, value })
	}
	return UnicodeClassProperty(property)
})

export const escapedMap = RegExpMap.extend(Token.value)(
	new Map(
		[/d/, DigitClass],
		[/D/, NonDigitClass],
		[/w/, WordClass],
		[/W/, NonWordClass],
		[/s/, WhitespaceClass],
		[/S/, NonWhitespaceClass],
		[/t/, HorizontalTab],
		[/v/, VerticalTab],
		[/f/, FormFeed],
		[/0/, NULClass],
		[/n/, Newline],
		[/r/, CarriageReturn],
		[/c/, (curr, input) => ControlCharacter(input.next().value)],
		[
			/x/,
			(cur, input) =>
				ControlCharacter(readx(input, TokenSource({ value: "" })).value)
		],
		[
			/u/,
			(curr, input) =>
				ControlCharacter((OpBrace.is(input.curr()) ? readuBrace : readu)(input))
		],
		[/[1-9]/, (curr, input) => Backreference(`${curr.value}${readNumber(input)}`)],
		// TODO: refactor this into 'parsers.js' v0.3 or 'one.js' - redirection of given arguments' positions to a given function.
		[/k/, (curr, input) => readNamedBackreference(input)],
		[/p/, (curr, input) => readUnicodeClassProperty(input)],
		[/b/, WordBoundry]
	),
	trivialCompose(Escaped, Token.value)
)

// ? Refactor? [similar thing appears in 'parsers.mjs']
export const escapePreface = TypeMap(PredicateMap)(
	new Map([
		[
			Escape,
			function (input) {
				input.next() // \
				const curr = input.next()
				return escapedMap.index(curr)(curr, input)
			}
		]
	]),
	forward
)

export const EscapedParser = BasicParser(escapePreface)
