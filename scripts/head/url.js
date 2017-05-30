head.url = {
	setVariables: function() {
		var $ = this;
		$.path = window.location.pathname;
		$.page = $.path.substring(1,$.path.length);
	},
	setListener: function() {
		var $ = this;
		window.onpopstate = function(e) {
			head.design.switchTemplates(e.state.page);
		}
	},
	goTo: function(page) {
		var $ = this;
		// window.history.pushState({ page: page },null,'/'+page);
		head.design.switchTemplates(page);
	},
	init: function() {
		var $ = this;
		// window.history.replaceState({ page: 'instruments' },null,'');
		$.setVariables();
		$.setListener();
	}
}