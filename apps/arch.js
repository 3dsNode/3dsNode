//Imports
var process = require('child_process');
var StringDecoder = require('string_decoder').StringDecoder;
var main = require('../index.js');

var emu = process.exec('java -jar apps/arch/arch_server.jar');

emu.stdout.on('data',function(chunk){
	var decoder = new StringDecoder('utf8');
	var inst = decoder.write(chunk);
	if(inst == 'TOP_UPDATE') {
		main.io.emit('screen-update-top','');
	} else if(inst == 'BOTTOM_UPDATE') {
		main.io.emit('screen-update-bottom','');
	} else if(inst.indexOf('POPUP:') == 0) {
		main.io.emit('popup',inst.replace('POPUP:',''));
	}
});

emu.stderr.on('data',function(chunk){
	var decoder = new StringDecoder('utf8');
	console.log(decoder.write(chunk));
});

main.io.on('connection', function(socket) {
	socket.on('arch-buttons', function(msg) {
		emu.stdin.write("BUTTONS:"+msg+"\n");
	});

	socket.on('arch-axis', function(msg) {
		emu.stdin.write("AXIS:"+msg+"\n");
	});

	socket.on('arch-axis-c', function(msg) {
		emu.stdin.write("AXISC:"+msg+"\n");
	});

	socket.on('arch-mouse-down', function(msg) {
		emu.stdin.write("MOUSEDOWN:"+msg+"\n");
	});

	socket.on('arch-mouse-up', function(msg) {
		emu.stdin.write("MOUSEUP:"+msg+"\n");
	});

	socket.on('arch-mouse-click', function(msg) {
		emu.stdin.write("MOUSECLICK:"+msg+"\n");
	});

	socket.on('arch-mouse-move', function(msg) {
		emu.stdin.write("MOUSEMOVE:"+msg+"\n");
	});
});

main.app.get('/topscreen', function(req, res) {
	try {
		res.sendFile(main.dir + '/apps/arch/top.png');
	} catch (err) {
		console.log(err);
	}
});
main.app.get('/bottomscreen', function(req, res) {
	try {
		res.sendFile(main.dir + '/apps/arch/bottom.png');
	} catch (err) {
		console.log(err);
	}
});

exports.success = true;
