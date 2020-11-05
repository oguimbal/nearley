import jsonGrammar from './json.ts';
// import { Parser, Grammar } from "https://deno.land/x/nearley@2.19.7-deno/mod.ts";
import { Parser, Grammar } from '../mod.ts';
import * as mod from '../mod.ts';

// mod.Grammar
const grammar: Grammar = Grammar.fromCompiled(jsonGrammar);
const parser: mod.Parser = new Parser(grammar);

parser.feed('{"test": 42}');
const asts = parser.finish();
console.log(asts);