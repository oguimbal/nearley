
@preprocessor typescript
# http://www.json.org/
# http://www.asciitable.com/
@{%

import * as moo from "https://deno.land/x/moo@0.5.1-deno.2/mod.ts";

let lexer: any = moo.compile({
    space: {match: /\s+/, lineBreaks: true},
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    ',': ',',
    ':': ':',
    true: 'true',
    false: 'false',
    null: 'null',
})

%}

@lexer lexer

json -> _ (object | array) _ {% function(d) { return d[1][0]; } %}

object -> "{" _ "}" {% function(d) { return {}; } %}
    | "{" _ pair (_ "," _ pair):* _ "}" {% extractObject %}

array -> "[" _ "]" {% function(d) { return []; } %}
    | "[" _ value (_ "," _ value):* _ "]" {% extractArray %}

value ->
      object {% id %}
    | array {% id %}
    | number {% id %}
    | string {% id %}
    | "true" {% function(d) { return true; } %}
    | "false" {% function(d) { return false; } %}
    | "null" {% function(d) { return null; } %}

number -> %number {% function(d) { return parseFloat(d[0].value) } %}

string -> %string {% function(d) { return JSON.parse(d[0].value) } %}

pair -> key _ ":" _ value {% function(d) { return [d[0], d[4]]; } %}

key -> string {% id %}

_ -> null | %space {% function(d) { return null; } %}

@{%

function extractPair(kv: any, output: any) {
    if(kv[0]) { output[kv[0]] = kv[1]; }
}

function extractObject(d: any) {
    let output = {};

    extractPair(d[2], output);

    for (let i in d[3]) {
        extractPair(d[3][i][3], output);
    }

    return output;
}

function extractArray(d: any) {
    let output = [d[2]];

    for (let i in d[3]) {
        output.push(d[3][i][3]);
    }

    return output;
}

%}