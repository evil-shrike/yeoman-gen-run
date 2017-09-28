# yeoman-gen-run

[![NPM](https://nodei.co/npm/yeoman-gen-run.png?downloads=true&downloadRank=true)](https://nodei.co/npm/yeoman-gen-run/)  

> A tool to non-interactively run any installed Yeoman generator by its name with predefined answers in json-config.


## Overview

The tool could be helpfull if you need to run a Yeoman generator as part of build process or inside other non-interactive tool.  


## Usage via CLI

If you installed the package globally (`npm i yeoman-gen-run -g`):  
```shell
yo-gen-run --name <generator-name> --config <path-to-config> --out <name-of-output-dir>
```

or (if installed locally):  
```shell
node ./node_modules/yeoman-gen-run/cli.js --name <generator-name> --config <path-to-config> --out <name-of-output-dir>
```

Run `yo-gen-run` to see all available options.

At least you should supply `--name` options - name of generator to run.
Usualy we will supply `--config` as well with name/path to json config file containing answers.

Addition options:
* `--nolog` / `-s` - do not optput generator's log (all that it optput via call `this.log`), by default all log output from generator is sent to console.


## Usage via API
Just see cli.js for 

```js
var runner 	= require('yeoman-gen-run');
var genName = 'generator-name';
var config = {
	"answers": {
		"appName": "test-app",
		"useTypeScript": true,
		"useLess": true,
		"installDeps": true
	},
	"options": {
		"onconflict": "force"
	}
}};
var outDir = "./output";

runner.runGenerator(genName, config, outDir).then(function() {
    console.log('Done!');
});

```


## Passing cli arguments to generator

Usually Yeoman generators ask questions (prompts). But sometimes a generator can expect some cli arguments/options. 
They are described with methods `argument` and `option` in generator's constructor.
It's possible to pass cli args to generator via `yo-gen-run`.  
There are two ways:  

* via CLI: all paramers after two dashed are treated as parameters for generator (not the tool itself)
For example:
```
yo-gen-run -n ts-classes -c ./.yo-gen.json -- --model ./domain/model-meta --output model.d.ts --nometa
```
Here we supplied three parameters (all of them are options as they start with `--`) to 'ts-classes' generator:
"model": "./domain/model-meta", "output": "model.d.ts", "nometa": true.
* via config file: see description of `config` parameter for `runGenerator` method below.


## API
### runGenerator(genName, config, outDir)

Run generator with name `genName` supplying it with answers from `config.answers` 

Returns a `Promise` (bluebird) to be resolved when generator finishes.

#### genName
Type: `String`  
Required: yes  

Name of generator to run.

#### config
Type: `Object`  
Required: yes  

An object with fields:
* `answers` - optional, Object
* `options` - optional, Object
* `cli`     - optional, Object

##### answers
`answers` - is an object with key-value pairs for answers where a key is a name of the generator's prompt.
For example if the generator has a prompt with name "appName":
```js
MyGenerator.prototype.askFor = function askFor() {
  var prompts = [{
    name: 'appName',
    message: 'Enter your app name',
    default: 'MyApp'
  }];
}
```
then `answers` object will have:
```js
	"answers": {
		"appName": "test-app",
	},
```

##### options
An object in `options` contains additional options for Yeoman:
* `onconflict` - action for resolving a conflict: "force" (overwrite), "skip" (do nothing), "abort" (abort process).  
A conflict will take place if a generated file defers from an exising file with the same name.  
* `nolog` - suppress console log from running generator

##### cli
`cli` - is an object with cli parameters for generator to be run (see http://yeoman.io/authoring/user-interactions.html).  
It can contain fields:
* `args` - array of *arguments* for generator (defined in generators with `this.argument`)
* `opts` - object with *options* for generator (defined in generators with `this.option`)


#### outDir
Type: `String`  
Required: no  
Default: cwd   

A directory path where the generator will be run.


## History
### 1.2
* fixed running the cli tool (yo-gen-run) on Linux/Unix 

### 1.1
* cli-tool (yo-gen-run): `config` is not mandatory, check for config file existence, added `nolog` option, parse additional cli args for generator (via '--')
* Adapter: nolog option (previously no logging from generator was output to console), by default logging enabled
* API (runGenerator): support `cli.args`, `cli.opts`, do not change cwd if it wasn't specified (previouly it was always './out')

### 1.0

## Licence

MIT