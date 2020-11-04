import nearleyCode from './lib/nearley.ts';
import type * as t from './node_modules/@types/nearley/index.d.ts';
export type {CompiledRules, Lexer, LexerState,  ParserOptions, ParserRule, Postprocessor, Token} from './node_modules/@types/nearley/index.d.ts';


export const Parser = nearleyCode.Parser as any as typeof t.Parser;
export const Grammar = nearleyCode.Grammar as any as typeof t.Grammar;
export const Rule = nearleyCode.Rule as any as typeof t.Rule;
