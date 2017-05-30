'use strict';
body.build.selector = {
	// tabs model
		// $.tabs = [
		// 	{ 
		// 		data: { instrument: 'instrument' }, 
		// 		elements: { container: 'div', header: 'div', line: 'div' }, 
		// 		items: [
		// 			{ 
		// 				data: { phrase: {} }, 
		// 				elements: { container: 'div', pic: 'div', body: 'div' } 
		// 			}
		// 		]
		// 	}
		// ];
	setVariables: function() {
		var $ = this, dom = body.helpers.dom;
		// general
			$.selectedItem = undefined;
			$.tabOfSelectedItem = undefined;
			$.tabOpen = undefined;
			$.width = body.build.flipper.width;
			$.height = body.build.flipper.sideHeight;
			$.scrollbarHideExtend = 20;
			$.borderWidth = 1;
			$.borderColor = 'transparent';
			$.borderSides = ['Bottom'];
			$.itemBodyDrawWidth = Math.round($.width/128)*128;
			$.itemHeight = $.width-$.itemBodyDrawWidth;
			$.bottomHeight = 40;
		// elements
			// outer container
				var prefs = tail.storage.preferences.build;
				if(prefs.details.flipperFront==='selector') $.outerContainer = body.build.flipper.front;
				else $.outerContainer = body.build.flipper.back;
				$.outerContainer.set()
					.overflow('hidden');
			// inner container
				$.innerContainer = dom.create('div',$.outerContainer);
				$.innerContainer.set()
					.width($.width+$.scrollbarHideExtend)
					.height($.height-$.bottomHeight)
					.background('green')
					.position('absolute')
					.overflow('auto');
			// bottom
				var bottomValues = { width: $.width, height: $.bottomHeight, background: 'red', hover: 'yellow', active: 'blue', font: 'Times New Roman', size: 20, color: 'white' };
				$.bottom = dom.makeButton($.outerContainer,'new',bottomValues,function() {
					$.controller.newPhrase();
				});
				$.bottom.set()
					.position('absolute')
					.top($.height-$.bottomHeight);
		// tabs
			// set up tabs
				$.tabs = [];
				tail.storage.phrases.build.forEach(function(phrase) {
					var pushed = false;
					$.tabs.forEach(function(tab) {
						if(tab.data.instrument.name===phrase.instrument.name) {
							tab.items.push({
								data: { phrase: phrase },
								elements: {}
							});
							pushed = true;
						}
					});
					if(!pushed) {
						var instrument;
						for(var i=0; i<tail.storage.instruments.length; i++) {
							var aInstrument = tail.storage.instruments[i];
							if(aInstrument.name===phrase.instrument.name) instrument = aInstrument;
						}
						$.tabs.push({
							data: { instrument: instrument },
							elements: {},
							items: [{
								data: { phrase: phrase },
								elements: {}
							}]
						});
					}
				});
			// sort tabs alphabetically
				$.tabs.sort(function(a,b) {
					if(a.data.instrument>b.data.instrument) return 1;
					else if(b.data.instrument>a.data.instrument) return -1;
					else return 0;
				});
		// set selected item
			(function() {
				var initialPhraseID = tail.storage.preferences.build.details.initialPhrase.id;
				for(var t=0; t<$.tabs.length; t++) {
					var tab = $.tabs[t];
					for(var i=0; i<tab.items.length; i++) {
						var item = tab.items[i];
						if(item.data.phrase.id===initialPhraseID) {
							$.selectedItem = item;
							return;
						}
					}
				}
			})();
		// make tabs
			for(var t=0; t<$.tabs.length; t++) {
				$.makeTab($.tabs[t]);
			}
	},
	changeLayout: function(winWidth,winHeight) {
		var $ = this;
	},
	makeTab: function(tab) {
		var $ = this, dom = body.helpers.dom;
		// elements
			// container
				tab.elements.container = dom.create('div',$.innerContainer);
				tab.elements.container.set()
					.width($.width)
					.height($.itemHeight)
					.position('relative')
					.overflow('hidden')
					.transition('0.4s');
			// header
				tab.elements.header = {};
				var header = tab.elements.header,
					margin = 1;
				// container
					header.container = dom.create('div',tab.elements.container);
					header.container.set()
						.width($.width)
						.height($.itemHeight)
						.border($.borderWidth,$.borderColor,$.borderSides);
				// icon
					header.icon = dom.create('canvas',header.container);
					header.icon.set()
						.canWidth($.itemHeight-margin)
						.canHeight($.itemHeight-margin)
						.position('absolute')
						.top(margin)
						.left(margin)
						.background('purple');
					header.icon.ctx = header.icon.getContext('2d');
					$.drawHeaderIcon(tab,$.itemHeight-margin,'regular');
				// title
					header.title = dom.create('div',header.container);
					var titleValues = { color: 'white', font: 'Helvetica', size: 18 };
					header.title.set()
						.width($.width-$.itemHeight-margin)
						.height($.itemHeight-margin)
						.position('absolute')
						.left($.itemHeight)
						.top(margin)
						.background('yellow')
						.display('table')
						.paragraph(tab.data.instrument.name.capitalize(),titleValues);
			// content
				tab.elements.content = dom.create('div',tab.elements.container);
				tab.elements.content.set().mousePointer();
			// line
				tab.elements.line = dom.create('div',tab.elements.content);
				tab.elements.line.set()
					.width($.itemHeight/4-1)
					.position('absolute')
					.left($.itemHeight/2-$.itemHeight/8);
		// listeners
			// icon
				header.icon.onmouseenter = function() {
					$.drawHeaderIcon(tab,$.itemHeight-margin,'hover');
				}
				header.icon.onmouseleave = function() {
					$.drawHeaderIcon(tab,$.itemHeight-margin,'regular');
				}
				header.icon.onmousedown = function() {
					$.drawHeaderIcon(tab,$.itemHeight-margin,'active');
				}
				header.icon.onmouseup = function() {
					$.drawHeaderIcon(tab,$.itemHeight-margin,'hover');
				}
			// oepn/close listener
				header.container.onclick = function(e) {
					if($.tabOpen===tab) $.closeTab(tab);
					else $.showTab(tab);
				}
			// hightlight listener
				tab.elements.container.onmousemove = function(e) {
					var mouseY =  e.clientY-tab.elements.line.getBoundingClientRect().top;
					$.drawItemsSide(tab,mouseY);
				}
			// reset gradient listener
				tab.elements.container.onmouseleave = function() {
					$.drawItemsSide(tab,-$.itemHeight)
				}
		// items
			tab.resetItems = function() {
				// line
					tab.elements.line.set().height((tab.items.length-0.5)*$.itemHeight);
				// sort by date
					tab.items.sort(function(a,b) {
						if(a.data.phrase.date>b.data.phrase.date) return -1;
						else if(b.data.phrase.date>a.data.phrase.date) return 1;
						else return 0;
					});
				// make
					for(var i=0; i<tab.items.length; i++) {
						var item = tab.items[i]
						item.data.placeNum = i;
						if(item.elements.container) tab.elements.content.set().removeChild(item.elements.container);
						$.makeItem(tab,item);
					}
					if(tab.items.length===0) $.closeTab(tab);
				$.drawItemsSide(tab,-$.itemHeight);
			}
			tab.resetItems();
	},
	makeItem: function(tab,item) {
		var $ = this, dom = body.helpers.dom;
		// elements
			// container
				item.elements.container = dom.create('div',tab.elements.content);
				item.elements.container.set()
					.width($.width)
					.height($.itemHeight)
					.position('relative')
					.border($.borderWidth,$.borderColor,$.borderSides);
			// pic
				item.elements.pic = dom.create('div',item.elements.container);
				item.elements.pic.set()
					.width($.itemHeight/2)
					.height($.itemHeight/2)
					.borderRadius($.itemHeight)
					.position('absolute')
					.left($.itemHeight/4)
					.top($.itemHeight/4);
			// circle
				item.elements.circle = dom.create('div',item.elements.pic);
				item.elements.circle.set()
					.width($.itemHeight/3)
					.height($.itemHeight/3)
					.borderRadius($.itemHeight*1.5)
					.position('absolute')
					.left($.itemHeight/12)
					.top($.itemHeight/12)
					.background('gray')
					.display('none');
			// body
				item.elements.body = dom.create('canvas',item.elements.container);
				item.elements.body.set()
					.canWidth($.width-$.itemHeight)
					.canHeight($.itemHeight)
					.background('gray')
					.position('absolute')
					.left($.itemHeight);
		// show circle
			item.elements.container.onmouseenter = function() {
				item.elements.circle.set().display('block');
			}
			item.elements.container.onmouseleave = function() {
				item.elements.circle.set().display('none');
			}
		// select listener
			item.elements.container.onmousedown = function() {
				item.elements.circle.set().background('black');
			}
			item.elements.container.onmouseup = function() {
				item.elements.circle.set().background('gray');
			}
			item.elements.container.onclick = function() {
				preservePointer();
				$.controller.selectPhrase(item.data.phrase.id);
				$.selectItem(tab,item);
			}
		// draw body
			if(item===$.selectedItem) {
				$.selectedItem = item;
				$.tabOfSelectedItem = tab;
				$.drawItemBody(item);
			} else $.drawItemBody(item);
	},
	drawHeaderIcon: function(tab,side,version) {
		var $ = this, ctx = tab.elements.header.icon.ctx;
		tab.data.instrument.icon[version](ctx,side);
	},
	drawItemBody: function(item) {
		var $ = this, dom = body.helpers.dom;
		// variables
			var canvas = item.elements.body, ctx = canvas.context,
				shapes = item.data.phrase.shapes,
				totalIntervals = item.data.phrase.measureNum*32,
				intervalWidth = Math.floor(canvas.width/totalIntervals),
				lastShape = undefined;
		// draw
			for(var i=0; i<shapes.length; i++) {
				var shape = shapes[i];
				if($.selectedItem===item) ctx.fillStyle = 'orange';
				else ctx.fillStyle = 'yellow';
				var start = shape[0]*intervalWidth,
					width = shape[1]*intervalWidth-shape[0]*intervalWidth;
				ctx.fillRect(
					start,
					0,
					width,
					canvas.height
					);
				if(lastShape && lastShape[1]===shape[0]) {
					ctx.fillStyle = 'black';
					ctx.fillRect(start,0,1,canvas.height);
				}
				lastShape = shape;
			}
	},
	drawItemsSide: function(tab,y) {
		var $ = this;
		// variables
			var blur = 30, outsideColor = 'purple', insideColor = 'yellow';
		// draw line
			tab.elements.line.style.background = 
				'-webkit-linear-gradient('
				+outsideColor+' '+(y-blur)+'px,'
				+insideColor+' '+y+'px,'
				+outsideColor+' '+(y+blur)+'px)';
		// draw circles
			tab.items.forEach(function(item) {
				var distTop = item.data.placeNum*$.itemHeight+$.itemHeight/4+item.data.placeNum;
				item.elements.pic.style.background = 
					'-webkit-linear-gradient('
					+outsideColor+' '+(y-blur-distTop)+'px,'
					+insideColor+' '+(y-distTop)+'px,'
					+outsideColor+' '+(y+blur-distTop)+'px)';
			});
	},
	newItem: function(phrase) {
		var $ = this, tab, newItem;
		$.outerContainer.set().display('none');
		for(var i=0; i<$.tabs.length; i++) {
			if($.tabs[i].data.instrument.name===phrase.instrument.name) {
				tab = $.tabs[i];
			}
		}
		var newItem = {
			data: { phrase: phrase },
			elements: {}
		}
		$.selectedItem = newItem;
		// for(var i=0, parent = tab.elements.content; i<tab.items.length; i++) {
		// 	parent.set().removeChild(tab.items[i].elements.container);
		// }
		tab.items.push(newItem);
		tab.resetItems();
		// tab.elements.line.set().height((tab.items.length-0.5)*$.itemHeight);
		// $.drawItemsSide(tab,-$.itemHeight);
		$.openTab(tab);
		// $.redrawItemBodies();
		$.outerContainer.set().display('block');
	},
	deleteItem: function(phrase) {
		var $ = this, tab, item;
		for(var i=0; i<$.tabs.length; i++) {
			if($.tabs[i].data.instrument===phrase.instrument.name) {
				tab = $.tabs[i];
			}
		}
		for(var i=0; i<tab.items.length; i++) {
			if(tab.items[i].data.phrase.id===phrase.id) {
				item = tab.items[i];
				tab.items.splice(i,1);
			}
		}
		tab.elements.content.set().removeChild(item.elements.container);
		tab.resetItems();
	},
	selectItem: function(tab,item) {
		var $ = this;
		$.selectedItem = item;
		$.tabOfSelectedItem = tab;
		$.redrawItemBodies();
	},
	changeSelectedItem: function(newPhrase) {
		var $ = this;
		$.selectedItem.data.phrase = newPhrase;
		$.tabOfSelectedItem.data.instrument = newPhrase.instrument;
		$.redrawItemBodies();
	},
	showNoItem: function() {
		var $ = this;
		$.selectedItem = undefined;
		$.redrawItemBodies();
	},
	redrawItemBodies: function() {
		var $ = this;
		$.tabs.forEach(function(tab) {
			tab.items.forEach(function(item) {
				var canvas = item.elements.body;
				canvas.context.clearRect(0,0,canvas.width,canvas.height);
				$.drawItemBody(item);
			});
		});
	},
	showTab: function(tab) {
		var $ = this;
		if($.tabOpen) $.closeTab($.tabOpen);
		$.openTab(tab);
	},
	openTab: function(tab) {
		var $ = this,
			itemsTotalHeight = tab.items.length*$.itemHeight,
			bordersTotalHeight = tab.items.length+1;
		tab.elements.container.set()
			.height($.itemHeight+itemsTotalHeight+bordersTotalHeight);
		$.tabOpen = tab;
	},
	closeTab: function(tab) {
		var $ = this;
		tab.elements.container.set()
			.height($.itemHeight);
			$.tabOpen = undefined;
	},
	init: function() {
		var $ = this;
		$.controller = tail.controller.build;
		$.setVariables();
	}
}