//= require_self
//= require ./controllers/buildCont
//= require ./controllers/browseCont
//= require ./ajax
//= require ./storage
//= require ./sound
//= require ./date
//= require ./converter
var tail = {
	controller: {},
	init: function() {
		var $ = this;
		$.storage.init();
		$.controller.browse.init();
		$.controller.build.init();
		$.sound.init();
	}
}