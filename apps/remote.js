//Imports
var main = require('../index.js');
var path;
var fs;
var ffmpeg;

//Modules try
try {
	fs = require('fs');
	path = require('path');
	ffmpeg = require('fluent-ffmpeg');
} catch(ex) {
	console.log(ex.toString());
	return;
}

//Medias counter
var media = '';
var compatible = ['.mp4','.avi','.ogv','.mkv'];

var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

main.app.get('/remote', function(req, res) {
	res.sendFile(main.dir + '/public/computer/remote.html');
});
main.app.get('/remote.js', function(req, res) {
	res.sendFile(main.dir + '/public/computer/remote.js');
});
console.log('Remote: Connect your video player to *:25505/remote');

//Socket events
main.io.on('connection', function(socket) {
	//Send requested file list
	socket.on('listfiles-remote', function(msg) {
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
  	socket.on('playremote', function(msg) {
		media++;

		console.log('play remote: '+msg);
		var file = home+'/'+msg;
		var outdir = main.os.tmpdir()+'/3dsnode';
		var out = outdir+'/remote-'+path.basename(msg).replace(path.extname(msg),'')+'.mp4';

		if(!fs.existsSync(outdir))
			fs.mkdirSync(outdir);

		console.log(path.extname(msg));
		if(!fs.existsSync(out) && path.extname(msg) != '.mp4') {
			var command = ffmpeg(file).audioCodec('aac').videoCodec('libx264')
			.on('progress', function(progress) {
				socket.emit('mediainfo','Transcoding progress: '+Math.round(progress.percent * 100) / 100+'%');
			})
			.on('error', function(err) {
				socket.emit('mediainfo','Error: '+err.message);
			})
			.on('end', function() {
				console.log('Finished transcoding!');
				main.app.get('/remote'+media, function(req, res) {
					res.sendFile(out);
				});
				main.io.sockets.emit('playremote','../../remote'+media);
			}).save(out);
		} else if(fs.existsSync(out)) {
			main.app.get('/remote'+media, function(req, res) {
				res.sendFile(out);
			});
			main.io.sockets.emit('playremote','../../remote'+media);
		} else {
			main.app.get('/remote'+media, function(req, res) {
				res.sendFile(file);
			});
			main.io.sockets.emit('playremote','../../remote'+media);
		}
	});

	//Broadcast requests to players
  	socket.on('remote-ctrl', function(msg) {
		main.io.sockets.emit('remote-ctrl',msg);
	});
});

exports.success = true;
