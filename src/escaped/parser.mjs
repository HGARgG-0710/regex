import {
	RegExpMap,
	read,
	TokenSource,
	wrapped,
	TypeMap,
	PredicateMap,
	forward,
	BasicParser,
	Token,
	ValueMap,
	output
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

import { readNumber } from "../quantifier/parser.mjs"

const { trivialCompose } = _f

// ! REFACTOR INTO 'parsers.js'
export const isHex = (x) => /[0-9A-Fa-f]/.test(x)

const _readuBrace = read((input, i) => i < 4 || (i === 4 && isHex(input.curr().value)))
const _readu = read(4)

export const readx = read(2)
export const readu = (input) => _readu(input, TokenSource({ value: "" })).value.value
export const readuBrace = wrapped(
	(input) => _readuBrace(input, TokenSource({ value: "" })).value.value
)

export const readNamedBackreference = wrapped(
	trivialCompose(NamedBackreference, readIdentifier)
)

export const readBraced = read((input) => !ClBrace.is(input.curr()))

export const readUnicodeClassProperty = wrapped(function (input) {
	const property = readBraced(input, TokenSource({ value: "" })).value.value
	if (property.includes("=")) {
		const [prop, value] = property.split("=").slice(0, 2)
		return UnicodeClassProperty({ property: prop, value })
	}
	return UnicodeClassProperty(property)
})

export const parseSingleControl = (curr, input) => ControlCharacter(input.next().value)
export const parseDoubleControl = (cur, input) =>
	ControlCharacter(readx(input, TokenSource({ value: "" })).value.value)
export const parseMultControl = (curr, input) =>
	ControlCharacter((OpBrace.is(input.curr()) ? readuBrace : readu)(input))

export const parseBackreference = (curr, input) =>
	Backreference(`${curr.value}${readNumber(input)}`)

export const escapedMap = ValueMap(RegExpMap)(
	new Map([
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
		[/c/, parseSingleControl],
		[/x/, parseDoubleControl],
		[/u/, parseMultControl],
		[/[1-9]/, parseBackreference],
		// TODO: refactor this into 'parsers.js' v0.3 or 'one.js' - redirection of given arguments' positions to a given function.
		[/k/, (curr, input) => readNamedBackreference(input)],
		[/p/, (curr, input) => readUnicodeClassProperty(input)],
		[/b/, WordBoundry]
	]),
	trivialCompose(Escaped, Token.value)
)

// ! refactor .index(...)(....) [into 'parsers.js']
export const escapedHandler = (map) =>
	function (input) {
		input.next() // \
		const curr = input.next()
		return map.index(curr)(curr, input)
	}

// ? Refactor? [slightly similar thing appears in 'classes']
export const HandleEscaped = escapedHandler(escapedMap)

export const escapePreface = TypeMap(PredicateMap)(
	new Map([[Escape, trivialCompose(output, HandleEscaped)]]),
	forward
)

export const EscapedParser = BasicParser(escapePreface)
