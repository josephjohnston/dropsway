//= require_self
//= require ./url
//= require ./media
//= require ./design
var head = {
	init: function() {
		var $ = this;
		$.url.init();
		$.media.init();
		$.design.init();
	}
}