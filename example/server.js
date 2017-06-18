/**
 * created fajarlabs
 *
 * rtsp to image stream by socket
 */

 var express = require('express');
 var path = require('path');
 var app = express();
 var server = require('http').Server(app);
 var io = require('socket.io')(server);
 var rtsp = require('../lib/rtsp-ffmpeg');

// buat folder assets
app.use(express.static(__dirname + '/public'));

// use rtsp = require('rtsp-ffmpeg') instead if you have install the package
server.listen(6147, function(){
	console.log('Listening on localhost:6147');
});

// camera sources
var cams = [
{ camera : 'camera1', source : 'rtsp://mpv.cdn3.bigCDN.com:554/bigCDN/definst/mp4:bigbuckbunnyiphone_400.mp4' },
{ camera : 'camera2', source : 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov'}
].map(function(uri, i) {

	var result = {};

		// Start camera stream
		result.stream = new rtsp.FFMpeg({input: uri.source, resolution: '320x240', quality: 3});
		result.stream.on('start', function() {
			console.log('stream ' + uri.camera + ' started');
		});
		result.stream.on('stop', function() {
			console.log('stream ' + uri.camera + ' stopped');
		});

		// Camera name
		result.camera = uri.camera;

		return result;
	});


cams.forEach(function(camStream, i) {
	var ns = io.of(camStream.camera);
	ns.on('connection', function(wsocket) {
		console.log(camStream.camera);
		var pipeStream = function(data) {
			wsocket.emit('data', data);
		};
		camStream.stream.on('data', pipeStream);

		wsocket.on('disconnect', function() {
			console.log(camStream.camera);
			camStream.stream.removeListener('data', pipeStream);
		});
	});
});

io.on('connection', function(socket) {
	socket.emit('start', cams.length);
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
