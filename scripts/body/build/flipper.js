'use strict';
body.build.flipper = {
	show: function() {
		this.container.set()
			.display('block');
	},
	hide: function() {
		this.container.set()
			.display('none');
	},
	setVariables: function(winWidth,winHeight,prefs) {
		var $ = this, dom = body.helpers.dom;
		$.currentFront = prefs.details.flipperFront;
		$.toFlip = undefined;
		$.left = menuWidth+body.build.editor.offsetSide+body.build.editor.width+body.build.horizontalPadding*2;
		$.top = body.build.verticalPadding;
		$.topHeight = Math.round(winHeight/14);
		$.width = winWidth-$.left-body.build.horizontalPadding;
		$.height = body.build.sidebarHeight;
		$.sideHeight = $.height-$.topHeight;
		$.borderRadius = 4;
		// container
			$.container = dom.create('div',head.design.htmlBody);
			$.container.style.WebkitPerspective = '1000';
			$.container.set()
				.display('none')
				.width($.width)
				.height($.height)
				.position('absolute')
				.left($.left)
				.top($.top);
		// top
			$.top = dom.create('div',$.container);
			$.top.set()
				.width($.width)
				.height($.topHeight)
				.borderRadius(12)
				.overflow('hidden');
		// flip buttons
			var flipButtonValues = { width: $.width/2, height: $.topHeight, background: 'blue', hover: 'red', active: 'green', font: 'Times New Roman', size: 24, color: 'white' };
			// selector
				$.selectedBackground = 'yellow';
				$.selectorButton = dom.makeButton($.top,'select',flipButtonValues,function() {
					if($.toFlip && $.currentFront!=='selector') $.switchToSelector();
				});
				$.selectorButton.set()
					.position('absolute')
					.left(0)
					.borderRadius($.borderRadius,['TopLeft']);
			// editor
				$.editorButton = dom.makeButton($.top,'edit',flipButtonValues,function() {
					if($.toFlip && $.currentFront!=='editor') $.switchToEditor();
				});
				$.editorButton.set()
					.position('absolute')
					.left($.width/2)
					.borderRadius($.borderRadius,['TopRight']);
		// flip container
			$.flipContainer = dom.create('div',$.container);
			$.flipContainer.set().position('relative');
			$.flipContainer.set().transition('0.6s');
			$.flipContainer.style.WebkitTransformStyle = 'preserve-3d';
		// front
			$.front = dom.create('div',$.flipContainer);
			$.front.style.WebkitBackfaceVisibility = 'hidden';
			$.front.style.WebkitTransform = 'rotateY(0deg)';
			$.front.set()
				.width($.width)
				.height($.sideHeight)
				.background('orange')
				.position('absolute')
				.top(0).left(0)
				.borderRadius($.borderRadius,['BottomLeft','BottomRight']);
		// back
			$.back = dom.create('div',$.flipContainer);
			$.back.style.WebkitBackfaceVisibility = 'hidden';
			$.back.style.WebkitTransform = 'rotateY(180deg)';
			$.back.set()
				.width($.width)
				.height($.sideHeight)
				.background('orange')
				.position('absolute')
				.top(0).left(0)
				.borderRadius($.borderRadius,['BottomLeft','BottomRight']);
	},
	changeLayout: function(width,height) {
		var $ = this;
		// change width and height
		body.build.selector.changeLayout($.width,$.height);
		body.build.controls.changeLayout($.width,$.height);
	},
	switchToEditor: function() {
		var $ = this;
		$.flip('controls');
		$.editorButton.resetBackground('yellow');
		$.selectorButton.resetBackground('blue');
	},
	switchToSelector: function() {
		var $ = this;
		$.flip('selector');
		$.selectorButton.resetBackground('yellow');
		$.editorButton.resetBackground('blue');
	},
	flip: function(side) {
		var $ = this;
		if(side!==tail.storage.preferences.build.details.flipperFront) {
			if(side==='controls') $.flipContainer.set().transform('rotateY(-180deg)');
			else $.flipContainer.set().transform('rotateY(180deg)');
			$.currentFront = side;
		} else {
			$.flipContainer.set().transform('rotateY(0deg)');
			$.currentFront = side;
		}
	},
	setState: function() {
		var $ = this,
			prefs = tail.storage.preferences.build;
		// for now
			$.toFlip = true;
		if(prefs.details.flipperFront==='selector') {
			$.selectorButton.resetBackground('yellow');
		} else {
			$.editorButton.resetBackground('yellow');
		}
	},
	init: function(winWidth,winHeight) {
		var $ = this, prefs = body.build.prefs;
		$.setVariables(winWidth,winHeight,prefs);
		$.changeLayout(winWidth,winHeight);
		$.setState();
	}
}