body.build.controls = {
	changeLayout: function(width,height) {
		var $ = this;
	},
	setVariables: function() {
		var $ = this;
		$.width = body.build.flipper.width;
		$.height = body.build.flipper.sideHeight;
		$.secNum = 9;
		$.secHeight = $.height/$.secNum;
		$.huge = { height: $.secHeight, top: 0 };
		$.big = { height: $.secHeight/1.5, top: $.secHeight/6 };
		$.large = { height: $.secHeight/1.75, top: $.secHeight/5 };
		$.medium = { height: $.secHeight/2, top: $.secHeight/4 };
		$.small = { height: $.secHeight/3, top: $.secHeight/3 };
		$.titleSize = 18;
		$.titleFont = 'Times New Roman';
		$.titleColor = 'white';
		$.incrementing = undefined;
		$.topMode = undefined;
		$.paramsShow = undefined;
		$.guideShow = undefined;
		$.states = ['quartQuartHalf','halfHalf','threeQuartsQuarts','whole'];
		$.state = undefined;
	},
	sendData: function() {
		var $ = this;
		return {
			key: {
				note: $.key.total[0],
				mode: $.key.total[1],
				focus: $.key.highlighting
			},
			instrument: {
				name: $.instrument.total[0],
				version: $.instrument.total[1],
				editing: $.instrument.editing
			},
			incrementing: $.edit.incrementing,
			measureNum: $.measures.currentButton.num
		}
	},
	// changing layout
		switchTop: function(height) {
			var $ = this,
				func = undefined;
			if(height==='quarter') func = 'setQuarter';
			else if(height==='half') func = 'setHalf';
			else if(height==='threeQuarters') func = 'setThreeQuarters';
			else func = 'setWhole';
			body.build.editor[func]();
			body.build.keyboard[func]();
		},
		positionParams: function(position) { // quarter, or threeQuarters
			if(position==='quarter') body.build.params.putInView(true);
			else body.build.params.putInView(false);
		},
		switchToEditor: function() {
			var $ = this, keyboard = body.build.keyboard;
			if(keyboard.givingIntro || keyboard.recording) return;
			if($.topMode!=='editor') {
				body.build.editor.putInView();
				body.build.keyboard.putOutView();
				$.topMode = 'editor';
				$.changeTopBackgrounds();
				body.build.params.changeInterface();
			}
		},
		switchToKeyboard: function() {
			var $ = this;
			if($.topMode!=='keyboard') {
				body.build.editor.putOutView();
				body.build.keyboard.putInView();
				$.topMode = 'keyboard';
				$.changeTopBackgrounds();
				body.build.params.changeInterface();
			}
		},
		changeTopBackgrounds: function() { // 'editor' or 'keyboard'
			var $ = this,
				aliveColor = 'yellow',
				deadColor = 'blue';
			$[$.topMode+'Button'].resetBackground(aliveColor);
			if($.topMode==='editor') $.keyboardButton.resetBackground(deadColor);
			else $.editorButton.resetBackground(deadColor);
		},
		toggleParams: function() {
			var $ = this;
			if($.paramsShow) {
				body.build.params.putOutView();
				$.paramsShow = false;
				if($.guideShow) {
					$.switchTop('half');
				} else $.switchTop('whole');
			} else {
				if($.guideShow) {
					$.switchTop('quarter');
					$.positionParams('quarter');
				} else {
					$.switchTop('threeQuarters');
					$.positionParams('threeQuarters');
				}
				$.paramsShow = true;
			}
			$.changeParamText();
		},
		changeParamText: function() {
			var $ = this, text;
			if($.paramsShow) text = 'hide';
			else text = 'show';
			$.paramsButton.text().innerHTML(text);
		},
		toggleGuide: function() {
			var $ = this;
			if($.guideShow) {
				$.guideShow = false;
				if($.paramsShow) {
					$.switchTop('threeQuarters');
					$.positionParams('threeQuarters');
				} else {
					$.switchTop('whole');
				}
				body.build.guide.putOutView();
			} else {
				$.guideShow = true;
				if($.paramsShow) {
					$.switchTop('quarter');
					$.positionParams('quarter');
				} else {
					$.switchTop('half');
				}
				body.build.guide.putInView();
			}
			$.changeGuideText();
		},
		changeGuideText: function() {
			var $ = this, text;
			if($.guideShow) text = 'hide';
			else text = 'show';
			$.guideButton.text().innerHTML(text);
		},
		toggleIncrement: function() {
			var $ = this;
			if($.incrementing) {
				body.build.editor.changeAdjustMode();
				$.incrementing = false;
			} else {
				body.build.editor.changeAdjustMode();
				$.incrementing = true;
			}
			$.changeIncrementText();
		},
		changeIncrementText: function() {
			var $ = this, text;
			if($.incrementing) text = 'turn off';
			else text = 'turn on';
			$.incrementButton.text().innerHTML(text);
		},
	container: function() {
		var $ = this, prefs = tail.storage.preferences.build;
		if(prefs.details.flipperFront==='controls') $.container = body.build.flipper.front;
		else $.container = body.build.flipper.back;
	},
	// parts
		phrase: function() {
			var $ = this,
				secTop = $.secHeight*0,
				buttonTop = Math.round(secTop+$.large.top);
				width = Math.round($.width/4),
				values = { width: width, height: Math.round($.large.height), borderRadius: 4, font: 'Times New Roman', size: 18, color: 'white' };
			// save
				values.background = 'green';
				values.hover = 'gray';
				$.saveButton = dom.makeButton($.container,'save',values,function() {
					$.controller.savePhrase();
				});
				$.saveButton.set().position('absolute')
					.left(width/4)
					.top(buttonTop)
			// share
				values.background = 'blue';
				values.hover = 'gray';
				$.shareButton = dom.makeButton($.container,'share',values,function() {
					console.log('share phrase');
				});
				$.shareButton.set().position('absolute')
					.left(width*6/4)
					.top(buttonTop)
			// delete
				values.background = 'red';
				values.hover = 'gray';
				$.deleteButton = dom.makeButton($.container,'delete',values,function() {
					var toDelete = window.confirm('are you sure you want to delete this entire phrase?');
					if(toDelete) $.controller.deletePhrase();
				});
				$.deleteButton.set().position('absolute')
					.left(width*11/4)
					.top(buttonTop)
		},
		play: function() {
			var $ = this,
				top = $.secHeight*1, cirSec = Math.round($.big.height),
				cirTop = Math.round(top+$.big.top);
			$.play = {};
			$.play.makeButtons = function() {
				$.play.posSec = $.width/($.play.num+1);
				if($.play.playButtons) {
					$.play.playButtons.forEach(function(button) {
						$.container.removeChild(button);
					});
				}
				$.play.playButtons = [];
				for(var i=0; i<$.play.num; i++) {
					var cir = dom.create('div',$.container);
					cir.set()
						.width(cirSec)
						.height(cirSec)
						.borderRadius(cirSec/2)
						.background('red')
						.position('absolute')
						.left((i+1)*$.play.posSec-cirSec/2)
						.top(cirTop);
					(function(cir,i) {
						cir.onmouseenter = function() {
							preservePointer();
							this.tri.changeBackground('green');
						}
						cir.onmouseleave = function() {
							defaultCursor();
							this.tri.changeBackground('purple');
						}
						cir.onmousedown = function() {
							this.tri.changeBackground('blue');
						}
						cir.onmouseup = function() {
							this.tri.changeBackground('green');
						}
						cir.onclick = function() {
							preservePointer();
							$.controller.playPhrase(i);
						}
					})(cir,i);
					cir.tri = dom.create('div',cir);
					cir.tri.set()
						.width(0).height(0)
						.borderTop(cirSec/3,'transparent')
						.borderLeft(cirSec/1.6,'purple')
						.borderBottom(cirSec/3,'transparent')
						.position('absolute')
						.left(cirSec/4)
						.top(cirSec/5.8)
					cir.tri.changeBackground = function(color) {
						this.set().borderLeft(cirSec/1.6,color);
					}
					$.play.playButtons[i] = cir;
				}
			}
		},
		top: function() {
			var $ = this,
				secTop = $.secHeight*2,
				buttonTop = Math.round(secTop+$.large.top),
				width = Math.round($.width/3),
				borderRadius = 4,
				values = { font: 'Times New Roman', size: 18, width: width, height: Math.round($.large.height), hover: 'red', active: 'yellow' };
			// editor
				$.editorButton = dom.makeButton($.container,'editor',values,function() {
					$.switchToEditor();
				});
				$.editorButton.set().position('absolute')
					.left(width/2)
					.top(buttonTop)
					.borderRadius(borderRadius,['BottomLeft','TopLeft']);
			// keyboard
				$.keyboardButton = dom.makeButton($.container,'keyboard',values,function() {
					$.switchToKeyboard();
				});
				$.keyboardButton.set().position('absolute')
					.left(width*3/2)
					.top(buttonTop)
					.borderRadius(borderRadius,['BottomRight','TopRight']);
		},
		togglers: function() {
			var $ = this,
				names = ['params','guide','increment'];
			for(var i=0; i<3; i++) {
				var	secTop = $.secHeight*(3+i),
					buttonTop = Math.round(secTop+$.large.top),
					width = Math.round($.width/3),
					height = Math.round($.large.height),
					name = names[i];
				// title
					var divValues = { width: width, height: height, borderRadius: 4, background: 'pink' },
						textValues = { font: 'Helvetica', size: 14, color: 'white' };
					$[name+'Title'] = dom.create('div',$.container);
					$[name+'Title'].set()
						.width(divValues.width)
						.height(divValues.height)
						.borderRadius(divValues.borderRadius)
						.background(divValues.background)
						.display('table')
						.position('absolute')
						.left(width*2/5)
						.top(buttonTop)
						.paragraph(name,textValues);
				// button
					var values = { font: 'Times New Roman', size: 18, width: width, height: height, background: 'blue', hover: 'red', active: 'yellow', borderRadius: 4 };
					(function(name) {
						$[name+'Button'] = dom.makeButton($.container,'',values,function() {
							$['toggle'+name.capitalize()]();
						});
					})(name);
					$[name+'Button'].set().position('absolute')
						.left(width*8/5)
						.top(buttonTop);
			}
		},
		measures: function() {
			var $ = this, dom = body.helpers.dom,
				top = $.secHeight*6,
				cirTop = Math.round(top+$.large.top),
				cirSide = Math.round($.large.height),
				posSec = Math.round($.width/4),
				textValues = { font: 'Times New Roman', size: 24, color: 'white' };
			$.measures = {};
			$.measures.buttons = [];
			$.measures.currentButton = undefined;
			$.measures.nums = [1,2,4];
			$.measures.waxValue = Math.round(cirSide*1.4)/cirSide;
			$.measures.peepValue = Math.round(cirSide*1.04)/cirSide;
			for(var i=0; i<3; i++) {
				var cir = dom.create('div',$.container);
				cir.num = $.measures.nums[i];
				cir.style.WebkitTransition = '0.1s';
				cir.set()
					.width(cirSide)
					.height(cirSide)
					.borderRadius(cirSide)
					.position('absolute')
					.top(cirTop)
					.left((i+1)*posSec-cirSide/2)
					.background('blue')
					.display('table')
					.paragraph(cir.num,textValues);
				(function(cir) {
					// css
						cir.peep = function() {
							var num = $.measures.peepValue;
							this.set().transform('scale('+num+','+num+')');
						}
						cir.wax = function() {
							var num = $.measures.waxValue;
							this.set().transform('scale('+num+','+num+')');
						}
						cir.wane = function() {
							this.set().transform('scale(1,1)');
						}
					// events
						cir.onmouseenter = function() {
							preservePointer();
							if(this!==$.measures.currentButton) this.peep();
						}
						cir.onmouseleave = function() {
							defaultCursor();
							if(this!==$.measures.currentButton) this.wane();
						}
						cir.onclick = function() {
							preservePointer();
							if(this!==$.measures.currentButton) {
								if(body.build.editor.changeMeasures(this.num)) {
									body.build.editor.changeMeasures(this.num);
									$.measures.currentButton.wane();
									this.wax();
									$.measures.currentButton = this;
									// play
										$.play.num = this.num;
										$.play.makeButtons();
								}
							}
						}
				})(cir);
				$.measures.buttons.push(cir);
			}
		},
		key: function() {
			var $ = this, dom = body.helpers.dom,
				top = $.secHeight*7,
				configTop = Math.round(top+$.secHeight/6),
				width = Math.round($.secHeight/1.5),
				height = Math.round($.secHeight/1.5);
			// 	configButtonValues = { width: width, height: height, borderRadius: 4, background: 'red', hover: 'green', active: 'purple', font: 'Times New Roman', size: 24, color: 'white' },
			// 	configPopValues = { width: width, height: height, background: 'red', hover: 'green', active: 'purple', font: 'Times New Roman', size: 24, color: 'white' },
			// 	posSec = $.width/40;
			$.key = { total: [] };
			function changeNote(modeName) {
				var	noteNum = tail.converter.noteLettToNum(modeName);
				$.key.total[0] = noteNum;
				sendKeyChange();
			}
			function changeMode(item) {
				var	modeLett = tail.converter.modeWordToLett(item.name);
				$.key.total[1] = modeLett;
				sendKeyChange();
			}
			function sendKeyChange() {
				if($.key.highlighting) {
					body.build.editor.focusScale($.key.total[0],$.key.total[1],true);
					body.build.keyboard.draw();
				}
			}
			// note
				$.key.note = {};
				var n = $.key.note;
				n.top = configTop;
				n.left = 30;
				n.width = width;
				n.height = height;
				n.itemHeight = height;
				n.display = dom.create('div',$.container);
				n.display.set()
					.width(n.width)
					.height(n.height)
					.borderRadius(4)
					.background('red')
					.position('absolute')
					.display('table')
					.left(n.left)
					.top(n.top);
				n.display.text = dom.create('p',n.display);
				n.display.text.set()
					.font('Helvetica')
					.color('white')
					.display('table-cell')
					.verticalAlign('middle')
					.textAlign('center');
				n.display.onmouseenter = function() {
					preservePointer();
					n.display.set().background('green');
				}
				n.display.onmouseleave = function() {
					defaultCursor();
					n.display.set().background('red');
				}
				n.display.onmousedown = function() {
					n.display.set().background('purple');
				}
				n.selector = new dom.Selector($.container,n.left,n.top,n.display,n.height,n.width,10,8,n.height);
				var items = [],
					notes = tail.storage.notes;
				for(var i=0; i<notes.length; i++) {
					var item = dom.create('div');
					item.set()
						.width(n.width)
						.height(n.height)
						.display('table')
						.background('green');
					item.text = dom.create('p',item);
					item.text.set()
						.font('Helvetica')
						.color('white')
						.display('table-cell')
						.verticalAlign('middle')
						.innerHTML(notes[i].name)
						.textAlign('center');
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
							n.display.text.set().innerHTML(notes[i].name);
							changeMode(notes[i].name);
						}
						items.push(item);
					})(item,i);
				}
				n.selector.loadItems(items);
				// var noteButtonItems = tail.storage.notes,
				// 	notePopItems = tail.storage.notes;
				// $.key.note = dom.makeSelector(
				// 	$.container,
				// 	30,
				// 	configTop,
				// 	noteButtonItems,
				// 	configButtonValues,
				// 	notePopItems,
				// 	configPopValues,
				// 	changeNote
				// 	);
			// mode

				// var modeButtonItems = [],
				// 	modePopItems = tail.storage.modes;
				// configPopValues.size = 16;
				// for(var i=0, conv = tail.converter, modes = tail.storage.modes; i<tail.storage.modes.length; i++) {
				// 	modeButtonItems.push({ name: conv.modeWordToLett(modes[i].name) });
				// }
				// $.key.mode = dom.makeSelector(
				// 	$.container,
				// 	100,
				// 	configTop,
				// 	modeButtonItems,
				// 	configButtonValues,
				// 	modePopItems,
				// 	configPopValues,
				// 	changeMode
				// 	);
			// focus
				var focusValues = { width: 100, height: Math.round($.secHeight/2), borderRadius: 4, background: 'red', hover: 'blue', active: 'green', color: 'white', size: 20 };
				$.key.focus = dom.makeButton($.container,'',focusValues,function() {
					if(!$.key.highlighting) {
						$.key.highlighting = true;
						sendKeyChange();
						$.key.focus.text().innerHTML('show all');
					} else {
						$.key.highlighting = false;
						body.build.editor.unfocusScale();
						body.build.keyboard.draw();
						$.key.focus.text().innerHTML('highlight');
					}
				});
				$.key.focus.set().position('absolute')
					.left(174)
					.top(top+$.secHeight/4);
		},
		instrument: function() {
			var $ = this,
				top = $.secHeight*8,
				configTop = top+$.secHeight/6,
				configSide = Math.round($.secHeight/1.5);
			$.instrument = { total: [] };
			function changeCategory(item) {
				// change current version immediately
					var oldItemIndex = $.instrument.total[1]-1,
						newItemsLength = item.versions.length,
						newVersionNum;
					if(newItemsLength<oldItemIndex+1) {
						var diff = oldItemIndex+1-newItemsLength;
						newVersionNum = oldItemIndex-diff+1;
					} else {
						newVersionNum = oldItemIndex+1;
					}
					$.instrument.version.button.div.text().innerHTML(newVersionNum);
				$.instrument.total[0] = item.name;
				for(var i=0, newItems=[]; i<item.versions.length; i++) {
					newItems.push({ name: i+1 });
				}
				$.instrument.version.changeItems(newItems,newItems);
				sendInstrumentChange();
			}
			function changeVersion(version) {
				$.instrument.total[1] = version.name;
				sendInstrumentChange();
			}
			function sendInstrumentChange() {
				console.log('instrument is now '+$.instrument.total[0]+' '+$.instrument.total[1]);
			}
			// category
				var categoryButtonItems = tail.storage.instruments;
					categoryButtonValues = { width: configSide, height: configSide, borderRadius: 4, background: 'red' },
					categoryPopItems = tail.storage.instruments;
					categoryPopItemValues = { width: configSide, height: configSide, background: 'red' };
				$.instrument.category = dom.makeSelector(
					$.container,
					30,
					configTop,
					categoryButtonItems,
					categoryButtonValues,
					categoryPopItems,
					categoryPopItemValues,
					changeCategory,
					true
					);
			// versions
				var versionButtonItems = [],
					versionButtonValues = { width: configSide, height: configSide, borderRadius: 4, background: 'red', hover: 'green', active: 'purple', font: 'Times New Roman', size: 24, color: 'white' },
					versionPopItems = [],
					versionPopItemValues = { width: configSide, height: configSide, background: 'red', hover: 'green', active: 'purple', font: 'Times New Roman', size: 24, color: 'white' };
				$.instrument.version = dom.makeSelector(
					$.container,
					100,
					configTop,
					versionButtonItems,
					versionButtonValues,
					versionPopItems,
					versionPopItemValues,
					changeVersion
					);
			// name
				var nameValues = { width: 100, height: $.secHeight/2, borderRadius: 4, background: 'pink' };
				$.instrument.name = dom.create('p',$.container);
				$.instrument.name.set()
					.width(nameValues.width)
					.height(nameValues.height)
					.borderRadius(nameValues.borderRadius)
					.background(nameValues.background)
					.display('table')
					.position('absolute')
					.left(174)
					.top(top+$.secHeight/4);
				$.instrument.name.paragraph = dom.create('p',$.instrument.name);
				$.instrument.name.paragraph.set()
					.display('table-cell')
					.verticalAlign('middle')
					.textAlign('center')
					.font('Helvetica')
					.color('white')
					.size(18);
		},
	resetState: function(phrase) {
		var $ = this;
		// play
			var play = $.play;
			play.num = phrase.measureNum;					
			play.makeButtons();
		// increment
			$.incrementing = phrase.incrementing;
			$.changeIncrementText();
		// measures
			var measures = $.measures,
				buttonIndex = measures.nums.indexOf(phrase.measureNum),
				toWane = measures.currentButton;
			if(toWane) {
				toWane.set().transition('0');
				toWane.wane();
				toWane.set().transition('0.1s');
			}
			measures.currentButton = measures.buttons[buttonIndex];
			var toWax = measures.currentButton;
			toWax.set().transition('0');
			toWax.wax();
			toWax.set().transition('0.1s');
		// key set
			var key = $.key;
			// note
					key.total[0] = phrase.key.note;
					var noteLett = tail.converter.noteNumToLett(key.total[0]);
					key.note.display.text.set().innerHTML(noteLett);
			// mode
					key.total[1] = phrase.key.mode;
					// key.mode.button.div.text().innerHTML(phrase.key.mode);
			// focus change
				key.highlighting = phrase.key.focus;
				if(key.highlighting) key.focus.text().innerHTML('show all');
				else key.focus.text().innerHTML('highlight');
		// instrument set
			var instrument = $.instrument;
			// category
				var instObject,
					instObjects = tail.storage.instruments;
				for(var i=0; i<instObjects.length; i++) {
					if(instObjects[i].name===phrase.instrument.name) {
						instObject = instObjects[i];
						break;
					}
				}
				instrument.total[0] = instObject.name;
				var button = instrument.category.button,
					ctx = button.canvas.context,
					side = button.points.side;
				instObject.icon.regular(ctx,side);
				instrument.category.button.currentItem = instObject;
			// version
				var versionNum = phrase.instrument.version;
				instrument.total[1] = versionNum;
				instrument.version.button.div.text().innerHTML(versionNum);
				// change items
					for(var i=0, newItems=[]; i<instObject.versions.length; i++) {
						newItems.push({ name: i+1 });
					}
					instrument.version.changeItems(newItems,newItems);
			// name
				instrument.name.paragraph.set().innerHTML(phrase.instrument.name);
	},
	setState: function(prefs) {
		var $ = this, details = prefs.details;
		if(prefs.state!=='phrase') return;
		$.resetState(prefs.details.initialPhrase);
		$.topMode = details.topMode;
		$.changeTopBackgrounds();
		$.paramsShow = details.paramsShow;
		$.changeParamText();
		body.build.params.changeInterface();
		$.guideShow = details.guideShow;
		$.changeGuideText();
	},
	init: function() {
		var $ = this, prefs = body.build.prefs;
		$.controller = tail.controller.build;
		$.setVariables();
		$.container();
		$.phrase();
		$.play();
		$.top();
		$.togglers();
		// $.params();
		// $.guide();
		// $.increment();
		$.measures();
		$.key();
		$.instrument();
		$.setState(prefs);
	}
}
