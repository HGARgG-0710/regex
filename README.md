# `regex`

`regex` is a JavaScript library intended for parsing, generation and AST-construction of
various regular expressions, as per the [JavaScript variety](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)'s definition.

NOTE: the library depends upon [`parsers.js`]()

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

<!-- ! FINISH [add descriptions...] -->

Various parsing APIs

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

| export          | description |
| --------------- | ----------- |
| `DeFlag`        |             |
| `flagTable`     |             |
| `flagInstance`  |             |
| `identifyFlags` |             |

#### `chars`

| export                | description |
| --------------------- | ----------- |
| `ExpressionTokenizer` |             |
| `tokenizerMap`        |             |

#### `classes`

| export                  | description |
| ----------------------- | ----------- |
| `CharacterClassParser`  |             |
| `classLimit`            |             |
| `classMap`              |             |
| `HandleClass`           |             |
| `parseClass`            |             |
| `HandleRegular`         |             |
| `HandleEscaped`         |             |
| `InClassEscapedHandler` |             |

#### `escaped`

| export                     | description |
| -------------------------- | ----------- |
| `EscapedParser`            |             |
| `escapePreface`            |             |
| `escapeMap`                |             |
| `parseBackreference`       |             |
| `parseMultControl`         |             |
| `parseDoubleControl`       |             |
| `parseSingleControl`       |             |
| `readUnicodeClassProperty` |             |
| `readBraced`               |             |
| `readNamedBackreference`   |             |
| `readUBrace`               |             |
| `readu`                    |             |
| `readx`                    |             |
| `isHex`                    |             |

#### `boundry`

| export          | description |
| --------------- | ----------- |
| `BoundryParser` |             |
| `boundryParser` |             |
| `HandleEscaped` |             |

#### `group`

| export                      | description |
| --------------------------- | ----------- |
| `EndParser`                 |             |
| `GroupParser`               |             |
| `groupMap`                  |             |
| `GroupHandler`              |             |
| `CollectionHandler`         |             |
| `HandleQMark`               |             |
| `HandleCollectionBase`      |             |
| `QMarkHandler`              |             |
| `HandleQMarkExclMark`       |             |
| `HandleQMarkEq`             |             |
| `HandleLeftAngular`         |             |
| `HandleColon`               |             |
| `LeftAngularHandler`        |             |
| `HandleLeftAngularBase`     |             |
| `HandleLeftAngularExclMark` |             |
| `HandleLeftAngularEq`       |             |
| `nestedBrack`               |             |
| `readIdentifier`            |             |

#### `quantifier`

| export              | description |
| ------------------- | ----------- |
| `QuantifierParser`  |             |
| `QuantifierHandler` |             |
| `HandlePlus`        |             |
| `HandleStar`        |             |
| `HandleQMark`       |             |
| `BraceHandler`      |             |
| `handleBraced`      |             |
| `readNumber`        |             |
| `limitBraced`       |             |

#### `nogreedy`

| export              | description |
| ------------------- | ----------- |
| `ParseNoGreedy`     |             |
| `noGreedyMap`       |             |
| `QuantifierHandler` |             |
| `HandleQuantifier`  |             |
| `HandleQMark`       |             |

#### `disjunction`

| export                 | description |
| ---------------------- | ----------- |
| `DisjunctionParser`    |             |
| `EmptyFixer`           |             |
| `DisjunctionDelimiter` |             |
| `DisjunctionTokenizer` |             |
| `hasDisjunctions`      |             |
| `limitPipe`            |             |
| `skipTilPipes`         |             |
| `isnotPipe`            |             |

### `generator`

<!-- ! FINISH! [descriptions] -->

| export                         | description |
| ------------------------------ | ----------- |
| `RegexGenerator`               |             |
| `generatorMap`                 |             |
| `GenerateBackspaceClass`       |             |
| `GenerateWordBoundry`          |             |
| `GenerateNonWordBoundry`       |             |
| `GenerateNewline`              |             |
| `GenerateCarriageReturn`       |             |
| `GenerateWordClass`            |             |
| `GenerateNonWordClass`         |             |
| `GenerateFormFeed`             |             |
| `GenerateDigitClass`           |             |
| `GenerateNonDigitClass`        |             |
| `GenerateNULClass`             |             |
| `GenerateVerticalTab`          |             |
| `GenerateHorizontalTab`        |             |
| `GenerateNonWhitespaceClass`   |             |
| `GenerateWhitespaceClass`      |             |
| `GenerateEmptyExpression`      |             |
| `GenerateMatchIndicies`        |             |
| `GenerateGlobalSearch`         |             |
| `GenerateCaseInsensitive`      |             |
| `GenerateMultline`             |             |
| `GenerateDotAll`               |             |
| `GenerateUnicode`              |             |
| `GenerateUnicodeSets`          |             |
| `GenerateSticky`               |             |
| `GeneratePatterStart`          |             |
| `GeneratePatternEnd`           |             |
| `GenerateFlags`                |             |
| `GenerateExpression`           |             |
| `GenerateNOnly`                |             |
| `GenerateNtoM`                 |             |
| `GenerateNPlus`                |             |
| `GenerateEscaped`              |             |
| `GenerateTrivial`              |             |
| `GenerateBackreference`        |             |
| `GenerateUnicodeClassProperty` |             |
| `GenerateControlCharacter`     |             |
| `GenerateNamedBackreference`   |             |
| `GenerateClassRange`           |             |
| `GenerateNoGreedy`             |             |
| `GenerateOptional`             |             |
| `GenerateZeroPlus`             |             |
| `GenerateOnePlus`              |             |
| `GenerateClass`                |             |
| `GenerateNegClass`             |             |
| `GenerateDisjunction`          |             |
| `GenerateDisjunctionArgument`  |             |
| `GenerateNonCaptureGroup`      |             |
| `GenerateCaptureGroup`         |             |
| `GenerateLookAhead`            |             |
| `GenerateLookBehind`           |             |
| `GenerateNegLookAhead`         |             |
| `GenerateNegLookBehind`        |             |
| `GenerateNamedCapture`         |             |

### `tree`

<!-- ! DESCRIBE! [add descriptions] -->

| export             | description |
| ------------------ | ----------- |
| `RegexStream`      |             |
| `RegexTree`        |             |
| `treeMap`          |             |
| `NamedCaptureTree` |             |
| `ExpressionTrees`  |             |
| `FlagTree`         |             |
| `SeveralTree`      |             |
| `SingleTree`       |             |
| `ValueTree`        |             |
| `ChildlessTree`    |             |

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

<!-- ! DESCRIBE ON A SUBMODULE-basis... -->

#### `deflag`

| `TokenType`/`TokenInstance` | represents | `type` |
| --------------------------- | ---------- | ------ |
| `MatchIndicies`             |            |        |
| `GlobalSearch`              |            |        |
| `CaseInsensitive`           |            |        |
| `Multiline`                 |            |        |
| `DotAll`                    |            |        |
| `Unicode`                   |            |        |
| `UnicodeSets`               |            |        |
| `Sticky`                    |            |        |
| `Flags`                     |            |        |
| `Expression`                |            |        |

#### `chars`

| `TokenType`    | represents | `type` |
| -------------- | ---------- | ------ |
| `Escape`       |            |        |
| `RectOp`       |            |        |
| `RectCl`       |            |        |
| `Hyphen`       |            |        |
| `Pipe`         |            |        |
| `OpBrack`      |            |        |
| `ClBrack`      |            |        |
| `QMark`        |            |        |
| `ExclMark`     |            |        |
| `Eq`           |            |        |
| `Wildcard`     |            |        |
| `Star`         |            |        |
| `Plus`         |            |        |
| `OpBrace`      |            |        |
| `ClBrace`      |            |        |
| `Colon`        |            |        |
| `Comma`        |            |        |
| `LeftAngular`  |            |        |
| `RightAngular` |            |        |
| `Dollar`       |            |        |
| `Xor`          |            |        |
| `RegexSymbol`  |            |        |

#### `classes`

| `TokenType`         | represents | `type` |
| ------------------- | ---------- | ------ |
| `CharacterClass`    |            |        |
| `NegCharacterClass` |            |        |
| `ClassRange`        |            |        |

#### `escaped`

| `TokenType`/`TokenInstance` | represents | `type` |
| --------------------------- | ---------- | ------ |
| `Escaped`                   |            |        |
| `ControlCharacter`          |            |        |
| `Backreference`             |            |        |
| `NamedBackreference`        |            |        |
| `UnicodeClassProperty`      |            |        |
| `RegexIdentifier`           |            |        |
| `CarriageReturn`            |            |        |
| `NonWordBoundry`            |            |        |
| `WordBoundry`               |            |        |
| `NULClass`                  |            |        |
| `FormFeed`                  |            |        |
| `DigitClass`                |            |        |
| `NonDigitClass`             |            |        |
| `WordClass`                 |            |        |
| `NonWordClass`              |            |        |
| `WhitespaceClass`           |            |        |
| `NonWhitespaceClass`        |            |        |
| `HorizontalTab`             |            |        |
| `VerticalTab`               |            |        |
| `BackspaceClass`            |            |        |
| `Newline`                   |            |        |

#### `boundry`

| `TokenType`    | represents | `type` |
| -------------- | ---------- | ------ |
| `PatternStart` |            |        |
| `PatternEnd`   |            |        |

#### `group`

| `TokenType`      | represents | `type` |
| ---------------- | ---------- | ------ |
| `CaptureGroup`   |            |        |
| `NoCaptureGroup` |            |        |
| `NamedCapture`   |            |        |
| `LookAhead`      |            |        |
| `LookBehind`     |            |        |
| `NegLookAhead`   |            |        |
| `NegLookBehind`  |            |        |

#### `quantifier`

| `TokenType` | represents | `type` |
| ----------- | ---------- | ------ |
| `ZeroPlus`  |            |        |
| `OnePlus`   |            |        |
| `Optional`  |            |        |
| `NOnly`     |            |        |
| `NPlus`     |            |        |
| `NtoM`      |            |        |

#### `nogreedy`

| export         | description | `type` |
| -------------- | ----------- | ------ |
| `NoGreedy`     |             |        |
| `isQuantifier` |             |        |

#### `disjunction`

| `TokenType`           | represents | `type` |
| --------------------- | ---------- | ------ |
| `Disjunction`         |            |        |
| `DisjunctionArgument` |            |        |
| `EmptyExpression`     |            |        |
