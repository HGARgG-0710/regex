import { function as _f } from "@hgargg-0710/one"
import { Flags } from "./deflag/tokens.mjs"
import {
	childIndex,
	childrenCount,
	miss,
	PredicateMap,
	TreeStream,
	TypeMap,
	misc
} from "@hgargg-0710/parsers.js"
import { Expression } from "./deflag/tokens.mjs"
import { CharacterClass, ClassRange, NegCharacterClass } from "./classes/tokens.mjs"
import { NOnly, NPlus, NtoM, OnePlus, Optional, ZeroPlus } from "./quantifier/tokens.mjs"
import { NoGreedy } from "./nogreedy/tokens.mjs"
import { Disjunction, DisjunctionArgument } from "./disjunct/tokens.mjs"
import {
	CaptureGroup,
	LookAhead,
	LookBehind,
	NamedCapture,
	NegLookAhead,
	NegLookBehind,
	NoCaptureGroup
} from "./group/tokens.mjs"
import { NamedBackreference } from "./escaped/tokens.mjs"

const { trivialCompose } = _f
const { isArray } = misc

// ! Refactor into 'parsers.js' v0.3
function regexTree(tree) {
	tree.lastChild = childrenCount
	tree.index = childIndex
	return tree
}
// ! REFACTOR THESE KINDS OF THINGS INTO 'parsers.js' (frequently recurring, one can separate a tree structure into different 'types'..)
export function ChildlessTree(tree) {
	tree.children = miss
	return tree
}
export function ValueTree(tree, treeConverter) {
	tree.value = tree.value.map(treeConverter)
	tree.children = function () {
		return this.value
	}
	return tree
}
export function SingleTree(tree, treeConverter) {
	tree.value = treeConverter(tree.value)
	tree.children = function () {
		return [this.value]
	}
	return tree
}

export function SeveralTree(tree, treeConverter) {
	tree.value.argument = treeConverter(tree.value.argument)
	tree.children = function () {
		return [this.value.argument]
	}
	return tree
}

// ? Generalize this 'recursive property mutation' for trees?
export function FlagTree(tree, treeConverter) {
	tree.value.flags = tree.value.flags.map(treeConverter)
	tree.value.flags.children = function () {
		return this
	}
	tree.value.flags = regexTree(tree.value.flags)

	tree.value.expression = treeConverter(tree.value.expression)
	tree.children = function () {
		return ["flags", "expression"].map((x) => this.value[x])
	}
	return tree
}

export const ExpressionTree = (tree, treeTransform) =>
	(isArray(tree.value) ? ValueTree : SingleTree)(tree, treeTransform)

export function NamedCaptureTree(tree, treeConverter) {
	tree.value.expression = treeConverter(tree.value.expression)
	tree.value.name = treeConverter(tree.value.name)
	tree.children = function () {
		return ["name", "expression"].map((x) => this.value[x])
	}
	return tree
}

export const treeMap = TypeMap(PredicateMap)(
	new Map(
		[
			[Expression, ExpressionTree],
			[CharacterClass, ValueTree],
			[NegCharacterClass, ValueTree],
			[ClassRange, ValueTree],
			[Disjunction, ValueTree],
			[DisjunctionArgument, ValueTree],
			[NoGreedy, SingleTree],
			[ZeroPlus, SingleTree],
			[OnePlus, SingleTree],
			[Optional, SingleTree],
			[NoCaptureGroup, SingleTree],
			[CaptureGroup, SingleTree],
			[NOnly, SeveralTree],
			[NtoM, SeveralTree],
			[NPlus, SeveralTree],
			[LookAhead, SingleTree],
			[LookBehind, SingleTree],
			[NegLookAhead, SingleTree],
			[NegLookBehind, SingleTree],
			[NamedBackreference, SingleTree],
			[NamedCapture, NamedCaptureTree],
			[Flags, FlagTree]
		].map(([Type, Handler]) => [Type, trivialCompose(regexTree, Handler)])
	),
	trivialCompose(regexTree, ChildlessTree)
)

// ! refactor generalization into 'parsers.js' v0.3
const fromTable = (map) => {
	const T = (x) => map.index(x)(x, T)
	return T
}

// ! THIS KIND OF THING (the last '{ value : x }' function) is a hack. Ought to not be a part of 'parsers.js' (instead - USE THE PARENT ELEMENT AS THE PART OF THE 'TreeStream'!)
export const RegexTree = trivialCompose((x) => {
	const r = { value: x }
	r.children = function () {
		return [this.value]
	}
	return regexTree(r)
}, fromTable(treeMap))

export const RegexStream = trivialCompose(TreeStream, RegexTree)
