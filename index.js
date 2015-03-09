console.log('Starting 3dsNode...');
//Create app
var express = require('express');
var app = express();

//Imports
var http;
var io;
var os;
var fs;
var config;

//Modules try
try {
	http = require('http').Server(app);
	io = require('socket.io')(http);
	fs = require('fs');
	config = require('config');
	os = require('os');
} catch(ex) {
	console.log(ex.toString());
	return;
}

//Exports
exports.io = io;

//Apps
var apps = [];
var appnames = [];
var appfiles = fs.readdirSync('./apps');
for(i in appfiles) {
	var dsapp = require('./apps/'+appfiles[i]);
	if(dsapp != undefined && dsapp.success) {
		apps[apps.length] = dsapp;
		var appname = appfiles[i].replace('.js','');
		appnames[appnames.length] = appname;
		console.log('Added '+appname);
	}
}

//HTTP Directory definition
app.use(express.static(__dirname + '/public'));

//Start HTTP server
http.listen(25505, function() {
	//Log connection adresses
	var inter = os.networkInterfaces();
	var connected = [];
	for(ifa in inter) {
		var addrs = inter[ifa];
		for(addr in addrs) {
			var info = addrs[addr];
			if(info.family == 'IPv4' && info.internal == false) {
				connected[connected.length] = info.address+':25505';
			}
		}
	}
	console.log('Ready to connect on '+connected);
});

//Socket events
io.on('connection', function(socket) {
	console.log('Socket #'+socket.id+' connected');

	//On socket disconnected
	socket.on('disconnect', function() {
	    	console.log('Socket #'+socket.id+' disconnected');
	});

	//Send apps list
	socket.on('apps', function() {
	    	socket.emit('apps', appnames);
	});

	//[DEBUG] Logger
	socket.on('console', function(msg) {
	    	console.log('console: ' + msg);
	});
});

console.log('Successfully started.');
