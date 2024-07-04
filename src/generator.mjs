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
	NegLookAhead
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

const { trivialCompose, cache } = _f
const { toObject } = map

// ^ Tokens to describe
// * 1. Flags
// * 2. Expression
// * 3. CharacterClass
// * 4. NegCharacterClass
// * 5. ClassRange
// * 6. Disjunction
// * 7. DisjunctionArgument
// * 8. NoGreedy
// * 9. ZeroPlus
// * 10. OnePlus
// * 11. Optional
// * 12. CaptureGroup
// * 13. LookAhead
// * 14. LookBehind
// * 15. NegLookAhead
// * 16. NegLookBehind
// * 17. NamedBackreference
// * 18. NOnly
// * 19. NPlus
// * 20. NtoM
// * 21. NamedCapture
// * 22. ["otherwise", the last option - Symbol-s, Identifiers, Number-backrefs]
// * 23. BackspaceClass
// * 24. Newline
// * 25. CarriageReturn
// ! 26. [All different flags from 'deflag/tokens.mjs'...];
// * 27. NonWhitespaceClass
// * 28. WhitespaceClass
// * 29. WordClass
// * 30. NonWordClass
// * 31. HorizontalTab
// * 32. VerticalTab
// * 33. FormFeed
// * 34. DigitClass
// * 35. NonDigitClass
// * 36. NULClass
// * 37. EmptyExpression (when two '||' meet...);
// * 38. ControlCharacter
// * 39. Escaped
// * 40. UnicodeClassProperty
// * 41. Backreference

const expressionBounds = Array(2).fill("")
const characterClassBounds = ["[", "]"]
const negCharacterClassBounds = ["[^", "]"]
const disjunctionBounds = ["", "", "|"]
const groupBounds = ["(", ")"]
const lookaheadBounds = ["(?=", ")"]
const lookbehindBounds = ["(?<=", ")"]
const negLookaheadBounds = ["(?!", ")"]
const negLookbehindBounds = ["(?<!", ")"]

const controlLengthMap = BasicMap.extend((x) => x.length)(
	new Map([
		[1, (value) => `c${value}`],
		[2, (value) => `x${value}`],
		[4, (value) => `u${value}`],
		[5, (value) => `u{${value}}`]
	])
)

const source = cache(
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
		"y"
	]
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
			return StringSource(
				`${lim[0]}${
					Array(input.curr().value.length)
						.fill(0)
						.map(() => {
							input.next()
							return generator(input)
						})
						.reduce(
							(last, curr) =>
								delimCache[+!!lim[2]][lim[2] || 0](last.concat(curr)),
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
		negLookbehindBounds
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

// ! MAKE INTO proper API!
export const generatorMap = TypeMap(PredicateMap)(
	new Map([
		[
			Flags,
			function (input, generator) {
				input.next()
				const flags = generator(input).value
				input.next()
				const expression = generator(input).value
				return StringSource(`/${expression}/${flags}`)
			}
		],
		[Expression, ArrayGenerator.get(expressionBounds)],
		[CharacterClass, ArrayGenerator.get(characterClassBounds)],
		[NegCharacterClass, ArrayGenerator.get(negCharacterClassBounds)],
		[
			ClassRange,
			function (input) {
				input.next()
				return StringSource(`${input.next().value}-${input.curr().value}`)
			}
		],
		[Disjunction, ArrayGenerator.get(disjunctionBounds)],
		[DisjunctionArgument, ArrayGenerator.get(expressionBounds)],
		[NoGreedy, GenerateSinglePost["?"]],
		[Optional, GenerateSinglePost["?"]],
		[ZeroPlus, GenerateSinglePost["*"]],
		[OnePlus, GenerateSinglePost["+"]],
		[CaptureGroup, ArrayGenerator.get(groupBounds)],
		[LookAhead, ArrayGenerator.get(lookaheadBounds)],
		[LookBehind, ArrayGenerator.get(lookbehindBounds)],
		[NegLookAhead, ArrayGenerator.get(negLookaheadBounds)],
		[negLookbehindBounds, ArrayGenerator.get(negLookbehindBounds)],
		[
			NamedBackreference,
			function (input, generator) {
				input.next()
				return StringSource(`<${generator(input)}>`)
			}
		],
		// ! REFACTOR THESE 3 INTO A SINGLE 'cache' expression...;
		[
			NOnly,
			function (input, generator) {
				const { range } = input.curr().value
				input.next()
				return StringSource(`${generator(input).value}{${range}}`)
			}
		],
		[
			NtoM,
			function (input, generator) {
				const { range } = input.curr().value
				input.next()
				return StringSource(`${generator(input).value}{${range.join(",")}}`)
			}
		],
		[
			NPlus,
			function (input, generator) {
				const { range } = input.curr().value
				input.next()
				return StringSource(`${generator(input).value}{${range}}`)
			}
		],
		[
			NamedCapture,
			function (input, generator) {
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
							.reduce((last, curr) => last.concat(curr), StringSource())
							.value
					})`
				)
			}
		],
		[BackspaceClass, source["\\b"]],
		[WordBoundry, source["\\b"]],
		[NonWordBoundry, source["\\B"]],
		[Newline, source["\\n"]],
		[CarriageReturn, source["\\r"]],
		[WordClass, source["\\w"]],
		[NonWordClass, source["\\W"]],
		[FormFeed, source["\\f"]],
		[DigitClass, source["\\d"]],
		[NonDigitClass, source["\\D"]],
		[NULClass, source["\\0"]],
		[VerticalTab, source["\\v"]],
		[HorizontalTab, source["\\t"]],
		[NonWhitespaceClass, source["\\S"]],
		[WhitespaceClass, source["\\s"]],
		[EmptyExpression, source[""]],
		[
			ControlCharacter,
			function (input) {
				const { value } = input.curr()
				return StringSource(controlLengthMap.index(value)(value))
			}
		],
		[
			UnicodeClassProperty,
			function (input) {
				const { value } = input.curr()
				return StringSource(
					`\\p{${
						typeof value === "string"
							? value
							: `${value.property}=${value.value}`
					}}`
				)
			}
		],
		[Backreference, (input) => StringSource(`\\k<${input.curr().value}>`)],
		[Escaped, (input) => StringSource(`\\${input.curr().value}`)],
		[MatchIndicies, source["d"]],
		[GlobalSearch, source["g"]],
		[CaseInsensitive, source["i"]],
		[Multiline, source["m"]],
		[DotAll, source["s"]],
		[Unicode, source["u"]],
		[UnicodeSets, source["v"]],
		[Sticky, source["y"]]
	]),
	(input) => StringSource(`${input.curr().value}`)
)

export const RegexGeneratr = SourceGenerator(generatorMap)

export default trivialCompose(
	(x) => x.value,
	(x) => RegexGeneratr(x, StringSource()),
	RegexStream
)
