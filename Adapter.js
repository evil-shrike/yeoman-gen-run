var inquirer = require('inquirer');
var events = require('events');
var _ = require('lodash');

var noop = function () {
};

function DummyPrompt(answers, q) {
	this.answers = answers;
	this.question = q;
}

DummyPrompt.prototype.run = function () {
	var answer = this.answers[this.question.name];
	var isSet;

	switch (this.question.type) {
		case 'list':
			// list prompt accepts any answer value including null
			isSet = answer !== undefined;
			break;
		case 'confirm':
			// ensure that we don't replace `false` with default `true`
			isSet = answer || answer === false;
			break;
		case 'expand':
			// it's a question about overwriting an existing file (name: 'action')
			// this should not happen! 
			answer = "abort";
			isSet = true;
			break;
		default:
			// other prompts treat all falsy values to default
			isSet = !!answer;
	}

	if (!isSet) {
		console.log("Encountered an unknown question (absent in the answer file): " + this.question.name);
		answer = this.question.default;

		if (answer === undefined && this.question.type === 'confirm') {
			answer = true;
		}
	}

	return Promise.resolve(answer);
};


function Adapter(answers, options) {
	answers = answers || {};
	this.promptModule = inquirer.createPromptModule();
	this.options = options || {};
	this.options.onconflict = this.options.onconflict || 'force';

	Object.keys(this.promptModule.prompts).forEach(function (promptName) {
		this.promptModule.registerPrompt(promptName, DummyPrompt.bind(DummyPrompt, answers));
	}, this);

	_.extend(this.log, events.EventEmitter.prototype);

	if (this.options.nolog) {
		this.log = function () {}
	} else {
		this.log = function () {
			console.log.apply(console, arguments);
		}
	}

	// make sure all log methods are defined
	[
		'write',
		'writeln',
		'ok',
		'error',
		'skip',
		'force',
		'create',
		'invoke',
		'conflict',
		'identical',
		'info',
		'table'
	].forEach(function (methodName) {
		this.log[methodName] = this.log.bind(this);
	}, this);
}

Adapter.prototype.diff = function () {
	//console.log("diff");
};

Adapter.prototype.prompt = function (questions, cb) {
	if (questions.length && questions[0].type === "expand") {
		// conflict (generated file and existing one are different)
		// console.log("conflict: " + questions);
		cb({action: this.options.onconflict});
		return;
	}
	var promise = this.promptModule(questions);
	promise.then(cb || noop);

	return promise;
};

module.exports = Adapter;