#!/usr/bin/env node

/* eg. node bin/nearleythere.js examples/js/left.js --input "....."
   or, node bin/nearleythere.js examples/js/AycockHorspool.js --input "aa" 
 */

var fs = require('fs');
var nearley = require('../lib/nearley.js');
var nomnom = require('nomnom');
var StreamWrapper = require('../lib/stream.js');

var opts = nomnom
	.script('nearleyc')
	.option('file', {
		position: 0,
		help: "A grammar .js file",
        required: true,
	})
	.option('input', {
		abbr: 'i',
		help: "An input string to parse (if not provided then read from stdin)",
	})
	.option('start', {
		abbr: 's',
		help: "An optional start symbol (if not provided then use the parser start symbol)",
	})
	.option('out', {
		abbr: 'o',
		help: "File to output to (defaults to stdout)",
	})
	.option('version', {
		abbr: 'v',
		flag: true,
		help: "Print version and exit",
		callback: function() {
			return require('../package.json').version;
		}
	})
	.parse();

var output = opts.out ? fs.createWriteStream(opts.out) : process.stdout;

var grammar = new require(require('path').resolve(opts.file));
var parser = new nearley.Parser(grammar.ParserRules, opts.start ? opts.start : grammar.ParserStart);

var writeTable = function (writeStream, parser) {
    writeStream.write("Table length: " + parser.table.length + "\n");
    writeStream.write("Number of parses: " + parser.results.length + "\n");
    writeStream.write("Parse Charts");
    var chartNumber = 0;
    parser.table.forEach(
        function (chart) {
            writeStream.write("\nChart: " + chartNumber++ + "\n");
            var stateNumber = 0;
            chart.forEach(
                function (state) {
                    writeStream.write(stateNumber++ + ": " + state.toString() + "\n");
                } )
        } )
    writeStream.write("\n\nParse results: \n");
    writeStream.write(require('util').inspect(parser.results, {colors: true, depth: null}));
    writeStream.write("\n");
}

if (typeof(opts.input) === "undefined") {
    process.stdin
        .pipe(new StreamWrapper(parser))
    	.on('finish', function() {
            writeTable(output, parser);
    	});
} else {
    parser.feed(opts.input);
    writeTable(output, parser);
}
