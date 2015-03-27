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
		socket.emit('arch-axis', axx+','+axy);
	}
}, 10);

setInterval(function() {
	if(caxx != gamepad.axes[2] || caxy != gamepad.axes[3]) {
		caxx = gamepad.axes[2];
		caxy = gamepad.axes[3];
		socket.emit('arch-axis-c', caxx+','+caxy);
	}
}, 10);

setInterval(function() {
	if(gamepad.buttons.toString() != buttons) {
		buttons = gamepad.buttons.toString();
		socket.emit('arch-buttons', buttons);
	}
}, 10);

var bottom = document.getElementById('bottomscreen');
bottom.addEventListener('mousemove', function(evt) {
	socket.emit('arch-mouse-move', evt.clientX+','+evt.clientY);
}, false);
bottom.addEventListener('mousedown', function(evt) {
	socket.emit('arch-mouse-down', evt.clientX+','+evt.clientY);
}, false);
bottom.addEventListener('mouseup', function(evt) {
	socket.emit('arch-mouse-up', evt.clientX+','+evt.clientY);
}, false);
bottom.addEventListener('click', function(evt) {
	socket.emit('arch-mouse-click', evt.clientX+','+evt.clientY);
}, false);

socket.on('screen-update', function(msg) {
	var top = document.getElementById('topscreen');
	var top_image = new Image();
	top_image.src = '../topscreen';
	top_image.onload = function(){
		top.getContext('2d').drawImage(top_image, 0, 0);
	}

	var bottom = document.getElementById('bottomscreen');
	var bottom_image = new Image();
	bottom_image.src = '../bottomscreen';
	bottom_image.onload = function(){
		bottom.getContext('2d').drawImage(bottom_image, 0, 0);
	}
});

socket.on('popup', function(msg) {
	alert(msg);
});

var logo = document.getElementById("topscreen");
var logo_image = new Image();
logo_image.src = '../logo/logo.gif';
logo_image.onload = function(){
	logo.getContext('2d').drawImage(logo_image, 0, 0);
}
