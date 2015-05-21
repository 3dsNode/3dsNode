var socket = io();
var actual = '';
var compatible = ['mp3','mp4','avi','avi','ogv','mkv'];

var bottom = document.getElementById('bottom');

var createSelect = function(msg) {
	if(document.getElementById('files') != null) {
		bottom.removeChild(document.getElementById('files'));
	}
	var select = document.createElement('select');
	select.id = 'files';
	select.onchange = function() {
		var dir = actual;
		if(dir != '' && select.value != '') {
			dir = dir+'/';
		}

		var comp = false;
		for(i in compatible) {
			if(select.value.indexOf(compatible[i]) != -1) {
				socket.emit('playmedia', dir+select.value);
				comp = true;
			}
		}
		if(!comp) {
			socket.emit('listfiles', dir+select.value);
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
	bottom.removeChild(document.getElementById('files'));
	actual = '';
	createSelect([]);
	socket.emit('listfiles', '');
};
bottom.appendChild(root);

var back = document.createElement('button');
back.innerHTML = '..';
back.onclick = function() {
	bottom.removeChild(document.getElementById('files'));
	actual = actual.lastIndexOf('/') == -1 ? '' : actual.substring(0,actual.lastIndexOf('/'));
	createSelect([]);
	socket.emit('listfiles', actual);
};
bottom.appendChild(back);

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

createSelect([]);

socket.emit('listfiles', '');

socket.on('files', function(msg) {
	createSelect(msg);
});

socket.on('playmedia', function(msg) {
	document.location.href = msg;
});

socket.on('mediainfo', function(msg) {
	bottom.innerHTML = msg;
});

socket.on('mediaload', function(msg) {
	bottom.innerHTML = msg+'%'+'<br><progress value="'+msg+'" max="100"></progress>';
});

socket.on('alert', function(msg) {
	alert(msg);
});
