body.browse.keys = {
	show: function() {
		this.container.set()
			.display('block');
	},
	hide: function() {
		this.container.set()
			.display('none');
	},
	setVariables: function(winWidth,winHeight) {
		var $ = this;
		$.width = 100;
		$.height = winHeight-body.build.verticalPadding*2;
		$.container = dom.create('div',htmlBody);
		$.container.set()
			.display('none')
			.width($.width)
			.height($.height)
			.background('red')
			.position('absolute')
			.left(winWidth-120)
			.top(20);
	},
	makeButtons: function() {
		var $ = this;
		for(var i=0; i<13; i++) {
			var button = dom.create('div',$.container);
			button.set()
				.width($.width)
				.height($.height/13)
				.position('absolute')
				.top(i*($.height/13+1))
				.background('blue');
		}
	},
	changeLayout: function(width,height) {
		var $ = this;
		console.log('keys change layout');
	},
	init: function(winWidth,winHeight) {
		var $ = this;
		$.setVariables(winWidth,winHeight);
		$.makeButtons();
	}
}
