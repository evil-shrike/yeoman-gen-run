var path    = require('path');
var mkdirp  = require('mkdirp');
var Promise = require('bluebird');
var yeoman  = require('yeoman-environment');
var Adapter = require('./Adapter');

function runGenerator(genName, config, outDir) {
	if (outDir) {
		mkdirp.sync(outDir);
		process.chdir(outDir);
	}

	var adapter = new Adapter(config.answers, config.options);
	config.cli = config.cli || {};
	var env = yeoman.createEnv(config.cli.args || [], config.cli.opts, adapter);

	return new Promise(function (resolve, reject) {
		env.lookup(function () {
			return env.run(genName, function () {
				resolve(true);
			});
		});
	});
}

module.exports = {
	runGenerator: runGenerator
}