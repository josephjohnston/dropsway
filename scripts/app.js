//= require_self
//= require head/head
//= require body/body
//= require tail/tail
window.onload = function() {
	setGlobalVariables();
	tail.init();
	head.init();
}
// extras
	function inspect(item) {
		console.log(JSON.stringify(item));
	}
	function l(a) {
		console.log(a);
	}
	String.prototype.capitalize = function() {
		return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	}
// global vairables
	function setGlobalVariables() {
		dom = body.helpers.dom;
		storage = tail.storage;
		htmlBody = document.getElementsByTagName('body')[0];
		menuWidth = 75;
	}