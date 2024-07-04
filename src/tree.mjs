import { function as _f } from "@hgargg-0710/one"
import { Flags } from "./deflag/tokens.mjs"
import {
	childIndex,
	childrenCount,
	miss,
	PredicateMap,
	TreeStream,
	TypeMap
} from "@hgargg-0710/parsers.js"
import { Expression } from "./deflag/tokens.mjs"
import { CharacterClass, ClassRange, NegCharacterClass } from "./classes/tokens.mjs"
import { NOnly, NtoM, OnePlus, Optional, ZeroPlus } from "./quantifier/tokens.mjs"
import { NoGreedy } from "./nogreedy/tokens.mjs"
import { Disjunction, DisjunctionArgument } from "./disjunct/tokens.mjs"
import {
	CaptureGroup,
	LookAhead,
	LookBehind,
	NamedCapture,
	NegLookAhead,
	NegLookBehind
} from "./group/tokens.mjs"
import { NamedBackreference } from "./escaped/tokens.mjs"

const { trivialCompose } = _f

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

export const treeMap = TypeMap(PredicateMap)(
	new Map(
		[
			[
				Flags,
				function (tree, treeConverter) {
					tree.value.flags = tree.value.flags.map(treeConverter)
					tree.value.expression = treeConverter(tree.value.expression)
					tree.children = function () {
						return ["flags", "expression"].map((x) => this.value[x])
					}
					return tree
				}
			],
			[Expression, ValueTree],
			[CharacterClass, ValueTree],
			[NegCharacterClass, ValueTree],
			[ClassRange, ValueTree],
			[Disjunction, ValueTree],
			[DisjunctionArgument, ValueTree],
			[NoGreedy, SingleTree],
			[ZeroPlus, SingleTree],
			[OnePlus, SingleTree],
			[Optional, SingleTree],
			[CaptureGroup, SingleTree],
			[LookAhead, SingleTree],
			[LookBehind, SingleTree],
			[NegLookAhead, SingleTree],
			[NegLookBehind, SingleTree],
			[NamedBackreference, SingleTree],
			[NOnly, SeveralTree],
			[NtoM, SeveralTree],
			// ? Generalize this 'recursive property mutation' for trees?
			[
				NamedCapture,
				function (tree, treeConverter) {
					tree.value.expression = treeConverter(tree.value.expression)
					tree.value.name = treeConverter(tree.value.name)
					tree.children = function () {
						return ["name", "expression"].map((x) => this.value[x])
					}
					return tree
				}
			]
		].map(([Type, Handler]) => [Type, trivialCompose(regexTree, Handler)])
	),
	ChildlessTree
)

// ! refactor generalization into 'parsers.js' v0.3
const fromTable = (map) => {
	const T = (x) => map.index(x)(x, T)
	return T
}

export const RegexTree = fromTable(treeMap)

export const RegexStream = trivialCompose(TreeStream, RegexTree)
