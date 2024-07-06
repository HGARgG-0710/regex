# `regex`

`regex` is a JavaScript library intended for parsing, generation and AST-construction of
various regular expressions, as per the [JavaScript variety](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)'s definition.

NOTE: the library depends upon the [`parsers.js`](https://github.com/HGARgG-0710/parsers.js) package for parser-making

## Installation

```
npm install @hgargg-0710/regex
```

## Documentation

The package has the following exports:

1. `parse` (function)
2. `generate` (function)
3. `parser` (submodule)
4. `generator` (submodule)
5. `tree` (submodule)
6. `tokens` (submodule)

### `parse`

```ts
function parse(regex: string): Flags
```

A function taking in a string containing a regular expression,
and returning an AST of it.

### `generate`

```ts
function generate(AST: Flags): string
```

Takes in the given AST node (not necessariliy `Flags`, but too long to express here),
and returns a string representing it.

NOTE: partial nodes will give only partial results. For example, passing a `PatternEnd` will give `"$"`.

### `parser`

Various parsing layers APIs

| export             | description                                               |
| ------------------ | --------------------------------------------------------- |
| `ExpressionParser` | Function. Parses an `Expression`, initially tokenizing it |
| `boundry`          | Submodule. Handles parsing of boundries                   |
| `chars`            | Submodule. Handles tokenization                           |
| `classes`          | Submodule. Handles parsing of character classes           |
| `deflag`           | Submodule. Handles removal of flags                       |
| `disjunction`      | Submodule. Handles parsing of disjunction expressions     |
| `escaped`          | Submodule. Handles parsing of escape-sequences            |
| `group`            | Submodule. Handles recursion within a regular expression  |
| `nogreedy`         | Submodule. Handles the "no-greedy" quantifiers            |
| `quantifier`       | Submodule. Handles the quantifiers                        |

The submodule exports are a part of the `parse` function's final definition.

The order in which they (layers) are passed within the `parse` function are:

1. `deflag`
2. `chars`
3. `classes`
4. `escaped`
5. `boundry`
6. `group` (recursive, looped)
7. `quantifier`
8. `nogreedy`
9. `disjunction`

#### `deflag`

| export          | description                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DeFlag`        | Functions for the de-flagging of a `string` with regular expression in it. Returns a `Flags` object, with the `.expression` field containing the expressions's string |
| `flagTable`     | Table for identification of flags with appropriate `TokenInstance`s                                                                                                   |
| `flagInstance`  | Function based off `flagTable`. Returns the `TokenType` of a given flag `string`                                                                                      |
| `identifyFlags` | Maps `flagInstance` to an array of `string`s                                                                                                                          |

#### `chars`

| export                | description                                                                             |
| --------------------- | --------------------------------------------------------------------------------------- |
| `ExpressionTokenizer` | A `PatternTokenizer` for tokenizing the given `Pattern` with a regular expression in it |
| `tokenizerMap`        | The `RegExpMap`, on which `ExpressionTokenizer` is based                                |

#### `classes`

| export                  | description                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `CharacterClassParser`  | Main parser for character classes                                                   |
| `classLimit`            | Limits the given stream up to the next `RectOp` from the current element            |
| `classMap`              | `TypeMap`, on which `CharacterClassParser` is based                                 |
| `HandleClass`           | The handler for the `RectOp` token inside the `classMap`                            |
| `ClassHandler`          | A multistep function, serving as the main component of `HandleClass`                |
| `EscapeInner`           | A parser function, first component of the `ClassHandler`. Escapes inside characters |
| `HandleEscaped`         | Handler for the escaped characters, main part of the `EscapeInner`                  |
| `IdentifyRanges`        | Second parsing function of `ClassHandler`. Identifies and parsers ranges            |
| `HandleRange`           | The main component of `IdentifyRanges`, parses encountered ranges                   |
| `InClassEscapedHandler` | A slightly modified version of the `escapedMap` from `escaped` module for escaping  |

#### `escaped`

| export                     | description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| `EscapedParser`            | Main parser of the escaped characters                                  |
| `escapePreface`            | The `TypeMap`, on which `EscapedParser` is based                       |
| `escapeMap`                | The `ValueMap`, on which defines the global-scope escaping             |
| `escapedHandler`           | Creates a function for handling escaped characters based off given map |
| `parseBackreference`       | Returns a `Backreference` based on given arguments of `curr, input`    |
| `parseMultControl`         | Returns a `ControlCharacter` of lengths 4-5 based on `curr, input`     |
| `parseDoubleControl`       | Returns a `ControlCharacter` of length 2 based on `curr, input`        |
| `parseSingleControl`       | Returns a `ControlCharacter` of length 1 based on `curr, input`        |
| `readUnicodeClassProperty` | Parses a `UnicodeClassProperty` based on `curr, input`                 |
| `readBraced`               | Reads the given `Stream`, until a `ClBrace` is encountered             |
| `readNamedBackreference`   | Reads a `NamedBackreference` based on `readIdentifier`                 |
| `readUBrace`               | Reads a sequence of `{hhhh}` or `{hhhhh}` where `isHex(h) === true`    |
| `readu`                    | Reads a sequence of `hhhh`, where `isHex(h) === true`                  |
| `readx`                    | Reads a sequence of `hh`, where `isHex(h) === true`                    |
| `isHex`                    | Returns whether a character given is a hexidecimal                     |

#### `boundry`

| export          | description                                                             |
| --------------- | ----------------------------------------------------------------------- |
| `BoundryParser` | Main parser of the submodule. Separates boundries into `TokenInstance`s |
| `boundryMap`    | The `TypeMap`, on which the `BoundryParser` is based                    |
| `HandleEscaped` | Handles the `NonWordBoundry` `TokenInstance`s                           |

#### `group`

| export                      | description                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `EndParser`                 | The main parser of the submodule. The `ExpressionParser` ends with it                                           |
| `GroupParser`               | The first parsing layer of the `EndParser`. Recursive. Handles recursion, groups/captures, look-aheads/-behinds |
| `groupMap`                  | The `TypeMap`, on which the `GroupParser` is based                                                              |
| `GroupHandler`              | The main component of the `groupMap`                                                                            |
| `nestedBrack`               | Function for limiting the current-level nested bracket-expression                                               |
| `CollectionHandler`         | Function for handling current collection                                                                        |
| `HandleQMark`               | Function for handling "collections" starting with `?` (`(?<!...)`, `(?<...>...)`, ...)                          |
| `HandleCollectionBase`      | Function for recursively handling a capture group                                                               |
| `QMarkHandler`              | Underlying `TableParser` of `HandleQMark`                                                                       |
| `HandleQMarkExclMark`       | Handles a negative look-ahead                                                                                   |
| `HandleQMarkEq`             | Handles a look-ahead                                                                                            |
| `HandleLeftAngular`         | Handles all "collections" starting with `<` (`(?<...>...)`, `(?<=...)`, ...)                                    |
| `HandleColon`               | Handles a no-capture group                                                                                      |
| `LeftAngularHandler`        | Underlying `TableParser` for `HandleLeftAngular`                                                                |
| `HandleLeftAngularBase`     | Handles a named capture                                                                                         |
| `HandleLeftAngularExclMark` | Handles a negative look-behind                                                                                  |
| `HandleLeftAngularEq`       | Handles a look-behind                                                                                           |
| `readIdentifier`            | Reads an identifier (for the named capture/backreference)                                                       |

#### `quantifier`

| export              | description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| `QuantifierParser`  | Main parser of the submodule. Parses quantifiers                             |
| `QuantifierHandler` | A `TableParser`, main component of the `QuantifierParser`                    |
| `HandlePlus`        | Handles a `Plus` token encountered                                           |
| `HandleStar`        | Handles a `Star` token encountered                                           |
| `HandleQMark`       | Handles a `QMark` token encountered                                          |
| `BraceHandler`      | Handles a `OpBrace` token encountered                                        |
| `HandleBraced`      | Returns a handling function for either one of `NtoM`, `NPlus`, or `NOnly`    |
| `readNumber`        | Reads a number from the given `Stream` (note: up to the first `isNaN` token) |
| `limitBraced`       | Limits the given `Stream` up to the point of the first encountered `ClBrace` |

#### `nogreedy`

| export              | description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `ParseNoGreedy`     | Main parser of the submodule. Parsers `NoGreedy` tokens        |
| `noGreedyMap`       | The `TypeMap`, on which `ParseNoGreedy` is based               |
| `HandleQuantifier`  | Handler for quantifiers                                        |
| `QuantifierHandler` | The underlying `TableParser`-function of `HandleQuantifiers`   |
| `HandleQMark`       | Handles `QMark` following a quantifier (no-greedy quantifiers) |

#### `disjunction`

| export                 | description                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `DisjunctionParser`    | The main export of the submodule. Parses disjunctions                                                             |
| `EmptyFixer`           | First parsing layer of `DisjunctionParser`. Fixes empty expressions `\|\|`                                        |
| `DisjunctionTokenizer` | Second parsing layer of `DisjunctionParser`. Puts non-`Pipe` bits of current `Stream` into `DisjucntionArgument`s |
| `DisjunctionDelimiter` | Third and final parsing layer of `DisjunctionParser`. Delimits the `Stream` based off `Pipe` tokens               |
| `hasDisjunctions`      | Checks whether a given `Stream` has disjunctions to parse from given point on                                     |
| `limitPipe`            | Limits the given `Stream` until the moment the next `Pipe` is encountered                                         |
| `skipTilPipes`         | Skips `Stream` until a `Pipe` is discovered                                                                       |

### `generator`

Provides regex-generation related exports based off the package's AST

| export                         | description                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `RegexGenerator`               | The `SourceGenerator` for the package's AST (`generate` is based on it)                            |
| `generatorMap`                 | The `TypeMap`, on which `RegexGenerator` is based                                                  |
| `GenerateBackspaceClass`       | Generates a regex for `BackspaceClass`                                                             |
| `GenerateWordBoundry`          | Generates a regex for `WordBoundry`                                                                |
| `GenerateNonWordBoundry`       | Generates a regex for `NonWordBoundry`                                                             |
| `GenerateNewline`              | Generates a regex for `Newline`                                                                    |
| `GenerateCarriageReturn`       | Generates a regex for `CarriageReturn`                                                             |
| `GenerateWordClass`            | Generates a regex for `WordClass`                                                                  |
| `GenerateNonWordClass`         | Generates a regex for `NonWordClass`                                                               |
| `GenerateFormFeed`             | Generates a regex for `FormFeed`                                                                   |
| `GenerateDigitClass`           | Generates a regex for `DigitClass`                                                                 |
| `GenerateNonDigitClass`        | Generates a regex for `NonDigitClass`                                                              |
| `GenerateNULClass`             | Generates a regex for `NULClass`                                                                   |
| `GenerateVerticalTab`          | Generates a regex for `VerticalTab`                                                                |
| `GenerateHorizontalTab`        | Generates a regex for `HorizontalTab`                                                              |
| `GenerateNonWhitespaceClass`   | Generates a regex for `NonWhitespaceClass`                                                         |
| `GenerateWhitespaceClass`      | Generates a regex for `WhitespaceClass`                                                            |
| `GenerateEmptyExpression`      | Generates a regex for `EmptyExpression`                                                            |
| `GenerateMatchIndicies`        | Generates a regex for `MatchIndicies` flag                                                         |
| `GenerateGlobalSearch`         | Generates a regex for `GlobalSearch` flag                                                          |
| `GenerateCaseInsensitive`      | Generates a regex for `CaseInsensitive` flag                                                       |
| `GenerateMultline`             | Generates a regex for `Multline` flag                                                              |
| `GenerateDotAll`               | Generates a regex for `DotAll` flag                                                                |
| `GenerateUnicode`              | Generates a regex for `Unicode` flag                                                               |
| `GenerateUnicodeSets`          | Generates a regex for `UnicodeSets` flag                                                           |
| `GenerateSticky`               | Generates a regex for `Sticky` flag                                                                |
| `GeneratePatterStart`          | Generates a regex for `PatternStart`                                                               |
| `GeneratePatternEnd`           | Generates a regex for `PatternEnd`                                                                 |
| `GenerateFlags`                | Generates a regex for `Flags`                                                                      |
| `GenerateExpression`           | Generates an regex for `Expression`                                                                |
| `GenerateNOnly`                | Generates an regex for `NOnly`                                                                     |
| `GenerateNtoM`                 | Generates an regex for `NtoM`                                                                      |
| `GenerateNPlus`                | Generates an regex for `NPlus`                                                                     |
| `GenerateEscaped`              | Generates an regex for `Escaped`                                                                   |
| `GenerateBackreference`        | Generates a regex for `Backreference`                                                              |
| `GenerateUnicodeClassProperty` | Generates a regex for `UnicodeClassProperty`                                                       |
| `GenerateControlCharacter`     | Generates a regex for `ControlCharacter`                                                           |
| `GenerateNamedBackreference`   | Generates a regex for `NamedBackreference`                                                         |
| `GenerateClassRange`           | Generates a regex for `ClassRange`                                                                 |
| `GenerateNoGreedy`             | Generates a regex for `NoGreedy`                                                                   |
| `GenerateOptional`             | Generates anregex for `Optional`                                                                   |
| `GenerateZeroPlus`             | Generates a regex for `ZeroPlus`                                                                   |
| `GenerateOnePlus`              | Generates a regex for `OnePlus`                                                                    |
| `GenerateClass`                | Generates a regex for `CharacterClass`                                                             |
| `GenerateNegClass`             | Generates a regex for `NegCharacterClass`                                                          |
| `GenerateDisjunction`          | Generates a regex for `Disjunction`                                                                |
| `GenerateDisjunctionArgument`  | Generates a regex for `DisjunctionArgument`                                                        |
| `GenerateNonCaptureGroup`      | Generates a regex for `NonCaptureGroup`                                                            |
| `GenerateCaptureGroup`         | Generates a regex for `CaptureGroup`                                                               |
| `GenerateLookAhead`            | Generates a regex for `LookAhead`                                                                  |
| `GenerateLookBehind`           | Generates a regex for `LookBehind`                                                                 |
| `GenerateNegLookAhead`         | Generates a regex for `NegLookAhead`                                                               |
| `GenerateNegLookBehind`        | Generates a regex for `NegLookBehind`                                                              |
| `GenerateNamedCapture`         | Generates a regex for `NamedCapture`                                                               |
| `GenerateWildcard`             | Generates a regex for `Wildcard`                                                                   |
| `GeneratePipe`                 | Generates a regex for `Pipe`                                                                       |
| `GenerateComma`                | Generates a regex for `Comma`                                                                      |
| `GenerateTrivial`              | Generates a regex for anything else not in the table already (with a `typeof .value === 'string'`) |

### `tree`

| export             | description                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RegexStream`      | A `TreeStream` for the library's AST (note: accepts THE AST ITSELF)                                                                                            |
| `RegexTree`        | A `Tree` interface implementation for the library's AST                                                                                                        |
| `treeMap`          | The `TypeMap`, on which `RegexTree` is based                                                                                                                   |
| `NamedCaptureTree` | The function for conversion of a `NamedCapture` to a `Tree`                                                                                                    |
| `ExpressionTree`   | The function for conversion of an `Expression` to a `Tree`                                                                                                     |
| `FlagTree`         | The function for convertsion of a `Flags` to a `Tree`                                                                                                          |
| `SeveralTree`      | The function for conversion of `NOnly`, `NtoM` and `NPlus` to a `Tree`                                                                                         |
| `SingleTree`       | The function for conversion of `ZeroPlus`, `OnePlus`, `Optional`, `LookAhead`, `LookBehind`, `NegLookAhead`, `NegLookBehind`, `NamedBackreference` to a `Tree` |
| `ValueTree`        | The function for conversion of `ClassRange`, `DisjunctionArgument`, `CharacterClass`, `NegCharacterClass` and `Disjunction` to a `Tree`                        |
| `ChildlessTree`    | The function for conversion of the rest of the tokens to a `Tree`                                                                                              |

### `tokens`

The `tokens` module has the same submodule structure as the `parser` module.

| submodule     | description                                      |
| ------------- | ------------------------------------------------ |
| `boundry`     | Various boundry tokens                           |
| `chars`       | Various basic (first-order) tokens               |
| `classes`     | Tokens for representation of character classes   |
| `deflag`      | Flags and expressions representation tokens      |
| `disjunction` | Disjunction-related tokens                       |
| `escaped`     | Escape-sequence-related tokens                   |
| `group`       | Tokens for groups and other recursive structures |
| `nogreedy`    | Tokens for non-greedy quantifiers                |
| `quantifier`  | Tokens for quantifiers                           |

#### `deflag`

| `TokenType`/`TokenInstance` | represents                                                                | `type`               |
| --------------------------- | ------------------------------------------------------------------------- | -------------------- |
| `MatchIndicies`             | The `d` flag                                                              | `"indicies"`         |
| `GlobalSearch`              | The `g` flag                                                              | `"global"`           |
| `CaseInsensitive`           | The `i` flag                                                              | `"case-insensitive"` |
| `Multiline`                 | The `m` flag                                                              | `"multiline"`        |
| `DotAll`                    | The `s` flag                                                              | `"dot-all"`          |
| `Unicode`                   | The `u` flag                                                              | `"unicode"`          |
| `UnicodeSets`               | The `v` flag                                                              | `"unicode-sets"`     |
| `Sticky`                    | The `y` flag                                                              | `"sticky"`           |
| `Flags`                     | The complete regular expression with flags                                | `"flags"`            |
| `Expression`                | A partial expression, without flags (can have other `Expression`s inside) | `"expression"`       |

#### `chars`

| `TokenType`    | represents      | `type`       |
| -------------- | --------------- | ------------ |
| `Escape`       | `\\`            | `"escape"`   |
| `RectOp`       | `[`             | `"rop"`      |
| `RectCl`       | `]`             | `"rcl"`      |
| `Hyphen`       | `-`             | `"hyphen"`   |
| `Pipe`         | `\|`            | `"pipe"`     |
| `OpBrack`      | `(`             | `"opbrack"`  |
| `ClBrack`      | `)`             | `clbrack`    |
| `QMark`        | `?`             | `"qmark"`    |
| `ExclMark`     | `!`             | `"emark`     |
| `Eq`           | `=`             | `"eq"`       |
| `Wildcard`     | `.`             | `"wildcard"` |
| `Star`         | `*`             | `"star"`     |
| `Plus`         | `+`             | `"plus"`     |
| `OpBrace`      | `{`             | `"opbrc"`    |
| `ClBrace`      | `}`             | `"clbrc"`    |
| `Colon`        | `:`             | `"colon"`    |
| `Comma`        | `,`             | `"comma"`    |
| `LeftAngular`  | `<`             | `"lang"`     |
| `RightAngular` | `>`             | `"rang"`     |
| `Dollar`       | `$`             | `"dollar"`   |
| `Xor`          | `^`             | `"xor"`      |
| `RegexSymbol`  | everything else | `"symbol"`   |

#### `classes`

| `TokenType`         | represents                          | `type`            |
| ------------------- | ----------------------------------- | ----------------- |
| `CharacterClass`    | A character class `[...]`           | `"charclass"`     |
| `NegCharacterClass` | A negative character class `[^...]` | `"neg-charclass"` |
| `ClassRange`        | A character class range `X-Y`       | `"class-range"`   |

#### `escaped`

| `TokenType`/`TokenInstance` | represents                                           | `type`                   |
| --------------------------- | ---------------------------------------------------- | ------------------------ |
| `ControlCharacter`          | `\cX`, `\xhh`, `\uhhhh`, `\u{hhhh}` or `\u{hhhhh}`   | `"control-char"`         |
| `Backreference`             | `\N` - numeric backreference                         | `"backref"`              |
| `NamedBackreference`        | `\k<name>` - named backreference                     | `"named-backref"`        |
| `UnicodeClassProperty`      | `\p{...}` - unicode class property                   | `"uniprop"`              |
| `RegexIdentifier`           | `name` - identifier in named captures/backreferences | `"identifier"`           |
| `CarriageReturn`            | `\r` - carriage return                               | `"cr"`                   |
| `NonWordBoundry`            | `\B` - non-word boundry (outside classes)            | `"non-word-boundry"`     |
| `WordBoundry`               | `\b` - word-boundry                                  | `"word-boundry"`         |
| `NULClass`                  | `\0` - NUL class                                     | `"nul-class"`            |
| `FormFeed`                  | `\f` - form feed                                     | `"form-feed"`            |
| `DigitClass`                | `\d` - digit class                                   | `"digit-class"`          |
| `NonDigitClass`             | `\D` - non-digit class                               | `"non-digit-class"`      |
| `WordClass`                 | `\w` - word-class                                    | `"word-class"`           |
| `NonWordClass`              | `\W` - nonw-word-class                               | `"non-word-class"`       |
| `WhitespaceClass`           | `\s` - whitespace class                              | `"whitespace-class"`     |
| `NonWhitespaceClass`        | `\S` - non-whitespace class                          | `"non-whitespace-class"` |
| `HorizontalTab`             | `\t` - horizontal tab                                | `"tab"`                  |
| `VerticalTab`               | `\v` - vertical tab                                  | `"vtab"`                 |
| `BackspaceClass`            | `\b` - backspace                                     | `"backspace"`            |
| `Newline`                   | `\n` - newline                                       | `"newline"`              |
| `Escaped`                   | Any other escaped character                          | `"escaped"`              |

#### `boundry`

| `TokenInstance` | represents | `type`    |
| --------------- | ---------- | --------- |
| `PatternStart`  | `^`        | `"start"` |
| `PatternEnd`    | `$`        | `"end"`   |

#### `group`

| `TokenType`      | represents    | `type`             |
| ---------------- | ------------- | ------------------ |
| `CaptureGroup`   | `(...)`       | `"capture"`        |
| `NoCaptureGroup` | `(?:...)`     | `"non-capture"`    |
| `NamedCapture`   | `(<name>...)` | `"named-capture"`  |
| `LookAhead`      | `(?=...)`     | `"lookahead"`      |
| `LookBehind`     | `(?<=...)`    | `"lookbehind"`     |
| `NegLookAhead`   | `(?!...)`     | `"neg-lookahead"`  |
| `NegLookBehind`  | `(?<!...)`    | `"neg-lookbehind"` |

#### `quantifier`

| `TokenType` | represents     | `type`        |
| ----------- | -------------- | ------------- |
| `ZeroPlus`  | `...*`         | `"zero-plus"` |
| `OnePlus`   | `...+`         | `"one-plus"`  |
| `Optional`  | `...?`         | `"optional"`  |
| `NOnly`     | `...{...}`     | `"n-only"`    |
| `NPlus`     | `...{...,}`    | `"n-plus"`    |
| `NtoM`      | `...{...,...}` | `"n-to-m"`    |

#### `nogreedy`

| export         | description                                                                          | `type`       |
| -------------- | ------------------------------------------------------------------------------------ | ------------ |
| `NoGreedy`     | A `TokenType` representing no-greedy opertors                                        | `"nogreedy"` |
| `isQuantifier` | A predicate returning `true` only for tokens with types from the `quantifier` module |

#### `disjunction`

| `TokenType`/`TokenInstance` | represents                                   | `type`              |
| --------------------------- | -------------------------------------------- | ------------------- |
| `Disjunction`               | `...\|...\|...`                              | `"disjunction"`     |
| `DisjunctionArgument`       | An element of a `Disjunction`                | `"disjunction-arg"` |
| `EmptyExpression`           | An empty element of a `Disjunction` (`\|\|`) | `"empty"`           |
