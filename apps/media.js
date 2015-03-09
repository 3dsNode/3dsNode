//Imports
var main = require('../index.js');
var config;
var fs;

//Modules try
try {
	config = require('config');
} catch(ex) {
	console.log(ex.toString());
	return;
}

//Medias counter
var media = '';

//Socket events
main.io.on('connection', function(socket) {
	//Send requested file list
	socket.on('listfiles', function(msg) {
		var file = '';
		if(msg.indexOf('@') != -1) {
			var list = msg.split('@');
			file = config.get(list[0])+'/'+list[1];
		} else {
			file = config.get(msg);
		}
		try {
			socket.emit('files', fs.readdirSync(file));
		} catch(ex) {
			socket.emit('alert', 'Incompatible file');
		}
	});

	//Play requested media file remotely
  	socket.on('playmedia', function(msg) {
		console.log('play media: '+msg);
		var file = '';
		media++;
		if(msg.indexOf('@') != -1) {
			var list = msg.split('@');
			file = config.get(list[0])+'/'+list[1];
		} else {
			file = msg;
		}
		app.get('/media'+media, function(req, res) {
			res.sendFile(file);
		});
		socket.emit('playmedia','./media'+media);
	});
});

exports.success = true;
