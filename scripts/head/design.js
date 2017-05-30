'use strict';
head.design = {
	templates: {
		build: ['editor','keyboard','params','flipper','guide'],
		browse: ['header','panel','popup','keys'],
		instruments: ['plane','sideBar']
	},
	setVariables: function() {
		var $ = this;
		$.html = document.getElementsByTagName('html')[0];
		$.htmlBody = htmlBody;
		$.currentTemplate = undefined;
		$.currentTemplateName = undefined;
	},
	switchTemplates: function(page,initialLoading) {
		var $ = this;
		if($.currentTemplate===$.templates[page]) return;
		$.hideTemplate();
		$.currentTemplate = $.templates[page];
		$.currentTemplateName = page;
		$.showTemplate();
	},
	hideTemplate: function() {
		var $ = this;
		for(var i=0; i<$.currentTemplate.length; i++) {
			var element = $.currentTemplate[i],
				object = body[$.currentTemplateName][element];
			object.hide();
		}
	},
	showTemplate: function() {
		var $ = this;
		for(var i=0; i<$.currentTemplate.length; i++) {
			var element = $.currentTemplate[i],
				object = body[$.currentTemplateName][element];
			object.show();
		}
		body.menu.changeState($.currentTemplateName);
	},
	changeLayout: function(winWidth,winHeight) {
		var $ = this;
		$.templates.browse.forEach(function(element) {
			body.browse[element[0]].changeLayout(winWidth,winHeight);
		});
		$.templates.build.forEach(function(element) {
			body.build[element[0]].changeLayout(winWidth,winHeight);
		});
		body.menu.changeLayout(winWidth,winHeight);
	},
	init: function() {
		var $ = this,
			page = head.url.page,
			winWidth = head.media.width,
			winHeight = head.media.height;
		$.setVariables(page);
		$.htmlBody.style.display = 'none';
		// set dimensions
			$.html.style.height = winHeight+'px';
			$.html.style.overflow = 'hidden';
			$.htmlBody.style.height = winHeight+'px';
		// initiate everything
			body.init(winWidth,winHeight);
		$.currentTemplateName = page;
		$.currentTemplate = $.templates[page];
		$.showTemplate();
		$.htmlBody.style.display = 'block';
	}
}