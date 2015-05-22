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
var compatible = ['.mp3','.mp4','.avi','.ogv','.mkv'];

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
		media++;

		console.log('play media: '+msg);
		var file = home+'/'+msg;
		var outdir = main.os.tmpdir()+'/3dsnode';
		var out = outdir+'/media-'+path.basename(msg).replace(path.extname(msg),'')+'.mp4';

		if(!fs.existsSync(outdir))
			fs.mkdirSync(outdir);

		if(!fs.existsSync(out) && path.extname(msg) != '.mp4' && path.extname(msg) != '.mp3') {
			var command = ffmpeg(file).audioCodec('aac').videoCodec('libx264').size('400x240')
			.on('progress', function(progress) {
				var nprogress = Math.round(progress.percent * 100) / 100;
				socket.emit('mediaload',nprogress);
				console.log('Trannscoding '+path.basename(msg)+': '+nprogress+'%');
			})
			.on('error', function(err) {
				socket.emit('mediainfo','Error: '+err.message);
			})
			.on('end', function() {
				console.log('Finished transcoding!');
				main.app.get('/media'+media, function(req, res) {
					res.sendFile(out);
				});
				socket.emit('playmedia','../media'+media);
			}).save(out);
		} else if(fs.existsSync(out)) {
			main.app.get('/media'+media, function(req, res) {
				res.sendFile(out);
			});
			socket.emit('playmedia','../media'+media);
		} else {
			main.app.get('/media'+media, function(req, res) {
				res.sendFile(file);
			});
			socket.emit('playmedia','../media'+media);
		}
	});
});

exports.success = true;
