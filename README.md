# yeoman-gen-run

[![NPM](https://nodei.co/npm/yeoman-gen-run.png?downloads=true&downloadRank=true)](https://nodei.co/npm/yeoman-gen-run/)  

> A tool to silently run any installed Yeoman generator by its name with predefined answers in json-config.


## Overview

The tool could be helpfull if you need to run a Yeoman generator as part of build process or inside other non-interactive tool.  


## Usage via CLI

If you installed the package globally (`npm i yo-gen-run -g`):  
```shell
yo-gen-run --name <generator-anem> --config <path-to-config> --out <name-of-output-dir>
```

or (if installed locally):  
```shell
node ./node_modules/cli.js --name <generator-anem> --config <path-to-config> --out <name-of-output-dir>
```

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
* `answers`
* `options`

answers - is object with key-value pairs for answers where a key is a name of the generator's prompt.
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

An object in `options` contains additional options for Yeoman:
* `onconflict` - action for resolving a conflict: "force" (overwrite), "skip" (do nothing), "abort" (abort process).  
A conflict will take place if a generated file defers from an exising file with the same name.  


#### outDir
Type: `String`  
Required: no  
Default: './output'  

A directory path where the generator will be run.


## Licence

MIT