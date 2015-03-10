//Imports
var robot;
var main = require('../index.js');

//Modules try
try {
	robot = require("kbm-robot");
} catch(ex) {
	console.log(ex.toString());
	return;
}

robot.startJar();

//Controller keys definition
var Mask = ['B','A','X','Y','1','3',0,0,0,0,0,0,'UP','DOWN','LEFT','RIGHT'];
var Controls = ['O','P','WINDOWS','ENTER','EXIT',
'BACKSPACE','SPACE',
'KP_1','KP_2','KP_3','KP_4','KP_5','KP_6','KP_7','KP_8','KP_9'];

//Mouse move modifier
var mouse_x = 0;
var mouse_y = 0;
var s_mouse_x = 0;
var s_mouse_y = 0;

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
				console.log('input: '+i+':'+nb[i]);
	
				if(i == 4 || i == 5) {
					//Emulated mouse (L/R)
					if(nb[i] == 1) {
						robot.mousePress(Mask[i]).go();
					} else {
						robot.mouseRelease(Mask[i]).go();
					}
				} else {
					//Emulated keyboard
					if(nb[i] == 1) {
						robot.press(Mask[i]).go();
					} else {
						robot.release(Mask[i]).go();
					}
				}
			}
		}
		buttons = nb;
	});

	//Emulated keyboard (On screen buttons)
	socket.on('sbutton', function(msg) {
	    console.log('controls: ' + msg);
		robot.type(Controls[msg],10).go();
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
