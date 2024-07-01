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
	limit,
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
	CaptureGroupSingle,
	LookAheadSingle,
	LookBehindSingle,
	NamedCaptureSingle,
	NegLookAheadSingle,
	NegLookBehindSingle,
	NoCaptureGroupSingle
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
					return LookBehindSingle(EndParser(input))
				}
			],
			[
				ExclMark,
				function (input) {
					input.next()
					return NegLookBehindSingle(EndParser(input))
				}
			]
		]),

		function (input) {
			const name = readIdentifier(input, TokenSource({ value: "" })).value
			input.next()
			return NamedCaptureSingle({ name, expression: EndParser(input) })
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
					return NoCaptureGroupSingle(EndParser(input))
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
					return LookAheadSingle(EndParser(input))
				}
			],
			[
				ExclMark,
				function (input) {
					input.next()
					return NegLookAheadSingle(EndParser(input))
				}
			]
		]),
		(input) => CaptureGroupSingle(EndParser(input))
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
