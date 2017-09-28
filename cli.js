var yargs 	= require('yargs');
var runner 	= require('.');
var path 	= require('path');
var fs	 	= require('fs');

var argv = yargs
    .help('help')
    .version()
    .alias('v', 'version')
    .showHelpOnFail(true)
    .usage('Non-interactively run a Yeoman generator (local/global) with predefined answers.\nUsage: yo-gen-run <options>')
    .example('yo-gen-run --name my-generator --config config.json --out ./myapp')
    .example('yo-gen-run --name @scope/my-generator:child --config config.json --silent')
    .options('n', {
        alias: 'name',
        describe: 'A Yeoman generator name',
        type: 'string',
        demand: true
    })
    .options('c', {
        alias: 'config',
        describe: 'Path to json file with answers'
        //demand: true
    })
    .options('o', {
        alias: 'out',
        describe: 'Target directory for generator (by default - cwd)'
    })
    .options('s', {
    	alias: 'nolog',
        type: 'boolean',
    	describe: 'Suppress all console log output from generator'
    })
    .epilog('Have fun.')
    .argv;

var options = {};


var genName = argv.name;

var config = {};
if (argv.config) {
	var cfgStr;
	try {
		cfgStr = fs.readFileSync(argv.config);
	} catch(e) {
		console.error('Cannot read config file ' + argv.config);
		process.exit(1)
	}
	config = JSON.parse(cfgStr);
}


config.options = config.options || {};
config.options.nolog = argv.nolog;

// Parse additional cli args/opts for generator (they should be separated from the tool's args with `--`):
parseArgv(argv._, config);

var outDir = argv.out;
console.log("Running Yeoman-generator '" + genName + (outDir ? "' in '" + outDir + "'" : "") );

runner.runGenerator(genName, config, outDir).then(function() {
    console.log('Done!');
    process.exit(0);
});

function parseArgv(argv, config) {
	if (!argv || !argv.length) { return; }
	yargs.reset().parse(argv.join(" "), null, function(err, argv, output) {
		delete argv.help;
		delete argv.version;
		delete argv.$0;
		// all other - additional args and opts
		config.cli = {
			args: argv._,
		};
		delete argv._;
		config.cli.opts = argv;
	});
}