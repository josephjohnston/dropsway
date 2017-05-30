var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	mime = require('mime'),
	Mincer = require('mincer');
	cache = {};
var environment = new Mincer.Environment();
environment.appendPath('scripts');
var jsServer = Mincer.createServer(environment);

function serveStatic(response,absPath) {
	// if(cache[absPath]) {
	// 	sendFile(response,absPath,cache[absPath]);
	// } else {
		fs.exists(absPath,function(exists) {
			if(exists) {
				fs.readFile(absPath,function(err,data) {
					if(err) {
						send404(response);
					} else {
						// cache[absPath] = data;
						sendFile(response,absPath,data);
					}
				});
			} else {
				send404(response);
			}
		});
	// }
}
function sendFile(response,filePath,fileContents) {
	response.writeHead(200,
		{"content-type": mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}
function send404(response) {
	response.writeHead(404,{'Content-Type':'text/plain'});
	response.end('Error 404: file not found.');
}
var server = http.createServer(function(request,response) {
	var filePath = false;
	console.log(request.url);
	if(request.url==='/build') {
		filePath = 'public/index.html';
	} else {
		if(/.js$/.exec(request.url)!==null) {
			// filePath = 'scripts'+request.url;
			console.log('js',request.url);
			jsServer(request,response);
			return;
		}
		else if(/.css$/.exec(request.url)!==null) {
			filePath = 'public'+request.url;
			console.log('css',request.url);
		}
		else {
			console.log('other',request.url);
			filePath = 'public'+request.url;
		}
	}
	var absPath = './'+filePath;
	serveStatic(response,absPath);
});
var port = 8000;
server.listen(port,function() {
	console.log('Server listening on port '+port);
});

