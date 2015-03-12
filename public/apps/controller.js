var socket = io();

var gamepad = navigator.webkitGetGamepads()[0];
var buttons = null;
var axx = gamepad.axes[0];
var axy = gamepad.axes[1];
var caxx = gamepad.axes[2];
var caxy = gamepad.axes[3];

setInterval(function() {
	if(axx != gamepad.axes[0] || axy != gamepad.axes[1]) {
		axx = gamepad.axes[0];
		axy = gamepad.axes[1];
		socket.emit('axis', axx+' and '+axy);
	}
}, 10);

setInterval(function() {
	if(caxx != gamepad.axes[2] || caxy != gamepad.axes[3]) {
		caxx = gamepad.axes[2];
		caxy = gamepad.axes[3];
		socket.emit('axis-c', caxx+' and '+caxy);
	}
}, 10);

setInterval(function() {
	if(gamepad.buttons.toString() != buttons) {
		buttons = gamepad.buttons.toString();
		socket.emit('buttons', buttons);
	}
}, 10);

setInterval(function() {
	document.getElementById('buttons').innerHTML = buttons;
	document.getElementById('axis').innerHTML = axx+':'+axy;
	document.getElementById('axis-c').innerHTML = caxx+':'+caxy;
}, 100);
