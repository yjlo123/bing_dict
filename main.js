var colors = require('colors');
var dict = require('./dict');
var ask = require("stdask").ask;

function printOut(word, desc, callback){
	var cursor = 0;
	if (desc == ""){
		printMessage("No results found for " + word, callback);
		return;
	}
	var tokens = desc.split("，");
	var pronunciation = "";
	var i = 0;
	// keep only one pronunciation
	// priority: british > american > none
	while(i < 3 && i < tokens.length){
		if (tokens[i].indexOf("[") > -1){
			cursor = i;
			pronunciation = (tokens[i].substring(1,tokens[i].length) + "  ");
		}
		i++;
	}
	var meaning = tokens[cursor+1];
	// format new lines
	lineBreak = meaning.indexOf("网络释义：");
	if(lineBreak != 0) meaning = [meaning.slice(0, lineBreak), '\n', meaning.slice(lineBreak)].join('');
	// replace keywords
	meaning = meaning.replace("网络释义：", "Web：");
	// output word + [pronunciation] + meanings
	console.log(word.green);
	if(pronunciation.length > 0) console.log(pronunciation.yellow);
	console.log(meaning.cyan);
	callback();
}

function printMessage(msg, callback){
	console.log(msg.red);
	callback();
}

function exeCommand(cmd, callback){
	if (cmd == "v" || cmd == "ver" || cmd == "version"){
		console.log("CLI En-Cn Dictionary".cyan);
		console.log("ver 0.1".green);
		console.log("liusiwei.com".yellow);
		callback();
	}else if (cmd == "q" || cmd == "quit" || cmd == "exit"){
		process.exit();
	}
}

function input(){
	ask(">", function(word) {
		if(word.charAt(0) == ':'){
			// command mode
			exeCommand(word.substring(1,word.length),input);
			return;
		}
		dict.lookup(word, function(desc){
			printOut(word,desc,input);
		});
	});
}

function main(){
	input();
}

main();