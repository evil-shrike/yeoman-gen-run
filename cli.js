#!/usr/bin/env node

var yargs 	= require('yargs');
var runner 	= require('.');
var path 	= require('path');
var fs	 	= require('fs');

var conf = yargs
    .help('help')
    .version()
    .alias('v', 'version')
    .showHelpOnFail(true)
    .usage('Silently run an installed Yeoman generator with predefined answers.\nUsage: yo-gen-run <options>')
    .example('yo-gen-run --name my-generator --config config.json --out ./myapp')
    //.config('c')
    .options('n', {
        alias: 'name',
        describe: 'A Yeoman generator name',
        type: 'string',
        demand: true
    })
    .options('c', {
        alias: 'config',
        describe: 'Path to json file with answers',
        demand: true
    })
    .options('o', {
        alias: 'out',
        describe: 'Target directory for generator'
    })
    .epilog('Have fun.')
    .argv;

var options = {};


var genName = conf.name;

var config = JSON.parse(fs.readFileSync(conf.config));

var outDir = conf.out || "./out";

console.log("Running Yeoman-generator '" + genName + "' in '" + outDir + "'");

runner.runGenerator(genName, config, outDir).then(function() {
    console.log('Done!');
    process.exit(0);
});
