//Imports
var process = require('child_process');
var StringDecoder = require('string_decoder').StringDecoder;
var main = require('../index.js');

var emu = process.exec('java -jar apps/arch/arch_server.jar');

main.io.on('connection', function(socket) {
	emu.stdout.on('data',function(chunk){
		var decoder = new StringDecoder('utf8');
		var inst = decoder.write(chunk);
		if(inst == 'SCREEN_UPDATE') {
			socket.emit('screen-update','');
		} else if(inst.indexOf('POPUP:') == 0) {
			socket.emit('popup',inst.replace('POPUP:',''));
		}
	});

	emu.stderr.on('data',function(chunk){
		var decoder = new StringDecoder('utf8');
		console.log(decoder.write(chunk));
	});

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
	res.sendFile(main.dir + '/apps/arch/top.png');
});
main.app.get('/bottomscreen', function(req, res) {
	res.sendFile(main.dir + '/apps/arch/bottom.png');
});

exports.success = true;
