var f = 1;
var pause = false;

for(i = 2; i <= 15; i++) {
	document.getElementById('topscreen'+i).src = './top/'+i+'.png';
	document.getElementById('topscreen'+i).style.display = 'none';
}

function PlayPause() {
	pause = !pause;
	if(pause) {
		document.getElementById('playpause').innerHTML = 'Play';
		document.getElementById('topscreen'+f).src = './logo/logo.gif';
	} else {
		document.getElementById('playpause').innerHTML = 'Pause';
	}
}

PlayPause();

setInterval(function() {
	document.getElementById('console').innerHTML = 'Frame: '+f;
}, 10);

function getNext() {
	if(f == 15) {
		return 1;
	} else {
		return f+1;
	}
}

function getLast() {
	if(f == 1) {
		return 15;
	} else {
		return f-1;
	}
}
	
setInterval(function() {
	if(pause) {
		return;
	}
	document.getElementById('topscreen'+getLast()).src = './top/'+f+'.png';

	document.getElementById('topscreen'+f).style.display = 'none';

	document.getElementById('topscreen'+getNext()).style.display = 'block';

	f = getNext();
}, 300);
