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
exports.os = os;
exports.app = app;
exports.dir = __dirname;

//Logging OS informations
console.log('Running on '+os.platform());

//Apps
var apps = [];
var appnames = [];
var appfiles = fs.readdirSync('./apps');
for(i in appfiles) {
	if(appfiles[i].indexOf('.js') == -1) {
		continue;
	}
	
	var appname = appfiles[i].replace('.js','');
	if(appfiles[i].indexOf('-o-') != -1) {
		var osn = os.platform().substring(0, 3);
		if(appfiles[i].indexOf(osn) == -1) {
			continue;
		} else {
			appname = appname.split('-o-')[1];
		}
	}
	var dsapp = require('./apps/'+appfiles[i]);
	if(dsapp != undefined && dsapp.success) {
		apps[apps.length] = dsapp;
		appnames[appnames.length] = appname;
		console.log('Added: '+appname);
	} else if(dsapp == undefined) {
		console.log('Undefined: '+appname);
	} else if(!dsapp.success) {
		console.log('Unsuccessful launch: '+appname);
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
var sockets = 0;
io.on('connection', function(socket) {
	sockets++;
	var socket_id = sockets;
	console.log('Socket #'+socket_id+' connected');

	//On socket disconnected
	socket.on('disconnect', function() {
	    	console.log('Socket #'+socket_id+' disconnected');
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
