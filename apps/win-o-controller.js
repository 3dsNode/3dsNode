//Imports
var mouse;
var keyboard;
var main = require('../index.js');

//Modules try
try {
	mouse = require('node_mouse');
	keyboard = require('node_keyboard');
} catch(ex) {
	console.log(ex.toString());
	return;
}

console.log(mouse);

//Controller keys definition
var Mask = [keyboard.Key_B,keyboard.Key_A,keyboard.Key_X,keyboard.Key_Y,mouse.Mouse_Left,mouse.Mouse_Right,0,0,0,0,0,0,keyboard.Key_UP,keyboard.Key_DOWN,keyboard.Key_LEFT,keyboard.Key_RIGHT];
var Controls = [keyboard.Key_O,keyboard.Key_P,keyboard.Key_WINDOWS,keyboard.Key_ENTER,keyboard.Key_EXIT,
keyboard.Key_BACK_SPACE,keyboard.Key_SPACE,
keyboard.Key_1,keyboard.Key_2,keyboard.Key_3,keyboard.Key_4,keyboard.Key_5,keyboard.Key_6,keyboard.Key_7,keyboard.Key_8,keyboard.Key_9];

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
						mouse.press(Mask[i]);
					} else {
						mouse.release(Mask[i]);
					}
				} else {
					//Emulated keyboard
					if(nb[i] == 1) {
						keyboard.press(Mask[i]);
					} else {
						keyboard.release(Mask[i]);
					}
				}
			}
		}
		buttons = nb;
	});

	//Emulated keyboard (On screen buttons)
	socket.on('sbutton', function(msg) {
	    console.log('controls: ' + msg);
		keyboard.click(Controls[msg]);
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
	var currentPosition = mouse.getCurrentPosition();
	console.log(JSON.stringify(currentPosition,null,2));
	/*var x = MouseInfo.getPointerInfoSync().getLocationSync().x;
	var y = MouseInfo.getPointerInfoSync().getLocationSync().y;
	robot.mouseMove(Math.floor(x+mouse_x), Math.floor(y+mouse_y));*/
}, 5);

exports.success = true;
