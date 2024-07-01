import { InputStream, StringPattern } from "@hgargg-0710/parsers.js"
import { DeFlag } from "./deflag/parser.mjs"
import { function as _f } from "@hgargg-0710/one"
import { ExpressionTokenizer } from "./chars/parser.mjs"
import { CharacterClassParser } from "./classes/parsers.mjs"
import { EndParser } from "./group/parser.mjs"
import { EscapedParser } from "./escaped/parser..mjs"
import { BoundryParser } from "./boundry/parser.mjs"

const { trivialCompose } = _f

// * Parser plan:
// ^ 0. 'deflag' - splits the expression onto the 'main part' and flags;
// ^ 1. tokenizer ('chars'): get individual symbols, basic tokens;
// ^ 2. classes: gets character classes; [NOTE: in-class 'Escaped'-s are handled AS A SINGLE-CHARACTER!]
// ^ 3. escaped: deal with escaped characters (which are, later, dealed with more precisely...);
// ^ 4. boundry: for boundry-type assertions (simple, the ^, $ and \b, \B [outside classes]);
// ^ 5. group: The first recursive part - ends up in the 'MainParser' (the 'final' part, EndParser). This is group stuff: `(...)`, `(?:...)`, ... Also, the 'lookahead', 'lookbehind' and other such things...
// ^ 6. quantifier: gets quantifiers;
// ^ 7. nogreedy: handles the '?'-nogreedy quantifiers
// ^ 8. disjunct: the disjunction;

export const ExpressionParser = trivialCompose(
	...[EndParser, BoundryParser, EscapedParser, CharacterClassParser]
		.map((x) => [x, InputStream])
		.flat(),
	ExpressionTokenizer,
	StringPattern
)

export default trivialCompose(
	(deflagged) => ({ ...deflagged, value: ExpressionParser(deflagged.value) }),
	DeFlag
)
