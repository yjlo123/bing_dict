var http = require('http');
var cheerio = require('cheerio');

var options = {
	host: 'cn.bing.com',
	path: '/dict/search?q=solace'
}

function lookup(word, callback){
	word = word.split(" ").join("+");
	options['path'] = "/dict/search?q="+word;
	var request = http.request(options, function (res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function () {
			var $ = cheerio.load(data);
			var desc = $("meta[name='description']")[0]['attribs']['content'];
			if(desc == "Dictionary"){
				// no result found
				desc = "";
			}
			callback(desc);
		});
	});
	request.on('error', function (e) {
		console.log(e.message);
	});
	request.end();
}

module.exports.lookup = lookup;