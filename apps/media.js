//Imports
var main = require('../index.js');
var path;
var fs;
var compatible = ['.mp3','.mp4'];

//Modules try
try {
	fs = require('fs');
	path = require('path');
} catch(ex) {
	console.log(ex.toString());
	return;
}

//Medias counter
var media = '';

var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

//Socket events
main.io.on('connection', function(socket) {
	//Send requested file list
	socket.on('listfiles', function(msg) {
		var file = home+'/'+msg;
		try {
			var files = fs.readdirSync(file);
			var ok = [];
			for(i in files) {
				var ext = path.extname(files[i]);
				if(files[i].indexOf('.') != 0 && (ext == '' || compatible.indexOf(ext) != -1)) {
					if(ext == '') {
						try {
							fs.readdirSync(file+'/'+files[i]);
							ok[ok.length] = files[i];
						} catch(ex) {}
					} else {
						ok[ok.length] = files[i];
					}
				}
			}
			socket.emit('files', ok);
		} catch(ex) {
			socket.emit('alert', 'Incompatible file');
		}
	});

	//Play requested media file remotely
  	socket.on('playmedia', function(msg) {
		console.log('play media: '+msg);
		var file = home+'/'+msg;
		media++;

		main.app.get('/media'+media, function(req, res) {
			res.sendFile(file);
		});
		socket.emit('playmedia','../media'+media);
	});
});

exports.success = true;
