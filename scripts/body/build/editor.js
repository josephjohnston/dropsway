'use strict';
body.build.editor = {
	show: function() {
		this.holder.set()
			.display('block');
	},
	hide: function() {
		this.holder.set()
			.display('none');
	},
	setVariables: function() {
		var $ = this;
		$.controller = tail.controller.build;
		// structure
			$.structureState = undefined;
		// helpers
			$.shapes = [];
			$.shapeSelected = undefined;
			$.shapesSelected = [];
			$.shapeHeight = 12;
			$.dragging = false;
			$.extendingLeft = false;
			$.extendingRight = false;
			$.clickedX = undefined;
			$.selectAnchor = undefined;
			$.selecting = false;
			$.selectedToBes = {}; // shapeId: [leftToBe,topToBe]
			$.selectedDiffs = {};
			$.shiftDown = false;
			$.measureNum = 0;
			$.totalOctaves = 7;
			$.holderExtend = 4;
			$.baseUnit = 7;
			$.thirtySecond = $.baseUnit*4/$.measureNum;
			$.offsetSide = 24;
			$.adjustInterval = undefined;
			$.colors = tail.storage.colors;
			$.invertScale = [];
			$.sideClickedY = undefined;
		// div holder thing
			$.holder = dom.create('div',head.design.htmlBody);
			$.holder.set()
				.display('none')
				.position('absolute')
				.overflow('hidden')
				.transition(body.build.topTransitionTime+'s');
		// no phrase
			$.noPhrase = dom.create('div',$.holder);
			$.noPhrase.set()
				.position('absolute')
				.paragraph('no phrase, pick one on right',{ size: 36 });
		// side
			$.side = dom.create('canvas',$.holder);
			$.side.set()
				.position('absolute');
		// bottom canvas
			$.bottomCanvas = dom.create('canvas',$.holder);
			$.bottomCanvas.set()
				.borderRadius(10)
				.position('absolute');
		// top canvas
			$.topCanvas = dom.create('canvas',$.holder);
			$.topCanvas.set()
				.position('absolute');
		// scroll for side
			$.contTop = 0;
			$.topCanvas.addEventListener('mousewheel',function(e) {
				e.preventDefault();
			$.moveContainer($.contTop-e.deltaY);
				
			});
		// key events
			window.addEventListener('keydown',function(e) {
				var code = e.keyCode;
				if(code===16) $.shiftDown = true;
				else if(code===8) {
					e.preventDefault();
					$.deleteShapes($.shapesSelected);
				}
			});
			window.addEventListener('keyup',function(e) {
				var code = e.keyCode;
				if(code===16) $.shiftDown = false;
			});
		// popup
			$.asPopup = undefined;
	},
	moveContainer: function(toBeTop) {
		var $ = this;
		if(0<toBeTop) toBeTop = 0;
		else if(toBeTop+$.totalOctaves*12*$.shapeHeight<$.height)
			toBeTop = $.height-$.totalOctaves*12*$.shapeHeight;
		$.contTop = toBeTop;
		$.topCanvas.set().top($.contTop);
		$.drawSide(Math.floor(-$.contTop/$.shapeHeight));
	},
	becomeDisplay: function() {
		var $ = this;
		$.asPopup = true;
		$.holder.set()
			.zIndex(1)
			.display('block')
		$.noPhrase.set()
			.display('none');
	},
	returnFromDisplay: function() {
		var $ = this;
		$.asPopup = false;
		$.top = body.build.verticalPadding;
		$.holder.set()
			.top($.top)
			.zIndex(0)
			.display('none');
		$.noPhrase.set()
			.display('block');
		$.putInView();
		// structure state
			if($.structureState==='quarter') $.setQuarter();
			else if($.structureState==='half') $.setHalf();
			else if($.structureState==='threeQuarter') $.setThreeQuarters();
			else if($.structureState==='whole') $.setWhole();
	},
	sendPopupApi: function() {
		var $ = this,
			api = {
				setLeft: function(left) {
					$.holder.set().left(left)
						.zIndex(1);
					return this;
				},
				setTop: function(top) {
					$.top = top;
					$.holder.set().top(top);
					return this;
				},
				setHeight: function(height) {
					$.setHeight(height);
					$.redraw();
					return this;
				},
				showPhrase: function(phrase) {
					$.switchPhrase(phrase,0);
					return this;
				}
			}
		return api;
	},
	// structure
		setLayout: function(winWidth,winHeight) {
			var $ = this;
			$.availableHeight = winHeight-body.build.verticalPadding*2;
			$.left = menuWidth+body.build.horizontalPadding;
			$.top = body.build.verticalPadding;
			$.width = $.baseUnit*32*4;
			$.hideLeft = ($.left*2+$.width)/2-$.width-body.build.hideOffset;
			$.holder.set().width($.width+$.offsetSide).top($.top);
			$.noPhrase.set()
				.width(500)
				.left(200)
				.top(160);
			$.side.set().canWidth($.offsetSide*0.6);
			$.bottomCanvas.set().left($.offsetSide).canWidth($.width);
			$.topCanvas.set().canWidth($.width).canHeight($.totalOctaves*12*$.shapeHeight).left($.offsetSide);
		},
		changeLayout: function(winWidth,winHeight) {
			var $ = this;
			// change whatever we want when window changes, which is not of concern now
		},
		putInView: function() {
			var $ = this;
			$.holder.set().left($.left);
		},
		putOutView: function() {
			var $ = this;
			$.holder.set().left($.hideLeft);
		}, 
		setQuarter: function() {
			var $ = this, currentHeight = $.availableHeight/4;
			$.setHeight(currentHeight);
			$.structureState = 'quarter';
			$.redraw();
		},
		setHalf: function() {
			var $ = this, currentHeight = $.availableHeight/2;
			$.setHeight(currentHeight);
			$.redraw();
			$.structureState = 'half';
		},
		setThreeQuarters: function() {
			var $ = this, currentHeight = $.availableHeight*3/4;
			$.setHeight(currentHeight);
			$.structureState = 'threeQuarter';
			$.redraw();
		},
		setWhole: function() {
			var $ = this, currentHeight = $.availableHeight;
			$.setHeight(currentHeight);
			$.structureState = 'whole';
			$.redraw();
		},
		setHeight: function(height) {
			var $ = this;
			$.height = Math.floor(height/$.shapeHeight)*12;
			$.notesShown = $.height/$.shapeHeight;
			$.holder.set().height($.height);
			$.noPhrase.set().height(100);
			$.side.set().canHeight($.height);
			$.bottomCanvas.set().canHeight($.height);
		},
	redraw: function() {
		var $ = this;
		$.drawBackground();
		$.drawSide(0);
	},
	drawSide: function(showTop) {
		var $ = this, ctx = $.side.context, notes = $.totalOctaves*12,
			secHeight = $.height/notes;
		ctx.clearRect(0,0,$.side.width,$.side.height);
		if(showTop===undefined) showTop = Math.floor(($.top-$.topCanvas.getBoundingClientRect().top)/$.shapeHeight);
		for(var i=0; i<notes; i++) {
			var array = $.colors[i-Math.floor(i/$.colors.length)*$.colors.length];
			if(showTop<=i && i<showTop+$.notesShown && $.invertScale.indexOf(i)===-1) ctx.fillStyle = 'rgb('+array[0]+','+array[1]+','+array[2]+')';
			else ctx.fillStyle = 'transparent';
			var y = secHeight*i;
			ctx.fillRect(0,y,$.offsetSide,secHeight);
		}
	},
	focusScale: function(noteNum,mode,redraw) {
		var $ = this, num;
		// mode
			if(mode==='m') {
				if(11<noteNum+3) num = 11-(noteNum+3-12);
				else num = 11-(noteNum+3);
			} else num = 11-noteNum;
		// scale
			$.scaleBackwardsPattern = [1,2,2,2,1,2,2];
			num -= 12;
			$.scale = [num];
			for(var i=0; i<$.totalOctaves+1; i++) {
				for(var o=0; o<7; o++) $.scale.push(num+=$.scaleBackwardsPattern[o]);
			}
		// invert
			$.invertScale = [];
			for(var i=0; i<$.totalOctaves*12; i++) {
				if($.scale.indexOf(i)===-1) $.invertScale.push(i);
			}
		$.drawSide(0);
		$.redrawShapes();
	},
	unfocusScale: function() {
		var $ = this;
		$.invertScale = [];
		$.drawSide();
		$.redrawShapes();
	},
	changeAdjustMode: function() {
		var $ = this;
		if($.adjustInterval===$.thirtySecond*2) $.adjustInterval = $.thirtySecond;
		else $.adjustInterval = $.thirtySecond*2;
	},
	newPhrase: function() {
		var $ = this;
		$.shapes = [];
		$.changeMeasures(1);
		$.unfocusScale();
	},
	switchPhrase: function(phrase,sideTop) {
		var $ = this;
		$.shapes= [];
		var key = phrase.key;
		if(key.focus) $.focusScale(key.note,key.mode);
		else $.unfocusScale();
		$.changeMeasures(phrase.measureNum);
		$.loadShapes(phrase.shapes);
		// incrementing
			if(phrase.incrementing && $.adjustInterval!==$.thirtySecond) {
				body.build.controls.toggleIncrement();
			} else if(!phrase.incrementing && $.adjustInterval!==$.thirtySecond*2) {
				body.build.controls.toggleIncrement();
			}
	},
	loadShapes: function(shapes) {
		var $ = this;
		shapes.forEach(function(shape) {
			$.makeShape(shape[0],shape[1],shape[2]);
		});
	},
	sendShapes: function() {
		var $ = this, shapes = [];
		for(var s=0; s<$.shapes.length; s++) {
			var shape = $.shapes[s];
			shapes.push([shape.l,shape.r,shape.t]);
		}
		return shapes;
	},
	showEmptyPhrase: function() {
		var $ = this;
		$.shapes = [];
		$.eraseBottom();
		$.changeMeasures(0);
	},
	eraseBottom: function() {
		var $ = this;
		$.bottomCanvas.context.clearRect(0,0,$.bottomCanvas.width,$.bottomCanvas.height);
	},
	changeMeasures: function(num) {
		var $ = this,
			toChange;
		// shapes to delete
			if(num<$.measureNum) {
				var shapesToDelete = [];
				$.shapes.forEach(function(shape) {
					if(shape.r>num*32) {
						var index = $.shapes.indexOf(shape);
						shapesToDelete.push(index);
					}
				});
				if(shapesToDelete.length>0) {
					if($.alertMeasureDelete()) {
						$.deleteShapes(shapesToDelete);
						toChange = true;
					} else toChange = false;
				} else toChange = true;
			} else toChange = true;
		if(toChange) {
			$.measureNum = num;
			// adjust interval
				var doubled;
				if($.adjustInterval===$.thirtySecond*2) doubled = true;
				else doubled = false;
			$.thirtySecond = $.baseUnit*4/$.measureNum!==Infinity ? $.baseUnit*4/$.measureNum : 0;
			// adjust interval
				if(doubled) $.adjustInterval = $.thirtySecond*2;
				else $.adjustInterval = $.thirtySecond;
			$.drawBackground();
			$.redrawShapes();
			return true;
		} else return false;
	},
	alertMeasureDelete: function() {
		if(confirm('Are you sure you want to delete the last measure and all its notes?')) return true;
		else return false;
	},
	drawBackground: function() {
		var $ = this, ctx = $.bottomCanvas.context,
			h = $.bottomCanvas.height,
			w = $.bottomCanvas.width/$.measureNum/8;
			for(var i=0; i<$.measureNum; i++) {
				for(var j=0; j<8; j++) {
					if (j%2===0) ctx.fillStyle = 'blue';
					else ctx.fillStyle = 'orange';
					if (j%8===0) ctx.fillStyle = 'black';
					ctx.fillRect((i*8+j)*w,0,w,h);
				}
			}
	},
	mult: function() {
		var $ = this;
		return $.adjustInterval===$.thirtySecond ? 1 : 2;
	},
	cursor: function(e) {
		var $ = this,
			mouse = $.mouse(e,$.topCanvas), mx = mouse.x, divs = $.divs(mouse),
			style = head.design.htmlBody.style;
		style.cursor = 'default';
		if($.selecting) return;
		$.shapes.forEach(function(shape) {
			if(shape.mouseIn(divs)) {
				if(shape.overExtendLeft(mx) || shape.overExtendRight(mx)) style.cursor = 'ew-resize';
				else style.cursor = 'move';
			}
		});	
		if($.extendingLeft || $.extendingRight) style.cursor = 'ew-resize';
		else if($.dragging) style.cursor = 'move';
	},
	mouse: function(e,element) {
		var rect = element.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		}
	},
	eraseShapes: function() {
		var $ = this;
		$.topCanvas.context.clearRect(0,0,$.topCanvas.width,$.topCanvas.height);
	},
	drawShapes: function() {
		var $ = this;
		for(var i=0; i<$.shapes.length; i++) {
			$.shapes[i].draw();
		}
	},
	redrawShapes: function() {
		var $ = this;
		$.eraseShapes();
		$.drawShapes();
	},
	onShape: function(divs) {
		var $ = this;
		for(var i=0; i<$.shapes.length; i++) {
			var shape = $.shapes[i];
			if(shape.mouseIn(divs)) return shape;
		}
	},
	selectShapes: function(mouse) {
		var $ = this, shapesSelected = [],
			a = $.divs($.selectAnchor),
			divs = $.divs(mouse),
			mult = $.mult();
		for(var i=0; i<$.shapes.length; i++) {
			var s = $.shapes[i], sHoriz = false, sVert = false;
			// horiz
				// shape side between anchor and div
					if((a.x*mult<s.l && s.l<=divs.x*mult) ||
						(divs.x*mult<s.r && s.r<=a.x*mult)) sHoriz = true;
				// anchor inside shape
					else if(s.l<=a.x*mult && a.x*mult<s.r) sHoriz = true;
			// vert
				// shape between anchor and shape
					if((a.y<=s.t && s.t+1<=divs.y) ||
						(divs.y<=s.t && s.t+1<=a.y)) sVert = true;
				// anchor inside shape
					else if(s.t===a.y) sVert = true; 
				// divs inside shape
					else if(s.t===divs.y) sVert = true;
			if(sHoriz && sVert) shapesSelected.push(s);
		}
		$.shapesSelected = shapesSelected;
	},
	divs: function(mouse,interval) {
		var $ = this;
		return {
			x: Math.floor(mouse.x/(interval || $.adjustInterval)),
			y: Math.floor(mouse.y/$.shapeHeight)
		}
	},
	insideSide: function(mY) {
		var $ = this,
			top = ($.top-$.topCanvas.getBoundingClientRect().top)/$.topCanvas.height*$.height,
			bottom = top+$.height/$.topCanvas.height*$.height;
		if(top<mY && mY<=bottom) return true;
		else return false;
	},
	dblclick: function() {
		var $ = this;
		$.topCanvas.addEventListener('dblclick',function(e) {
			if($.shiftDown || $.asPopup) return;
			var mouse = $.mouse(e,$.topCanvas), divs = $.divs(mouse);
			// if($.invertScale.indexOf(divs.y)===-1) {
				var shapeOn = $.onShape(divs);
				if(shapeOn) {
					var index = $.shapesSelected.indexOf(shapeOn);
					if(index>-1) {
						$.deleteShapes($.shapesSelected);
					} else $.deleteShape($.shapes.indexOf(shapeOn));
				} else {
					if($.adjustInterval===$.thirtySecond*2) {
						var divs = $.divs(mouse,$.adjustInterval);
						var l = divs.x*2, r = (divs.x*2+4), t = divs.y;
					}
					else if($.adjustInterval===$.thirtySecond) var l = divs.x, r = (divs.x+4), t = divs.y;
					$.makeShape(l,r,t);
					$.cursor(e);
				}
			// }
		});
	},
	mousedown: function() {
		var $ = this;
		$.side.onmousedown = function(e) {
			var mY = $.mouse(e,$.side).y;
			if($.insideSide(mY)) {
				$.sideClickedY = mY-($.top-$.topCanvas.getBoundingClientRect().top)/$.topCanvas.height*$.height;
			} else {
				$.sideClickedY = $.height/$.topCanvas.height*$.height/2;
				var toBeTop = (mY-$.height/$.topCanvas.height*$.height/2)/$.height*$.topCanvas.height;
				$.moveContainer(-toBeTop);
			}
		}
		$.topCanvas.addEventListener('mousedown',function(e) {
			e.preventDefault();
			if($.asPopup) return;
			var mouse = $.mouse(e,$.topCanvas), mx = mouse.x, my = mouse.y;
			var divs = $.divs(mouse);
			var shapeOn = $.onShape(divs);
			if(shapeOn) {
				// shape on
					if(shapeOn.overExtendLeft(mx)) $.extendingLeft = true;
					else if(shapeOn.overExtendRight(mx)) $.extendingRight = true;
					else {
						$.dragging = true;
						if($.adjustInterval===$.thirtySecond*2)
							$.clickedX = $.divs(mouse,$.adjustInterval).x-shapeOn.l/2;
						else if($.adjustInterval===$.thirtySecond)
							$.clickedX = divs.x-shapeOn.l;
					}
					$.shapeSelected = shapeOn;
				// add or subtract shape
					var index = $.shapesSelected.indexOf(shapeOn);
					if($.shiftDown) {
						if(index===-1) $.shapesSelected.push(shapeOn);
						else $.shapesSelected.splice(index,1);
					} else {
						if(index===-1) {
							$.shapesSelected = [];
							$.shapesSelected.push(shapeOn);
						}
					}
				// diffs
					for(var i=0; i<$.shapesSelected.length; i++) {
						var shape = $.shapesSelected[i];
						if(shape===$.shapeSelected) continue;
						var	sS = $.shapeSelected,
							leftDiff = shape.l-sS.l,
							rightDiff = shape.r-sS.r,
							topDiff = shape.t-sS.t,
							id = $.findId(shape);
						$.selectedDiffs[id] = [leftDiff,rightDiff,topDiff];
					}
			} else {
				$.selectAnchor = mouse;
				$.selecting = true;
				if(!$.shiftDown) $.shapesSelected = [];
			}
			$.redrawShapes();
		});
	},
	mouseup: function() {
		var $ = this;
		window.addEventListener('mouseup',function(e) {
			$.sideClickedY = undefined;
			$.dragging = false;
			$.extendingLeft = false;
			$.extendingRight = false;
			$.shapeSelected = undefined;
			$.selecting = false;
			$.cursor(e);
			$.redrawShapes();
		});
	},
	mousemove: function() {
		var $ = this;
		$.topCanvas.onmousemove = function(e) {
			if($.asPopup) return;
			$.cursor(e);
		}
		window.addEventListener('mousemove',function(e) {
			if($.sideClickedY!==undefined) {
				var mY = $.mouse(e,$.side).y,
					toBeTop = (mY-$.sideClickedY)/$.height*$.topCanvas.height;
				$.moveContainer(-toBeTop);
			}
			var mouse = $.mouse(e,$.topCanvas);
			if($.shapeSelected) {
				if($.extendingLeft) $.changeShape(mouse,'extendLeft');
				else if($.extendingRight) $.changeShape(mouse,'extendRight');
				else if($.dragging) $.changeShape(mouse,'move');
			} else if($.selecting) {
				$.selectShapes(mouse);
				$.drawSelector(mouse);
			} 
		});
	},
	makeShapes: function(array) {
		var $ = this;
		for(var i=0; i<array.length; i++) {
			var s = array[i];
			$.shapes[$.shapes.length] = new $.Shape(s[0],s[1],s[2]);
		}
		$.drawShapes();
	},
	makeShape: function(l,r,t) {
		var $ = this;
		$.shapes[$.shapes.length] = new $.Shape(l,r,t);
		$.shapes[$.shapes.length-1].draw();
	},
	deleteShape: function(index) {
		var $ = this;
		$.shapes.splice(index,1);
		$.redrawShapes();
	},
	deleteShapes: function(shapes) {
		var $ = this;
		for(var i=0; i<shapes.length; i++)
			$.deleteShape($.shapes.indexOf(shapes[i]));
	},
	drawSelector: function(mouse) {
		var $ = this, divs = $.divs(mouse,$.adjustInterval),
			ctx = $.topCanvas.context,
			left = $.selectAnchor.x,
			right = mouse.x,
			width = right-left,
			top = $.selectAnchor.y,
			bottom = mouse.y,
			height = bottom-top;
		$.redrawShapes();
		ctx.fillStyle = 'hsla(40,100%,50%,0.4)';
		ctx.fillRect(left,top,width,height);
	},
	// changing shapes
		changeShape: function(mouse,action) {
			var $ = this;
			$.findPrimaryToBe(mouse,action);
			$.findOtherToBes();
			if(action==='extendLeft') $.extendLeft();
			else if(action==='extendRight') $.extendRight();
			else $.move();
			$.redrawShapes();
		},
		findPrimaryToBe: function(mouse,action) {
			var $ = this, sS = $.shapeSelected,
				id = $.findId(sS),
				divs = $.divs(mouse),
				toBeLeft = sS.l,
				toBeRight = sS.r,
				toBeTop = sS.t,
				w = sS.r - sS.l,
				mult = $.mult();
			if(action==='extendLeft')
				toBeLeft = divs.x*mult;
			else if(action==='extendRight')
				toBeRight = (divs.x+1)*mult;
			else {
				toBeLeft = divs.x*mult-$.clickedX*mult;
				toBeRight = toBeLeft+w;
				toBeTop = divs.y;
			}
			$.selectedToBes[id] = [toBeLeft,toBeRight,toBeTop];
		},
		findOtherToBes: function() {
			var $ = this, selToBe = $.selectedToBes[$.findId($.shapeSelected)];
			for(var i=0; i<$.shapesSelected.length; i++) {
				var shape = $.shapesSelected[i];
				if(shape===$.shapeSelected) continue;
				var	id = $.findId(shape),
					diffs = $.selectedDiffs[id],
					toBeLeft = selToBe[0]+diffs[0],
					toBeRight = selToBe[1]+diffs[1],
					toBeTop = selToBe[2]+diffs[2];
				$.selectedToBes[id] = [toBeLeft,toBeRight,toBeTop];
			}
		},
		extendLeft: function() {
			var $ = this, mult = $.mult();
			for(var i=0; i<$.shapesSelected.length; i++) {
				var shape = $.shapesSelected[i],
					id = $.findId(shape),
					toBeLeft = $.selectedToBes[id][0];
				if(shape.r-toBeLeft>=mult)
					shape.l = toBeLeft;
				else shape.l = shape.r-mult;
				if(toBeLeft<0) shape.l = 0;
			}
		},
		extendRight: function() {
			var $ = this, mult = $.mult();
			for(var i=0; i<$.shapesSelected.length; i++) {
				var shape = $.shapesSelected[i],
					id = $.findId(shape),
					toBeRight = $.selectedToBes[id][1],
					total = $.measureNum*32;
				if(toBeRight-shape.l>=mult)
					shape.r = toBeRight
				else shape.r = shape.l+mult;
				if(total<toBeRight)
					shape.r = total;
			}
		},
		move: function() {
			var $ = this;
			for(var i=0; i<$.shapesSelected.length; i++) {
				var shape = $.shapesSelected[i],
					id = $.findId(shape),
					w = shape.r - shape.l;
				// horiz
					var toBeLeft = $.selectedToBes[id][0],
						toBeRight = toBeLeft+w,
						total = $.measureNum*32;
					if(0<=toBeLeft && toBeRight<=total) {
						shape.l = toBeLeft;
						shape.r = toBeRight;
					} else {
						if(toBeLeft<0) {
							shape.l = 0;
							shape.r = shape.l+w;
						} else {
							shape.r = total;
							shape.l = shape.r-w;
						}
					}
				// vert
					var toBeTop = $.selectedToBes[id][2];
					if(0<=toBeTop && toBeTop<=83)
							shape.t = toBeTop;
					else {
						if(toBeTop<0) toBeTop = 0;
						else toBeTop = 83;
					}
			}
		},
	findId: function(shape) {
		return this.shapes.indexOf(shape)+'';
	},
	Shape: function(l,r,t) {
		this.l = l;
		this.r = r;
		this.t = t;
	},
	setShapePrototypes: function() {
		var editor = this;
		editor.Shape.prototype = {
			cornerPercent: 30,
			mouseIn: function(divs) {
				var $ = this, mult = editor.mult();
				if(($.l<=divs.x*mult && divs.x*mult<$.r) && ($.t===divs.y)) return true;
				else return false;
			},
			overExtendLeft: function(mx) {
				var $ = this, third;
				if($.r-$.l>=2) third = editor.adjustInterval/3;
				else third = editor.adjustInterval/3;
				if(mx<=$.l*editor.thirtySecond+third) return true;
				else return false;
			},
			overExtendRight: function(mx) {
				var $ = this, third;
				if($.r-$.l>=2) third = editor.thirtySecond*2/3;
				else third = editor.thirtySecond/3;
				if($.r*editor.thirtySecond-third<mx) return true;
				else return false;
			},
			draw: function() {
				var $ = this,
					l = $.l*editor.thirtySecond,
					r = $.r*editor.thirtySecond,
					t = $.t*editor.shapeHeight,
					b = t+editor.shapeHeight,
					c = editor.shapeHeight/(100/$.cornerPercent),
					ctx = editor.topCanvas.context,
					color;
				if(editor.invertScale.indexOf($.t)===-1) {
					var block = editor.colors[$.t-Math.floor($.t/12)*12];
					color = 'rgb('+block[0]+','+block[1]+','+block[2]+')';
				} else color = 'gray';
				var pi = Math.PI;
				ctx.beginPath();
				ctx.moveTo((r+l)/2,t);
				ctx.lineTo(r-c,t);
				ctx.arc(r-c,t+c,c,1.5*pi,0);
				ctx.lineTo(r,b-c);
				ctx.arc(r-c,b-c,c,0,0.5*pi);
				ctx.lineTo(l+c,b);
				ctx.arc(l+c,b-c,c,0.5*pi,pi);
				ctx.lineTo(l,t+c);
				ctx.arc(l+c,t+c,c,pi,1.5*pi);
				ctx.closePath();
				ctx.fillStyle = color;
				ctx.fill();
				if(editor.shapeSelected===$ || editor.shapesSelected.indexOf($)!==-1) {
					ctx.strokeStyle = 'white';
					ctx.lineWidth = 2;
					ctx.stroke();
				}
			}
		}
	},
	setState: function(prefs) {
		var $ = this, state = prefs.state, details = prefs.details;
		// structure
			var paramsShow = details.paramsShow,
				guideShow = details.guideShow,
				currentHeight = $.availableHeight;
			if(guideShow) {
				if(paramsShow) {
					$.structureState = 'quarter';
					$.setQuarter();
				} else {
					$.structureState = 'half';
					$.setHalf();
				}
			} else {
				if(paramsShow) {
					$.structureState = 'threeQuarters';
					$.setThreeQuarters();
				} else {
					$.structureState = 'whole';
					$.setWhole();
				}
			}
			if(details.topMode==='editor') $.putInView();
			else $.putOutView();
		// incrementing
			// if(details.initialPhrase.incrementing) $.adjustInterval = $.thirtySecond;
			// else $.adjustInterval = $.thirtySecond*2;
		// render
			if(state==='phrase') $.switchPhrase(details.initialPhrase,0);
			else $.showEmptyPhrase();
	},
	init: function(winWidth,winHeight) {
		var $ = this, prefs = body.build.prefs;
		$.setVariables();
		$.setLayout(winWidth,winHeight);
		$.drawBackground();
		$.setShapePrototypes();
		$.dblclick();
		$.mousedown();
		$.mouseup();
		$.mousemove();
		$.setState(prefs);
	}
}