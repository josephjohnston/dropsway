'use strict';
body.menu = {
	changeLayout: function(width,height) {
		var $ = this;
		console.log('menu change layout');
	},
	setVariables: function(width,height) {
		var $ = this, dom = body.helpers.dom;
		$.regular = 'black';
		$.hover = 'white';
		$.active = 'purple';
		$.current = 'red';
		$.width = menuWidth;
		$.sec = 50;
		$.color = 'purple';
		$.currentIcon = undefined;
		// div
			$.div = dom.create('div',head.design.htmlBody);
			$.div.set()
				.width($.width)
				.height(height)
				.background($.color)
				.position('absolute');
		// icons
			var pics = storage.menuIcons;
			$.icons = [
				{ name: 'browse', page: 'browse', place: 'top', pic: pics.browse, elements: {} },
				{ name: 'build', page: 'build', place: 'top', pic: pics.build, elements: {} },
				{ name: 'logout', page: 'home', place: 'bottom', pic: pics.logout, elements: {} }
			]
			// css
				var popupRule = $.stylesheet = document.styleSheets[0].cssRules[0].style,
					popupHeight = 36, popupSide = popupHeight/4, borderRadius = popupSide/2;
				popupRule.top = popupSide+'px';
				popupRule.borderTop = popupSide+'px solid transparent';
				popupRule.borderRight = popupSide+'px solid '+$.color;
				popupRule.borderBottom = popupSide+'px solid transparent';
				var popupTextValues = { color: 'white', font: 'Times New Roman', size: 18 };
			for(var i=0; i<$.icons.length; i++) {
				var icon = $.icons[i];
				// div
					icon.elements.div = dom.create('div',$.div);
					icon.elements.div.set()
						.position('absolute')
						.left(($.width-$.sec)/2);
				// position
						if(icon.place==='top') icon.elements.div.set().top($.sec*i+$.sec);
						else icon.elements.div.set().top(height-$.sec*i);
				// canvas
					icon.elements.canvas = dom.create('canvas',icon.elements.div);
					icon.elements.canvas.set().canWidth($.sec).canHeight($.sec).background('blue').position('absolute');
				// a tag
					icon.elements.aTag = dom.create('a',icon.elements.div);
					icon.elements.aTag.set().display('block').width($.sec).height($.sec).position('absolute');
					icon.elements.aTag.href = '/'+icon.page;
					icon.elements.aTag.onclick = function(e) {
						e.preventDefault();
					}
				// popup
					icon.popup = dom.create('div',$.div);
					icon.popup.set()
						.padding(popupHeight/4,['Left','Right'])
						.height(popupHeight).borderRadius(borderRadius).position('absolute')
						.background($.color).left($.width+popupSide).paragraph(icon.name,popupTextValues).display('none');
					// position
						var topMargin = ($.sec-popupHeight)/2;
						if(icon.place==='top') icon.popup.set().top($.sec*i+$.sec+topMargin);
						else icon.popup.set().top(height-$.sec*i+topMargin);
					icon.popup.className = 'menuPopup';
				// events
					(function(icon) {
						icon.elements.aTag.onmouseenter = function() {
							preservePointer();
							if(icon!==$.currentIcon) $.drawIcon(icon,$.hover);
							icon.popup.style.display = 'table';
						}
						icon.elements.aTag.onmouseleave = function() {
							defaultCursor();
							if(icon!==$.currentIcon) $.drawIcon(icon,$.regular);
							icon.popup.style.display = 'none';
						}
						icon.elements.aTag.onmousedown = function() {
							preservePointer();
							if(icon!==$.currentIcon) $.drawIcon(icon,$.active)
						}
						icon.elements.aTag.onmouseup = function() {
							head.url.goTo(icon.page);
						}
					})(icon);
					$.drawIcon(icon,$.regular);
			}
	},
	changeState: function(page) {
		var $ = this;
		if($.currentIcon) $.drawIcon($.currentIcon,$.regular);
		for(var icon in $.icons) {
			if($.icons[icon].name===page) $.currentIcon = $.icons[icon];
		}
		$.drawIcon($.currentIcon,$.current);
	},
	drawIcon: function(icon,color) {
		var $ = this, points = icon.pic, ctx = icon.elements.canvas.context;
		ctx.beginPath();
		ctx.moveTo(points[0],points[1]);
		ctx.lineTo(points[2],points[3]);
		ctx.closePath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 4;
		ctx.stroke();
	},
	init: function(width,height) {
		var $ = this;
		$.setVariables(width,height);
	}
}