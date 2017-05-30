head.media = {
	setVariables: function() {
		var $ = this;
		$.width = window.innerWidth;
		$.height = window.innerHeight;
	},
	setListener: function() {
		var $ = this;
		window.onresize = function() {
			$.width = window.innerWidth;
			$.height = window.innerHeight;
			// head.design.changeLayout($.width,$.height);
		}
	},
	init: function() {
		var $ = this;
		$.setVariables();
		$.setListener();
	}
}