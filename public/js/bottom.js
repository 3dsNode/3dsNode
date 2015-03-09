var head = document.getElementsByTagName('head')[0];
var link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';

if(navigator.userAgent.indexOf("New Nintendo 3DS") != -1) {
	link.href = './css/stylesheetn3ds.css';
} else {
	link.href = './css/stylesheet.css';
}
head.appendChild(link);

setInterval(function() {
	window.scrollTo(340, 465);
}, 10);
