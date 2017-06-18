# rtsp-ffmpeg
Lazy Node.js FFMpeg wrapper for streaming RTSP into MotionJPEG. It runs FFMpeg process only when someone is subscribed to
its `data` event. Every `data` event contains one image `Buffer` object.

## Installation

1. Download [FFmpeg](http://www.ffmpeg.org/) to your local machine.

2. Install package in your project `npm install rtsp-ffmpeg`

## Sample
With [socket.io](http://socket.io/) library.

Server:
```javascript
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
```

Client (index.html):
```html
	<div class="container">
		<div class="row">
			<div class="col-xs-6">
			  	<div class="form-group">
			   		<label for="camera1">Camera 1</label>
			   		<img id="camera1" class="thumbnail" style="height:400px;width: 100%">
			   		<br />
			   		<button id="pause1" class="btn-primary btn btn-sm">Pause</button>
			   		<button id="resume1" class="btn-primary btn btn-sm">Resume</button>
			    </div>
			</div>
			<div class="col-xs-6">
			  	<div class="form-group">
			   		<label for="camera2">Camera 2</label>
			   		<img id="camera2" class="thumbnail" style="height:400px;width: 100%">
			   		<br />
			   		<button id="pause2" class="btn-primary btn btn-sm">Pause</button>
			   		<button id="resume2" class="btn-primary btn btn-sm">Resume</button>
			    </div>
			</div>
		</div>
	</div>

	<script src="https://code.jquery.com/jquery-3.2.1.min.js" ></script>
	<script src="stream.jquery.js" ></script>

	<script src="/socket.io/socket.io.js"></script>
```

For more detailed example look at [/example/server.js](/example/server.js)
For large images resolution or IP cameras example check [/example/server-canvas.js](/example/server-canvas.js)

## FFMpeg

```javascript
$(document).ready(function() {

	//======================================================================/

	// Camera I
	var cam1 = $("#camera1");

	// auto play
	cam1.stream("http://localhost:6147/camera1");

	// event pause
	$('#pause1').on("click",function() {
		cam1.stop();
	});

	// event resume
	$('#resume1').on("click",function() {
		cam1.resume();
	});

	//======================================================================/

	// Camera II
	var cam2 = $("#camera2");

	// auto play
	cam2.stream("http://localhost:6147/camera2");

	// event pause
	$('#pause2').on("click",function() {
		cam2.stop();
	});

	// event resume
	$('#resume2').on("click",function() {
		cam2.resume();
	});

	//======================================================================/
});
```
