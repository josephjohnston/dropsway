'use strict';
body.browse.popup = {
	show: function() {
		var $ = this;
		$.container.set()
			.display('block');
		$.setupEditor();
	},
	hide: function() {
		var $ = this;
		$.container.set()
			.display('none');
		$.releaseEditor();
	},
	setVariables: function() {
		var $ = this;
		$.width = 1000;
		$.height = 360;
		$.left = 200;
		$.top = 120;
		$.hideLeft = -$.width;
		$.topBarHeight = 40;
		$.editorApi = body.build.editor.sendPopupApi();
		$.showingPopup = undefined;
		$.navigation = {};
		$.authorInterface = {};
		$.phraseInterface = {};
	},
	// make stuff
		makePopup: function() {
			var $ = this;
			// structure
				$.container = dom.create('div',head.design.htmlBody);
				$.container.set()
					.display('none')
					.width($.width)
					.height($.height)
					.top($.top)
					.background('blue')
					.position('absolute')
					.borderRadius(10,['BottomLeft','BottomRight']);
				$.topBar = dom.create('div',$.container);
				$.topBar.set()
					.width($.width)
					.height($.topBarHeight)
					.background('purple')
					.position('absolute')
					.borderRadius(10,['TopLeft','TopRight'])
					.top(-$.topBarHeight);
			// navigation
				var n = $.navigation;
				// set properties
					n.buttonWidth = 30;
					n.buttonHeight = $.topBarHeight*3/4;
					n.buttonTop = ($.topBarHeight-n.buttonHeight)/2;
					n.arrowColor = 'blue';
					n.arrowHover = 'violet';
					n.exitColor = 'blue';
					n.exitHover = 'violet';
				// elements
					n.forward = dom.create('div',$.topBar);
					n.forward.set()
						.position('absolute')
						.border(n.buttonHeight/2,'transparent',['Top','Bottom'])
						.border(n.buttonWidth,n.arrowColor,['Left'])
						.left(70)
						.top(n.buttonTop);
					n.backward = dom.create('div',$.topBar);
					n.backward.set()
						.position('absolute')
						.border(n.buttonHeight/2,'transparent',['Top','Bottom'])
						.border(n.buttonWidth,n.arrowColor,['Right'])
						.left(10)
						.top(n.buttonTop);
					n.exit = dom.create('p',$.topBar);
					n.exit.set()
						.innerHTML('X')
						.font('Helvetica')
						.size(40)
						.color(n.exitColor)
						.position('absolute')
						.left(940)
						.top(3);
				// listeners
					// mouseenter
						n.forward.onmouseenter = function() {
							preservePointer();
							n.forward.set().border(n.buttonWidth,n.arrowHover,['Left'])
						}
						n.backward.onmouseenter = function() {
							preservePointer();
							n.backward.set().border(n.buttonWidth,n.arrowHover,['Right'])
						}
						n.exit.onmouseenter = function() {
							preservePointer();
							n.exit.set().color(n.exitHover);
						}
					// mouseleave
						n.forward.onmouseleave = function() {
							defaultCursor();
							n.forward.set().border(n.buttonWidth,n.arrowColor,['Left'])
						}
						n.backward.onmouseleave = function() {
							defaultCursor();
							n.backward.set().border(n.buttonWidth,n.arrowColor,['Right'])
						}
						n.exit.onmouseleave = function() {
							defaultCursor();
							n.exit.set().color(n.exitColor);
						}
					// click
						n.forward.onclick = function() {
							preservePointer();
							$.forward();
						}
						n.backward.onclick = function() {
							preservePointer();
							$.backward();
						}
						n.exit.onclick = function() {
							preservePointer();
							$.exit();
						}
		},
		// author
			makeAuthorInterface: function() {
				var $ = this,
					a = $.authorInterface;
				// header
					a.header = {};
					// background
						a.header.background = dom.create('div',$.container);
						a.header.background.set()
							.width(400)
							.height(60)
							.borderRadius(4)
							.background('green')
							.position('absolute')
							.left(50)
							.top(40);
					// pic
						a.header.pic = dom.create('div',$.container);
						a.header.pic.set()
							.width(100)
							.height(100)
							.borderRadius(50)
							.background('purple')
							.position('absolute')
							.left(100)
							.top(20);
						a.header.changePic = function(newPic) {

						}
					// name
						a.header.name = dom.create('p',$.container);
						a.header.name.set()
							.innerHTML('James Goblin')
							.font('Helvetica')
							.size(20)
							.color('white')
							.position('absolute')
							.left(210)
							.top(60);
						a.header.changeName = function(name) {
							a.header.name.set().innerHTML(name);
						}
				// details
					a.details = dom.create('p',$.container);
					a.details.set()
						.innerHTML('details')
						.font('Helvetica')
						.size(20)
						.color('black')
						.position('absolute')
						.left(210)
						.top(200);
					a.details.change = function() {
					}
				// follow
					var followValues = { font: 'Helvetica', size: 20, width: 200, height: 50, borderRadius: 4, background: 'green', hover: 'red', active: 'yellow' },
						followCallback = function() {

						}
					a.follow = dom.makeButton(
						$.container,
						'follow',
						followValues,
						followCallback
						);
					a.follow.set()
						.position('absolute')
						.left(140)
						.top(280);
				// following
					a.following = {};
					// title
						a.following.title = dom.create('div',$.container);
						a.following.title.set()
							.width(40)
							.height(30)
							.background('purple')
							.position('absolute')
							.left(560)
							.top(0)
							.innerHTML('following');
					// pics
						a.following.pics = new dom.Scroller($.container,40,320,8,1,8,8,$.Pic);
						a.following.pics.holder.set()
							.background('pink')
							.position('absolute')
							.left(560)
							.top(20);
				// followers
					a.followers = {};
					// title
						a.followers.title = dom.create('div',$.container);
						a.followers.title.set()
							.width(40)
							.height(30)
							.background('purple')
							.position('absolute')
							.left(655)
							.top(0)
							.innerHTML('following');
					// pics
						a.followers.pics = new dom.Scroller($.container,40,320,8,1,8,8,$.Pic);
						a.followers.pics.holder.set()
							.background('pink')
							.position('absolute')
							.left(655)
							.top(20);
					// pics

				// phrases
					a.phrases = {};
					// div
						a.phrases.div = dom.create('div',$.container);
						a.phrases.div.set()
							.width(150)
							.height(320)
							.background('green')
							.borderRadius(4)
							.position('absolute')
							.left(800)
							.top(20);
					// title
						a.phrases.title = dom.create('p',a.phrases.div);
						a.phrases.title.set()
							.innerHTML('phrases')
							.font('Helvetica')
							.size(20)
							.color('black')
							.position('absolute')
							.left(40)
							.top(10);
					// pics
				// show/hide
					a.hide = function() {
						a.header.background.set().display('none');
						a.header.pic.set().display('none');
						a.header.name.set().display('none');
						a.details.set().display('none');
						a.follow.set().display('none');
						a.following.pics.holder.set().display('none');
						a.following.title.set().display('none');
						a.followers.pics.holder.set().display('none');
						a.followers.title.set().display('none');
						a.phrases.div.set().display('none');
					}
					a.show = function() {
						a.header.background.set().display('block');
						a.header.pic.set().display('block');
						a.header.name.set().display('block');
						a.details.set().display('block');
						a.follow.set().display('table');
						a.following.pics.holder.set().display('block');
						a.following.title.set().display('table');
						a.followers.pics.holder.set().display('block');
						a.followers.title.set().display('table');
						a.phrases.div.set().display('block');
					}
			},
		// pic
			Pic: function(scroller,width,height) {
				var $ = this;
				$.scroller = scroller;
				$.width = width;
				$.height = height;
				$.makeContainer();
			},
			setPicPrototype: function() {
				var popup = this;
				popup.Pic.prototype = {
					scroller: undefined,
					content: undefined,
					width: undefined,
					height: undefined,
					makeContainer: function() {
						var $ = this;
						$.container = dom.create('div',$.scroller.container);
						$.container.set()
							.width($.width)
							.height($.height)
							.position('absolute')
							.borderRadius(4)
							.background('red');
					},
					load: function(content) {
						var $ = this;
						if(content && !$.content)
							$.container.set()
								.display('block');
						if(content)
							$.container.set().innerHTML(content);
						else
							$.container.set()
								.display('none');
						$.content = content;
					}
				}
			},
		makePhraseInterface: function() {
			var $ = this,
				p = $.phraseInterface;
			// author
				p.authorPic = dom.create('div',$.container);
				p.authorPic.set()
					.width(60)
					.height(60)
					.background('red')
					.borderRadius(4)
					.position('absolute')
					.left($.width-100)
					.top(20);
			// hits
				p.hits = {};
				p.hits.num = dom.create('p',$.container);
				p.hits.num.set()
					.innerHTML('128')
					.font('Helvetica')
					.size(24)
					.color('black')
					.position('absolute')
					.left($.width-90)
					.top(90);
				p.hits.text = dom.create('p',$.container);
				p.hits.text.set()
					.innerHTML('Hits')
					.font('Helvetica')
					.size(20)
					.color('black')
					.position('absolute')
					.left($.width-85)
					.top(120);
			// date
				p.date = dom.create('p',$.container);
				p.date.set()
					.innerHTML('Yesterday')
					.font('Helvetica')
					.size(18)
					.color('white')
					.position('absolute')
					.left($.width-110)
					.top(150);
			// instrument
				p.instrument = {};
				// drop
					p.instrument.drop = dom.create('div',$.container);
					p.instrument.drop.set()
						.width(40)
						.height(40)
						.background('green')
						.borderRadius(10,['BottomLeft','BottomRight'])
						.position('absolute')
						.left($.width-90)
						.top(240);
				// pic
					p.instrument.pic = dom.create('div',$.container);
					p.instrument.pic.set()
						.width(60)
						.height(60)
						.background('red')
						.borderRadius(4)
						.position('absolute')
						.left($.width-100)
						.top(190);
				// label

			// add
				p.add = {};
				// button
					var addButtonValues = { font: 'Helvetica', size: 20, width: 100, height: 40, borderRadius: 4, background: 'purple', hover: 'green', active: 'yellow' },
						addVButtonCallback = function() {

						}
					p.add.button = dom.makeButton(
						$.container,
						'add',
						addButtonValues,
						addVButtonCallback
						);
					p.add.button.set()
						.position('absolute')
						.left($.width-120)
						.top($.height-60);
				// label
			// show/hide
				p.hide = function() {
					p.authorPic.set().display('none');
					p.hits.num.set().display('none');
					p.hits.text.set().display('none');
					p.date.set().display('none');
					p.instrument.drop.set().display('none');
					p.instrument.pic.set().display('none');
					p.instrument.drop.set().display('none');
					p.add.button.set().display('none');
				}
				p.show = function() {
					p.authorPic.set().display('block');
					p.hits.num.set().display('block');
					p.hits.text.set().display('block');
					p.date.set().display('block');
					p.instrument.drop.set().display('block');
					p.instrument.pic.set().display('block');
					p.instrument.drop.set().display('block');
					p.add.button.set().display('block');
				}
		},
	// on page change
		setupEditor: function() {
			var $ = this;
			body.build.editor.becomeDisplay();
			$.editorApi
				.setTop(160)
				.setLeft(-2000)
				.setHeight(280);
		},
		releaseEditor: function() {
			var $ = this;
			body.build.editor.returnFromDisplay();
		},
	// on popup show/hide
		showPopup: function() {
			var $ = this;
			$.showingPopup = true;
			$.container.set()
				.left($.left);
		},
		hidePopup: function() {
			var $ = this;
			$.showingPopup = false;
			$.container.set()
				.left($.hideLeft);
		},
	// showers
		showAuthor: function() {
			var $ = this;
			$.editorApi
				.setLeft(-200);
			$.phraseInterface.hide();
			$.authorInterface.show();
		},
		showPhrase: function() {
			var $ = this;
			$.editorApi
				.setLeft(100)
				.showPhrase(tail.storage.phrases.build[0]);
			$.authorInterface.hide();
			$.phraseInterface.show();
		},
	// navigation
		forward: function() {
			var $ = this;
		},
		backward: function() {
			var $ = this;
		},
		exit: function() {
			var $ = this;
			$.hidePopup();
		},
	setState: function() {
		var $ = this;
		var stream = [];
		for(var i=0; i<100; i++) stream.push(i+'');
		$.authorInterface.following.pics.jumpToPoint(45.439);
		$.authorInterface.following.pics.loadStream(stream);
		$.authorInterface.followers.pics.jumpToPoint(45.439);
		$.authorInterface.followers.pics.loadStream(stream);
		// $.showPhrase();
		// $.showAuthor();
		$.hidePopup();
	},
	init: function() {
		var $ = this;
		$.setVariables();
		$.setPicPrototype();
		$.makePopup();
		$.makeAuthorInterface();
		$.makePhraseInterface();
		$.setState();
	}
}