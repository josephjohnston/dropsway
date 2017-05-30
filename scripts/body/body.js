//= require_self
//= require ./helpers/variables
//= require ./helpers/dom
//= require ./menu
//= require ./build/editor
//= require ./build/params
//= require ./build/keyboard
//= require ./build/flipper
//= require ./build/selector
//= require ./build/controls
//= require ./build/guide
//= require ./browse/header
//= require ./browse/panel
//= require ./browse/popup
//= require ./browse/keys

var body = {
	helpers: {},
	browse: {
		init: function(winWidth,winHeight) {
			var $ = this;
			$.prefs = tail.storage.preferences.browse;
			$.header.init(winWidth,winHeight);
			$.panel.init(winWidth,winHeight);
			$.popup.init(winWidth,winHeight);
			$.keys.init(winWidth,winHeight);
		}
	},
	build: {
		verticalPadding: 30,
		horizontalPadding: 50,
		init: function(winWidth,winHeight) {
			var $ = this;
			// set variables
				$.prefs = tail.storage.preferences.build;
				$.verticalPadding = winHeight/16;
				$.horizontalPadding = winWidth/32;
				$.sidebarHeight = winHeight-$.verticalPadding*2;
				$.hideOffset = winWidth*2/3;
			// init
				$.editor.init(winWidth,winHeight);
				$.params.init(winWidth,winHeight);
				$.keyboard.init(winWidth,winHeight);
				$.flipper.init(winWidth,winHeight);
				$.selector.init();
				$.controls.init();
				$.guide.init(winWidth,winHeight);
		}
	},
	init: function(winWidth,winHeight) {
		var $ = this;
		$.helpers.dom.init();
		// $.instruments.init(winWidth,winHeight);
		$.build.init(winWidth,winHeight);
		$.browse.init(winWidth,winHeight);
		$.menu.init(winWidth,winHeight);
	}
}
// instrument stuff
	// body.instruments = {
	// 	setVariables: function() {
	// 		var $ = this;
	// 		$.planeWidth = 800;
	// 		$.planeHeight = 400;
	// 		$.sideBarWidth = 340;
	// 		$.sideBarHeight = 400;
	// 		$.sampleRate = 44100;
	// 		$.nyquist = $.sampleRate/2;
	// 		$.numOctaves = Math.log($.nyquist/10)/Math.LN2;
	// 		$.initialTabName = 'filters';
	// 	},
	// 	filterValueToReal: function(property,value) {
	// 		var $ = this, realValue;
	// 		if(property==='frequency') {
	// 			realValue = $.nyquist*Math.pow(2,$.numOctaves*(value-1));
	// 		} else if(property==='quality') {
	// 			realValue = 1000*Math.pow(2,20*(value-1)); // fudged, idk what i'm doing but it works
	// 		} else {
	// 			realValue = value;
	// 		}
	// 		return realValue;
	// 	},
	// 	init: function(width,height) {
	// 		var $ = this;
	// 		$.setVariables();
	// 		$.player.init();
	// 		$.plane.init(width,height);
	// 		$.sideBar.init(width,height);
	// 		$.tabs.init(width,height);
	// 	}
	// }
	// body.browse = {
	// 	init: function(width,height) {
	// 		var $ = this;
	// 		$.header.init(width,height);
	// 		$.panel.init(width,height);
	// 		$.keys.init(width,height);
	// 	}
	// }
	// body.build = {
	// 	init: function(width,height) {
	// 		var $ = this;
	// 		$.editor.init(width,height);
	// 		// $.adjuster.init(width,height);
	// 		$.flipper.init(width,height);
	// 		$.selector.init();
	// 		$.controls.init();
	// 	}
	// }
// extras
	function preservePointer() {
		htmlBody.style.cursor = 'pointer';
	}
	function defaultCursor() {
		htmlBody.style.cursor = 'default';
	}
	function nsResizeCursor() {
		htmlBody.style.cursor = 'ns-resize';
	}
	function ewResizeCursor() {
		htmlBody.style.cursor = 'ew-resize';
	}
	window.oncontextmenu = function(e) {
		e.preventDefault();
	}
	function preventDefaults() {
		// window.addEventListener('mousedown',function(e) {
		// 	e.preventDefault();
		// });
		// window.addEventListener('mousemove',function(e) {
		// 	e.preventDefault();
		// });
	}
	preventDefaults();
	// exiting
		exiting = undefined;
		window.addEventListener('mousedown',function() {
			if(exiting) {
				exiting();
				exiting = undefined;
			}
		});
	function randomColor() {
		var colors = ['blue','green','red','yellow','orange','purple'];
		return colors[Math.floor(Math.random()*colors.length)];
	}


