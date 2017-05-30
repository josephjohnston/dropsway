tail.sound = {
	setVariables: function() {
		var $ = this;
		$.k = Math.pow(2,1/12);
		$.c1 = 440/Math.pow($.k,45);
		$.bottomNoteNum = 24; // C1
		$.tempo = 112;
		$.measureTime = 4/$.tempo*60;
		$.secondsPerThirtySecond = $.measureTime/32;
	},
	playBuildPhrase: function(shapes,measureStart) {
		var $ = this, startSec = measureStart*32;
		for(var i=0; i<shapes.length; i++) {
			var shape = shapes[i];
			if(startSec<=shape[0]) {
				var s = (shape[0]-startSec)*$.timeSec,
					t = (shape[1]-startSec)*$.timeSec,
					n = 107-shape[2];
				$.makeNote(s,t,n);
			}
		}
	},
	playBrowsePhrase: function(shapes) {
		var $ = this;
		for(var i=0; i<shapes.length; i++) {
			var shape = shapes[i];
			var s = shape[0]*$.timeSec,
				t = shape[1]*$.timeSec,
				n = 107-shape[2];
			$.makeNote(s,t,n);
		}
	},
	stopBrowsePhrase: function() {
		var $ = this;
	},
	makeNote: function(s,t,n) {
		var $ = this;
		var oscillator = $.context.createOscillator();
		oscillator.connect($.context.destination);
		oscillator.type = 0;
		oscillator.frequency.value = 440*Math.pow(2,(n-69)/12);
		oscillator.noteOn($.context.currentTime+s);
		oscillator.noteOff($.context.currentTime+t);
	},
	init: function() {
		var $ = this;
		$.context = new webkitAudioContext();
		var ctx = $.context;
		// start immediately
			var osc = ctx.createOscillator();
			osc.start(0)
			osc.stop(0.001);
		$.setVariables();
		$.measureTime = 2;
		$.timeSec = $.measureTime/32;

		var request = new XMLHttpRequest();
		request.open('get','http://localhost:9292/audios/enya.wav',true);
		// request.send();
		request.responseType = 'arraybuffer';
		request.onload = function() {
			ctx.decodeAudioData(request.response,function(buffer) {
				var wave = buffer.getChannelData(0);

				var source1 = ctx.createBufferSource();
				source1.buffer = buffer;
				// source1.buffer = ctx.createBuffer(1,wave.length,44100);
				// source1.loop = true;
			//	source1.playbackRate.value = 8;
				source1.connect(ctx.destination);
				// var data1 = source1.buffer.getChannelData(0);
				// for(var i=0; i<wave.length; i++) {
				// 	data1[i] = wave[i];
				// }
				console.log(buffer);
				// source1.start(0);
				// source1.stop(5);

				// var source2 = ctx.createBufferSource();
				// source2.buffer = ctx.createBuffer(1,wave.length,41000);
				// source2.loop = true;
				// source2.playbackRate.value = 1.6;
				// source2.connect(ctx.destination);
				// var data2 = source2.buffer.getChannelData(0);
				// for(var i=0; i<wave.length; i++) {
				// 	data2[i] = wave[i];
				// }
				// source2.start(0);
				// source2.stop(5);
				

				var filter = ctx.createBiquadFilter();
				filter.type = 1;
				filter.frequency.value = 940;

				// source.connect(filter);
				//filter.connect(ctx.destination);

			},onError);
		}
		function onError(error) {
			alert(error);
		}
	}
}