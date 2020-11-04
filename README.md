# This is only a Deno-compatible version of [nearley](https://github.com/kach/nearley)

# ⚠ It only includes the nearley parser. Not the compiler.

In order to compile your `.ne` files, you'll have to install the `nearley` npm package, and follow instructions as if you were running node.

# Usage

## First, you'll have to compile your grammar

```bash
npm install nearley -D
nearleyc my-grammar.ne -o my-compiled-grammar.ts
```

⚠ You grammar MUST compile to Typescript. To do so, include `@preprocessor typescript` on top of it.

nb: If you use Moo as a lexer, do it like that:

```nearley
@{%

import moo from "https://deno.land/x/moo@0.5.1-deno/mod.ts";

// unfortunately, there will be a typescript error if you dont cast it to any :(
let lexer: any = moo.compile({
    // you lexer
})

%}

@lexer lexer
```

### Then, you can use it in Deno:

```typescript
import { Parser, Grammar } from "https://deno.land/x/nearley@2.19.7-deno/mod.ts";

import myCompiledGrammar from './my-compiled-grammar.ts';

const grammar = Grammar.fromCompiled(myCompiledGrammar);
const parser = new Parser(grammar);

// use it as you would with node
parser.feed('some valid text');
```
