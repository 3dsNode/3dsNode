var socket = io();

var video = document.getElementById('vid');
socket.on('playremote', function(msg) {
	document.getElementById('source').src = msg;
	video.load();
	video.play();
});

socket.on('remote-ctrl', function(msg) {
	if(msg == 'play') {
		video.play();
	}
	if(msg == 'pause') {
		video.pause();
	}
});
