import {
	BasicParser,
	InputStream,
	PredicateMap,
	TableParser,
	TokenSource,
	TypeMap,
	current,
	forward,
	is,
	read,
	nested,
	wrapped,
	output
} from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import {
	ClBrack,
	Colon,
	Eq,
	ExclMark,
	LeftAngular,
	OpBrack,
	QMark,
	RightAngular
} from "../chars/tokens.mjs"
import {
	CaptureGroup,
	LookAhead,
	LookBehind,
	NamedCapture,
	NegLookAhead,
	NegLookBehind,
	NoCaptureGroup
} from "./tokens.mjs"
import { Expression } from "../deflag/tokens.mjs"
import { QuantifierParser } from "../quantifier/parser.mjs"
import { ParseNoGreedy } from "../nogreedy/parser.mjs"
import { DisjunctionParser, hasDisjunctions } from "../disjunct/parser.mjs"
import { RegexIdentifier } from "../escaped/tokens.mjs"

const { trivialCompose } = _f

const _readIdentifier = read((input) => !RightAngular.is(input.curr()))
export const readIdentifier = (input) =>
	RegexIdentifier(_readIdentifier(input, TokenSource({ value: "" })).value.value)

export const nestedBrack = nested(
	...[OpBrack, ClBrack].map((X) => trivialCompose(...[is(X), current]))
)

export function HandleLeftAngularEq(input) {
	input.next()
	return LookBehind(EndParser(input))
}

export function HandleLeftAngularExclMark(input) {
	input.next()
	return NegLookBehind(EndParser(input))
}

export function HandleLeftAngularBase(input) {
	const name = readIdentifier(input)
	input.next()
	return NamedCapture({ name, expression: EndParser(input) })
}

export const LeftAngularHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[Eq, HandleLeftAngularEq],
			[ExclMark, HandleLeftAngularExclMark]
		]),
		HandleLeftAngularBase
	)
)

export function HandleColon(input) {
	input.next()
	return NoCaptureGroup(EndParser(input))
}

export function HandleLeftAngular(input) {
	input.next()
	return LeftAngularHandler(input)
}

export function HandleQMarkEq(input) {
	input.next()
	return LookAhead(EndParser(input))
}

export function HandleQMarkExclMark(input) {
	input.next()
	return NegLookAhead(EndParser(input))
}

export const QMarkHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[Colon, HandleColon],
			[LeftAngular, HandleLeftAngular],
			[Eq, HandleQMarkEq],
			[ExclMark, HandleQMarkExclMark]
		])
	)
)

export const HandleCollectionBase = (input) => CaptureGroup(EndParser(input))

export function HandleQMark(input) {
	input.next() // ?
	return QMarkHandler(input)
}

export const CollectionHandler = TableParser(
	TypeMap(PredicateMap)(new Map([[QMark, HandleQMark]]), HandleCollectionBase)
)

export const GroupHandler = wrapped(
	trivialCompose(CollectionHandler, InputStream, nestedBrack)
)

export const groupMap = TypeMap(PredicateMap)(
	new Map([[OpBrack, trivialCompose(output, GroupHandler)]]),
	forward
)

export const GroupParser = BasicParser(groupMap)

export const EndParser = trivialCompose(
	Expression,
	(output) =>
		hasDisjunctions(InputStream(output)) ? DisjunctionParser(output) : output,
	...[ParseNoGreedy, QuantifierParser].map((x) => [x, InputStream]).flat(),
	GroupParser
)
