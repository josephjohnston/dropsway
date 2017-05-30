'use strict';
body.build.guide = {
	show: function() {
		this.container.set()
			.display('block');
	},
	hide: function() {
		this.container.set()
			.display('none');
	},
	setVariables: function(prefs) {
		var $ = this;
		$.borderRadius = 6;
		$.borderHeight = 12;
		$.transitionTime = 0.8;
		$.container = dom.create('div',htmlBody);
		$.container.set()
			.display('none')
			.position('absolute')
			.background('red')
			.borderRadius($.borderRadius,['TopLeft','TopRight']);
		$.topBorder = dom.create('div',$.container);
		$.topBorder.set()
			.position('absolute')
			.background('green')
			.borderRadius($.borderRadius,['TopLeft','TopRight']);
		$.topBorder.onclick = function() {
			body.build.controls.toggleGuide();
		}
		$.topBorder.onmouseenter = function() {
			preservePointer();
		}
		$.topBorder.onmouseleave = function() {
			defaultCursor();
		}
	},
	// structure
		setLayout: function(winWidth,winHeight) {
			var $ = this;
			$.availableHeight = winHeight-body.build.verticalPadding*2;
			$.left = menuWidth+body.build.horizontalPadding+body.build.editor.offsetSide;
			$.width = body.build.editor.width;
			$.container.set()
				.width($.width)
				.left($.left);
			$.topBorder.set()
				.width($.width)
				.height($.borderHeight);
		},
		changeLayout: function(winWidth,winHeight) {
		},
		setTop: function() {
			var $ = this,
				paramsShow = body.build.controls.paramsShow,
				paramHeight = paramsShow ? body.build.params.height : 0;
			$.top = body.build.verticalPadding+body.build.editor.height+paramHeight+body.build.editor.shapeHeight;
		},
		putInView: function() {
			var $ = this;
			$.setTop();
			$.height = $.availableHeight-body.build.editor.shapeHeight;
			$.container.set()
				.height($.height)
				.top($.top);
		},
		putOutView: function() {
			var $ = this,
				winHeight = head.media.height;
			$.setTop();
			$.height = winHeight-$.top;
			$.container.set()
				.height($.height)
				.top($.top);
		},
	mouse: function(e,element) {
		var $ = this,
			rect = element.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		}
	},
	mousedown: function() {
	},
	mouseup: function() {
	},
	mousemove: function() {
	},
	setState: function(prefs) {
		var $ = this, details = prefs.details;
		if(details.guideShow) $.putInView();
		else $.putOutView();
	},
	init: function(winWidth,winHeight) {
		var $ = this, prefs = body.build.prefs;
		$.setVariables(prefs);
		$.setLayout(winWidth,winHeight);
		$.setState(prefs);
	}
}