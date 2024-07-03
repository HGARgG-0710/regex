import { function as _f } from "@hgargg-0710/one"
import { PredicateMap, SourceGenerator, TypeMap } from "@hgargg-0710/parsers.js"
import { RegexStream } from "./tree.mjs"

const { trivialCompose } = _f

// ! Finish...
export const generatorMap = TypeMap(PredicateMap)(new Map([]))

export const RegexGeneratr = SourceGenerator(generatorMap)

export default trivialCompose((x) => x.value, RegexGeneratr, RegexStream)
