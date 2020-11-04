import jsonGrammar from './json.ts';
import { Parser, Grammar } from '../index.ts';

const grammar = Grammar.fromCompiled(jsonGrammar);
const parser = new Parser(grammar);

parser.feed('{"test": 42}');
const asts = parser.finish();
console.log(asts);