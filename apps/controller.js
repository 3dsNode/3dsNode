//Imports
var robot;
var config;
var main = require('../index.js');

//Modules try
try {
	robot = require("kbm-robot");
	config = require('config');
} catch(ex) {
	console.log(ex.toString());
	return;
}

robot.startJar();

//Controller keys definition
var Mask = config.get("Controller.physical");
var Controls = config.get("Controller.screen");

//Mouse move modifier
var mouse_x = 0;
var mouse_y = 0;
var s_mouse_x = 1;
var s_mouse_y = 1;

function action(key, pressed) {
	if(key.indexOf("MOUSE_") != -1) {
		//Emulated mouse
		if(pressed == 1) {
			robot.mousePress(key).go();
		} else {
			robot.mouseRelease(key).go();
		}
	} else {
		//Emulated keyboard
		if(pressed == 1) {
			robot.press(key).go();
		} else {
			robot.release(key).go();
		}
	}
}

//Socket events
main.io.on('connection', function(socket) {
	var buttons = null;

	//Physical buttons (New 3DS)
	socket.on('buttons', function(msg) {
		if(buttons == null) {
			buttons = msg.split(',');
		}

		var nb = msg.split(',');
		for(i in nb) {
			if(nb[i] != buttons[i]) {
				action(Mask[i],nb[i]);
			}
		}
		buttons = nb;
	});

	//Emulated keyboard (On screen buttons)
	socket.on('sbutton', function(msg) {
		action(Controls[msg],'1');
		action(Controls[msg],'0');
	});

	//Mouse modifier (Left stick)
	socket.on('axis', function(msg) {
		if(msg != null && msg.indexOf(' and ') > -1) {
			var split = msg.split(' and ');
			mouse_x = +split[0];
			mouse_y = +split[1];
			mouse_x*=5;
			mouse_y*=5;
		}
	});

	//Mouse modifier (Right stick)
	socket.on('axis-c', function(msg) {
		if(msg != null && msg.indexOf(' and ') > -1) {
			var split = msg.split(' and ');
			mouse_x = +split[0];
			mouse_y = +split[1];
			mouse_x*=20;
			mouse_y*=20;
		}
	});
});

//Moving mouse if needed
setInterval(function() {
	if(mouse_x != 0 || mouse_y != 0) {
		s_mouse_x = Math.floor(s_mouse_x+mouse_x);
		s_mouse_y = Math.floor(s_mouse_y+mouse_y);
		robot.mouseMove(s_mouse_x, s_mouse_y).go();
	}
}, 5);

exports.success = true;
