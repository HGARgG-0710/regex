import { function as _f, map } from "@hgargg-0710/one"
import {
	BasicMap,
	PredicateMap,
	SourceGenerator,
	StringSource,
	TypeMap
} from "@hgargg-0710/parsers.js"
import { RegexStream } from "./tree.mjs"
import {
	Flags,
	Expression,
	MatchIndicies,
	GlobalSearch,
	CaseInsensitive,
	Multiline,
	DotAll,
	Unicode,
	UnicodeSets,
	Sticky
} from "./deflag/tokens.mjs"
import { CharacterClass, NegCharacterClass, ClassRange } from "./classes/tokens.mjs"
import { Disjunction, DisjunctionArgument, EmptyExpression } from "./disjunct/tokens.mjs"
import { NoGreedy } from "./nogreedy/tokens.mjs"
import { NOnly, NPlus, NtoM, OnePlus, Optional, ZeroPlus } from "./quantifier/tokens.mjs"
import {
	CaptureGroup,
	LookAhead,
	LookBehind,
	NamedCapture,
	NegLookAhead,
	NegLookBehind,
	NoCaptureGroup
} from "./group/tokens.mjs"
import {
	Backreference,
	BackspaceClass,
	CarriageReturn,
	ControlCharacter,
	DigitClass,
	Escaped,
	FormFeed,
	HorizontalTab,
	NamedBackreference,
	Newline,
	NonDigitClass,
	NonWhitespaceClass,
	NonWordBoundry,
	NonWordClass,
	NULClass,
	UnicodeClassProperty,
	VerticalTab,
	WhitespaceClass,
	WordBoundry,
	WordClass
} from "./escaped/tokens.mjs"
import { PatternEnd, PatternStart } from "./boundry/tokens.mjs"

const { trivialCompose, cache } = _f
const { toObject } = map

const expressionBounds = Array(2).fill("")
const characterClassBounds = ["[", "]"]
const negCharacterClassBounds = ["[^", "]"]
const disjunctionBounds = ["", "", "|"]
const groupBounds = ["(", ")"]
const lookaheadBounds = ["(?=", ")"]
const lookbehindBounds = ["(?<=", ")"]
const negLookaheadBounds = ["(?!", ")"]
const negLookbehindBounds = ["(?<!", ")"]
const nonCaptureBounds = ["(?:", ")"]

const controlLengthMap = BasicMap.extend((x) => x.length)(
	new Map([
		[1, (value) => `\\c${value}`],
		[2, (value) => `\\x${value}`],
		[4, (value) => `\\u${value}`],
		[5, (value) => `\\u{${value}}`]
	])
)

const source = toObject(
	cache(
		(sym) => () => StringSource(sym),
		[
			"\\b",
			"\\B",
			"\\w",
			"\\W",
			"\\n",
			"\\f",
			"\\0",
			"\\v",
			"\\t",
			"\\s",
			"\\S",
			"",
			"\\r",
			"\\D",
			"\\d",
			"d",
			"g",
			"i",
			"m",
			"s",
			"u",
			"v",
			"y",
			"^",
			"$"
		]
	)
)

const cachedSource = toObject(cache(StringSource, ["|"]))
const delimCache = [
	[(x) => x],
	toObject(cache((delim) => (x) => x.concat(cachedSource[delim]), ["|"]))
]

// ? Generalize and put into 'parsers.js' v0.3?
const ArrayGenerator = cache(
	(lim) =>
		function (input, generator) {
			const valueLength = input.curr().value.length
			return StringSource(
				`${lim[0]}${
					Array(valueLength)
						.fill(0)
						.map(() => {
							input.next()
							return generator(input)
						})
						.reduce(
							(last, curr, i) =>
								delimCache[+(i < valueLength - 1 && !!lim[2])][
									(i < valueLength - 1 && lim[2]) || 0
								](last.concat(curr)),
							StringSource()
						).value
				}${lim[1]}`
			)
		},
	[
		expressionBounds,
		characterClassBounds,
		negCharacterClassBounds,
		disjunctionBounds,
		groupBounds,
		lookaheadBounds,
		lookbehindBounds,
		negLookaheadBounds,
		negLookbehindBounds,
		nonCaptureBounds
	]
)

const GenerateSinglePost = toObject(
	cache(
		(sym) =>
			function (input, generator) {
				input.next()
				return StringSource(`${generator(input).value}${sym}`)
			},
		["?", "+", "*"]
	)
)

const NHandlerId = (x) => x
const NHandlerPair = (x) => x.join(",")
const NHandlerComma = (x) => `${x},`

const NCache = cache(
	(handler) =>
		function (input, generator) {
			const { range } = input.curr().value
			input.next()
			return StringSource(`${generator(input).value}{${handler(range)}}`)
		},
	[NHandlerId, NHandlerPair, NHandlerComma]
)

export function GenerateFlags(input, generator) {
	const flagLen = input.next().value.flags.length
	const flags = Array(flagLen)
		.fill(0)
		.map(() => {
			input.next()
			return generator(input).value
		})
		.join("")
	input.next()
	const expression = generator(input).value
	return StringSource(`/${expression}/${flags}`)
}

export function GenerateClassRange(input) {
	input.next()
	return StringSource(`${input.next().value}-${input.curr().value}`)
}

export function GenerateNamedBackreference(input, generator) {
	input.next()
	return StringSource(`\\k<${generator(input).value}>`)
}

export function GenerateNamedCapture(input, generator) {
	input.next()
	const name = generator(input).value
	input.next()
	return StringSource(
		`(?<${name}>${
			Array(input.curr().value.length)
				.fill(0)
				.map(() => {
					input.next()
					return generator(input)
				})
				.reduce((last, curr) => last.concat(curr), StringSource()).value
		})`
	)
}
export function GenerateControlCharacter(input) {
	const { value } = input.curr()
	return StringSource(controlLengthMap.index(value)(value))
}
export function GenerateUnicodeClassProperty(input) {
	const { value } = input.curr()
	return StringSource(
		`\\p{${typeof value === "string" ? value : `${value.property}=${value.value}`}}`
	)
}

export const GenerateEscaped = (input) => StringSource(`\\${input.curr().value}`)
export const GenerateBackreference = GenerateEscaped
export const GenerateTrivial = (input) => StringSource(`${input.curr().value}`)

export const [
	GenerateExpression,
	GenerateClass,
	GenerateNegClass,
	GenerateDisjunction,
	GenerateDisjunctionArgument,
	GenerateNonCaptureGroup,
	GenerateCaptureGroup,
	GenerateLookAhead,
	GenerateLookBehind,
	GenerateNegLookAhead,
	GenerateNegLookBehind
] = [
	expressionBounds,
	characterClassBounds,
	negCharacterClassBounds,
	disjunctionBounds,
	expressionBounds,
	nonCaptureBounds,
	groupBounds,
	lookaheadBounds,
	lookbehindBounds,
	negLookaheadBounds,
	negLookbehindBounds
].map((x) => ArrayGenerator.get(x))

export const [GenerateNoGreedy, GenerateOptional, GenerateZeroPlus, GenerateOnePlus] = [
	"?",
	"?",
	"*",
	"+"
].map((x) => GenerateSinglePost[x])

export const [GenerateNOnly, GenerateNtoM, GenerateNPlus] = [
	NHandlerId,
	NHandlerPair,
	NHandlerComma
].map((x) => NCache.get(x))

export const [
	GenerateBackspaceClass,
	GenerateWordBoundry,
	GenerateNonWordBoundry,
	GenerateNewline,
	GenerateCarriageReturn,
	GenerateWordClass,
	GenerateNonWordClass,
	GenerateFormFeed,
	GenerateDigitClass,
	GenerateNonDigitClass,
	GenerateNULClass,
	GenerateVerticalTab,
	GenerateHorizontalTab,
	GenerateNonWhitespaceClass,
	GenerateWhitespaceClass,
	GenerateEmptyExpression,
	GenerateMatchIndicies,
	GenerateGlobalSearch,
	GenerateCaseInsensetive,
	GenerateMultiline,
	GenerateDotAll,
	GenerateUnicode,
	GenerateUnicodeSets,
	GenerateSticky,
	GeneratePatternStart,
	GeneratePatternEnd
] = [
	"\\b",
	"\\b",
	"\\B",
	"\\n",
	"\\r",
	"\\w",
	"\\W",
	"\\f",
	"\\d",
	"\\D",
	"\\0",
	"\\v",
	"\\t",
	"\\S",
	"\\s",
	"",
	"d",
	"g",
	"i",
	"m",
	"s",
	"u",
	"v",
	"y",
	"^",
	"$"
].map((x) => source[x])

export const generatorMap = TypeMap(PredicateMap)(
	new Map([
		[Flags, GenerateFlags],
		[Expression, GenerateExpression],
		[CharacterClass, GenerateClass],
		[NegCharacterClass, GenerateNegClass],
		[ClassRange, GenerateClassRange],
		[Disjunction, GenerateDisjunction],
		[DisjunctionArgument, GenerateDisjunctionArgument],
		[NoGreedy, GenerateNoGreedy],
		[Optional, GenerateOptional],
		[ZeroPlus, GenerateZeroPlus],
		[OnePlus, GenerateOnePlus],
		[NoCaptureGroup, GenerateNonCaptureGroup],
		[CaptureGroup, GenerateCaptureGroup],
		[LookAhead, GenerateLookAhead],
		[LookBehind, GenerateLookBehind],
		[NegLookAhead, GenerateNegLookAhead],
		[NegLookBehind, GenerateNegLookBehind],
		[NamedBackreference, GenerateNamedBackreference],
		[NOnly, GenerateNOnly],
		[NtoM, GenerateNtoM],
		[NPlus, GenerateNPlus],
		[NamedCapture, GenerateNamedCapture],
		[BackspaceClass, GenerateBackspaceClass],
		[WordBoundry, GenerateWordBoundry],
		[NonWordBoundry, GenerateNonWordBoundry],
		[Newline, GenerateNewline],
		[CarriageReturn, GenerateCarriageReturn],
		[WordClass, GenerateWordClass],
		[NonWordClass, GenerateNonWordClass],
		[FormFeed, GenerateFormFeed],
		[DigitClass, GenerateDigitClass],
		[NonDigitClass, GenerateNonDigitClass],
		[NULClass, GenerateNULClass],
		[VerticalTab, GenerateVerticalTab],
		[HorizontalTab, GenerateHorizontalTab],
		[NonWhitespaceClass, GenerateNonWhitespaceClass],
		[WhitespaceClass, GenerateWhitespaceClass],
		[EmptyExpression, GenerateEmptyExpression],
		[ControlCharacter, GenerateControlCharacter],
		[UnicodeClassProperty, GenerateUnicodeClassProperty],
		[Backreference, GenerateBackreference],
		[Escaped, GenerateEscaped],
		[MatchIndicies, GenerateMatchIndicies],
		[GlobalSearch, GenerateGlobalSearch],
		[CaseInsensitive, GenerateCaseInsensetive],
		[Multiline, GenerateMultiline],
		[DotAll, GenerateDotAll],
		[Unicode, GenerateUnicode],
		[UnicodeSets, GenerateUnicodeSets],
		[Sticky, GenerateSticky],
		[PatternStart, GeneratePatternStart],
		[PatternEnd, GeneratePatternEnd]
	]),
	GenerateTrivial
)

export const RegexGenerator = SourceGenerator(generatorMap)

export default trivialCompose(
	(x) => x.value,
	(x) => RegexGenerator(x, StringSource()),
	RegexStream
)
