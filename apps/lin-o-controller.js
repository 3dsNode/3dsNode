//Imports
var java;
var main = require('../index.js');

//Modules try
try {
	java = require('java');
} catch(ex) {
	console.log(ex.toString());
	return;
}

//Java classes definition
var Robot = java.import('java.awt.Robot');
var MouseInfo = java.import('java.awt.MouseInfo');
var InputEvent = java.import('java.awt.event.InputEvent');
var KeyEvent = java.import('java.awt.event.KeyEvent');

var robot = new Robot();

//Controller keys definition
var Mask = [KeyEvent.VK_B,KeyEvent.VK_A,KeyEvent.VK_X,KeyEvent.VK_Y,InputEvent.BUTTON1_MASK,InputEvent.BUTTON3_MASK,0,0,0,0,0,0,KeyEvent.VK_UP,KeyEvent.VK_DOWN,KeyEvent.VK_LEFT,KeyEvent.VK_RIGHT];
var Controls = [KeyEvent.VK_O,KeyEvent.VK_P,KeyEvent.VK_WINDOWS,KeyEvent.VK_ENTER,KeyEvent.VK_EXIT,
KeyEvent.VK_BACK_SPACE,KeyEvent.VK_SPACE,
KeyEvent.VK_1,KeyEvent.VK_2,KeyEvent.VK_3,KeyEvent.VK_4,KeyEvent.VK_5,KeyEvent.VK_6,KeyEvent.VK_7,KeyEvent.VK_8,KeyEvent.VK_9];

//Mouse move modifier
var mouse_x = 0;
var mouse_y = 0;

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
						robot.mousePress(Mask[i]);
					} else {
						robot.mouseRelease(Mask[i]);
					}
				} else {
					//Emulated keyboard
					if(nb[i] == 1) {
						robot.keyPress(Mask[i]);
					} else {
						robot.keyRelease(Mask[i]);
					}
				}
			}
		}
		buttons = nb;
	});

	//Emulated keyboard (On screen buttons)
	socket.on('sbutton', function(msg) {
	    	console.log('controls: ' + msg);
		robot.keyPress(Controls[msg]);
		robot.keyRelease(Controls[msg]);
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
	var x = MouseInfo.getPointerInfoSync().getLocationSync().x;
	var y = MouseInfo.getPointerInfoSync().getLocationSync().y;
	robot.mouseMove(Math.floor(x+mouse_x), Math.floor(y+mouse_y));
}, 5);

exports.success = true;
