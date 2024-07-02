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
	wrapped
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
import { QuantifierParser } from "../quantifier/parsers.mjs"
import { ParseNoGreedy } from "../nogreedy/parsers.mjs"
import { DisjunctionParser, DisjunctionTokenizer } from "../disjunct/parsers.mjs"

const { trivialCompose } = _f

export const readIdentifier = read((input) => !RightAngular.is(input.curr()))

export const nestedBrack = nested(
	...[OpBrack, ClBrack].map((X) => trivialCompose(...[is(X), current]))
)

export const LeftAngularHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[
				Eq,
				function (input) {
					input.next()
					return LookBehind(EndParser(input))
				}
			],
			[
				ExclMark,
				function (input) {
					input.next()
					return NegLookBehind(EndParser(input))
				}
			]
		]),
		function (input) {
			const name = readIdentifier(input, TokenSource({ value: "" })).value
			input.next()
			return NamedCapture({ name, expression: EndParser(input) })
		}
	)
)

export const QMarkHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[
				Colon,
				(input) => {
					input.next()
					return NoCaptureGroup(EndParser(input))
				}
			],
			[
				LeftAngular,
				function (input) {
					input.next()
					return LeftAngularHandler(input)
				}
			]
		])
	)
)

export const CollectionHandler = TableParser(
	TypeMap(PredicateMap)(
		new Map([
			[
				QMark,
				function (input) {
					input.next() // ?
					return QMarkHandler(input)
				}
			],
			[
				Eq,
				function (input) {
					input.next()
					return LookAhead(EndParser(input))
				}
			],
			[
				ExclMark,
				function (input) {
					input.next()
					return NegLookAhead(EndParser(input))
				}
			]
		]),
		(input) => CaptureGroup(EndParser(input))
	)
)

export const groupMap = TypeMap(PredicateMap)(
	new Map([[OpBrack, wrapped(trivialCompose(CollectionHandler, nestedBrack))]]),
	forward
)

export const GroupParser = BasicParser(groupMap)

export const EndParser = trivialCompose(
	Expression,
	...[DisjunctionParser, DisjunctionTokenizer, ParseNoGreedy, QuantifierParser]
		.map((x) => [x, InputStream])
		.flat(),
	GroupParser
)
