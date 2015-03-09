var socket = io();
var media = '';
var actual = '';
var compatible = ['mp3','mp4'];
var medias = ['Music','Video'];

var bottom = document.getElementById('bottom');

var createSelect = function() {
	var select = document.createElement('select');
	select.id = 'files';
	select.onchange = function() {
		media = select.value;
		socket.emit('listfiles', media);
	};
	bottom.appendChild(select);

	for(i in medias) {
		var option = document.createElement('option');
		option.innerHTML = medias[i];
		option.value = 'Media.'+medias[i].toLowerCase();
		select.appendChild(option);
	}
}

var loc = document.createElement('p');
loc.id = 'loc';
loc.style.fontSize = 'x-small';
bottom.appendChild(loc);

setInterval(function() {
	loc.innerHTML = actual == '' ? '/' : actual;
}, 30);

var root = document.createElement('button');
root.innerHTML = '/';
root.onclick = function() {
	if(media != '') {
		bottom.removeChild(document.getElementById('files'));
		actual = '';
		media = '';
		createSelect();
	}
};
bottom.appendChild(root);

var play = document.createElement('button');
play.innerHTML = 'go';
play.onclick = function() {
	select = document.getElementById('files');
	if(select != null) {
		select.onchange();
	}
};
bottom.appendChild(play);

bottom.appendChild(document.createElement('br'));

createSelect();

socket.on('files', function(msg) {
	if(document.getElementById('files') != null) {
		bottom.removeChild(document.getElementById('files'));
	}
	var select = document.createElement('select');
	select.id = 'files';
	select.onchange = function() {
		var dir = actual;
		if(dir != '') {
			dir = dir+'/';
		}

		var comp = false;
		for(i in compatible) {
			if(select.value.indexOf(compatible[i]) != -1) {
				socket.emit('playmedia', media+'@'+dir+select.value);
				comp = true;
			}
		}
		if(!comp) {
			socket.emit('listfiles', media+'@'+dir+select.value);
			actual = dir+select.value;
		}
	}
	bottom.appendChild(select);

	for(i in msg) {
		var option = document.createElement('option');
		option.innerHTML = msg[i];
		option.value = msg[i];
		select.appendChild(option);
	}
});

socket.on('playmedia', function(msg) {
	document.location.href = msg;
});

socket.on('alert', function(msg) {
	alert(msg);
});
