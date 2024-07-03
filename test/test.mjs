import { parse } from "../regex.mjs"
import { writeFile } from "fs/promises"

const parseTests = [
	"//",
	"//vgiysdum",
	"/ababaac/gi",
	"/[anx-triglf\\b\\B\\[()]/ms",
	"/([A-Fsimu]+)*?/",
	"/^baemo|((?:aee..ro.|limili??)|P+?3*K{2}S{2, 7})+|||\\BRs\\bK\\B[^BU\\\\SAl]\\b$/m",
	"/a|\\p{PROPERTYNAME}\\u{8809}\\u{Affae}\\u441A\\p{UNEPROPERTIE=VALEUR} \\c889\\x43Ak/m",
	"/\\990\\4432\\k<NAME>\\0\\1||SIEG?BRAU+!*/",
	"/\\0|\\f\\d|\\D\\W\\v||\\t\\w\\s1982|\\S|\\n\\nAn?[\\b]\\r\\n/",
	"/(?=barabarabara||El+k?? Ca(pi)(ta)?no?)(?!Sun-of-war-(?=rejected(?<!-defeat)),as-great-did-rise-an-immense-fit!oF-hatred-born-and-revered-it!'Tis-long-til-two-may-ever-meet!)(?<AAAAAA>B(U+(M{0,1}A*)+)P?)(?<=BA-RE)|und?||(?<!UUUMMM)/"
]

writeFile("out.json", JSON.stringify(parseTests.map(parse)))
