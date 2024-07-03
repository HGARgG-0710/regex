import { TokenInstance, TokenType } from "@hgargg-0710/parsers.js"

export const [Disjunction, DisjunctionArgument] = ["disjunction", "disjunction-arg"].map(
	TokenType
)

export const EmptyExpression = TokenInstance("empty")
