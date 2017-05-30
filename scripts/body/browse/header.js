'use strict';
body.browse.header = {
	show: function() {
		this.container.set()
			.display('block');
	},
	hide: function() {
		this.container.set()
			.display('none');
	},
	changeLayout: function(width,height) {
		var $ = this;
		console.log('header change layout');
	},
	setVariables: function() {
		var $ = this, dom = body.helpers.dom;
		$.width = 1200;
		$.height = 50;
		$.container = dom.create('div',head.design.htmlBody);
		$.container.set()
			.display('none')
			.width($.width)
			.height($.height)
			.background('red')
			.position('absolute')
			.left(100)
			.top(20)
			.borderRadius(10);
		$.feedButton = undefined;
		$.search = {};
		$.sort = undefined;
		$.volume = undefined;
		$.playButton = undefined;
		$.circle = {};
	},
	makeFeedButton: function() {
		var $ = this;
		$.feedButton = dom.create('canvas',$.container);
		$.feedButton.set()
			.canWidth(100)
			.canHeight($.height)
			.background('purple')
			.position('absolute')
			.left(50)
			.top(0);
	},
	makeSearch: function() {
		var $ = this,
			borderRadius = 4,
			height = 40,
			border = 1,
			shadow = 8,
			left = 200,
			top = 5,
			searchWidth = 300,
			magWidth = 50,
			focusColor = 'green',
			blurColor = 'blue';
		$.search.form = dom.create('form',$.container);
		$.search.form.set()
			.att('action','hmm');
		$.search.input = dom.create('input',$.search.form);
		var input = $.search.input;
		input.set()
			.att('type','text')
			.att('placeholder','search')
			.border(border,blurColor)
			.boxShadow(0,0,0,0,blurColor)
			.transition('0.1s')
			.outline('none')
			.borderRadius(borderRadius,['TopLeft','BottomLeft'])
			.width(searchWidth)
			.height(height-border*2-2)
			.position('absolute')
			.left(left)
			.top(top)
			.color('red')
			.size(16)
			.font('HelveticaNeue-UltraLight');
		input.onfocus = function() {
			input.set()
				.boxShadow(0,0,shadow,0,focusColor)
				.border(border,focusColor);
		}
		input.onblur = function() {
			input.set()
				.boxShadow(0,0,0,0,blurColor)
				.border(border,blurColor);
		}
		$.search.magGlass = dom.create('canvas',$.search.form);
		$.search.magGlass.set()
			.canWidth(magWidth)
			.canHeight(height)
			.background('purple')
			.borderRadius(borderRadius,['TopRight','BottomRight'])
			.position('absolute')
			.left(left+searchWidth+border*2)
			.top(top);
		$.search.magGlass.ctx = $.search.magGlass.getContext('2d');
		drawMag('yellow');
		function drawMag(color) {
			var ctx = $.search.magGlass.ctx,
				side = height;
			ctx.moveTo(side,side);
			ctx.lineTo(0,0);
			ctx.strokeStyle = color;
			ctx.stroke();
		}
	},
	makeSort: function() {
		var $ = this;
		$.sort = {};
		var s = $.sort;
		s.top = 0;
		s.left = 700;
		s.width = 40;
		s.itemHeight = 20;
		s.display = dom.create('div',$.container);
		s.display.set()
			.width(s.width)
			.height(s.width)
			.borderRadius(4)
			.background('yellow')
			.position('absolute')
			.left(s.left)
			.top(s.top);
		s.display.onmouseenter = function() {
			s.display.set().background('orange');
		}
		s.display.onmouseleave = function() {
			s.display.set().background('yellow');
		}
		s.display.onmousedown = function() {
			s.display.set().background('red');
		}
		s.selector = new dom.Selector($.container,s.left,s.top,s.display,40,s.width,10,8,s.itemHeight);
		var items = [];
		for(var i=0; i<10; i++) {
			var item = dom.create('div');
			item.set()
				.width(s.width)
				.height(s.itemHeight)
				.border(1,'white')
				.background('green');
			(function(item,i) {
				item.onmouseenter = function() {
					item.set().background('pink');
				}
				item.onmouseleave = function() {
					item.set().background('green');
				}
				item.onmousedown = function() {
					item.set().background('brown');
				}
				item.onclick = function() {
					s.display.set().innerHTML(i+'');
				}
				items.push(item);
			})(item,i);
		}
		s.selector.loadItems(items);
	},
	makeVolume: function() {
		var $ = this,
			values = { width: 100, height: 10, railColor: 'purple', blockColor: 'green' };
		$.volume = dom.makeSlider($.container,values,[0,1,0.5],function() {

		});
		$.volume.set()
			.position('absolute')
			.left(850)
			.top(20);
	},
	makePlayButton: function() {
		var $ = this;
		$.playButton = dom.create('canvas',$.container)
		$.playButton.set()
			.canWidth(30)
			.canHeight(30)
			.background('gray')
			.position('absolute')
			.left(990)
			.top(10);
	},
	makeCircle: function() {
		var $ = this;
		$.circle.canvas = dom.create('canvas',$.container);
		$.circle.canvas.set()
			.canWidth(85)
			.canHeight(85)
			.borderRadius(50)
			.background('green')
			.position('absolute')
			.zIndex(1)
			.left(1060)
			.top(-14);
	},
	init: function() {
		var $ = this;
		$.setVariables();
		// $.makeFeedButton();
		// $.makeSearch();
		$.makeSort();
		// $.makeVolume();
		// $.makePlayButton();
		// $.makeCircle();
	}
}