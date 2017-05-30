'use strict';
body.build.params = {
	show: function() {
		this.container.set()
			.display('block');
	},
	hide: function() {
		this.container.set()
			.display('none');
	},
	setVariables: function() {
		var $ = this, editor = body.build.editor;
		$.side = undefined;
		$.paramNames = ['volume','pan'];
		$.params = {};
		$.container = dom.create('div',htmlBody);
		$.container.set()
			.display('none')
			.position('absolute')
			.zIndex(1)
			.borderRadius(6)
			.background('purple');
	},
	// structure
		setLayout: function(winWidth,winHeight) {
			var $ = this, editor = body.build.editor;
			$.left = menuWidth+body.build.horizontalPadding+editor.offsetSide;
			$.hideOffset = 20;
			$.availableHeight = winHeight-body.build.verticalPadding*2;
			$.height = Math.round($.availableHeight/4);
			$.width = body.build.editor.width;
			$.hiddenLeft = -$.width-20;
			$.paramHeight = $.height/2;
			$.titleHeight = $.paramHeight*1/4;
			$.entryHeight = $.paramHeight*3/4;
			$.spacing = $.paramHeight*1/24;
			$.container.set()
				.width($.width)
				.height($.height)
				.left($.left);
		},
		changeLayout: function(winWidth,winHeight) {
			var $ = this;
			// change when window changes
		},
		setTop: function(withGuide) {
			var $ = this, dec = undefined;
			if(withGuide) dec = 1/4;
			else dec = 3/4;
			$.top = body.build.verticalPadding+body.build.editor.height+body.build.editor.shapeHeight/2;
			$.container.set().top($.top);
		},
		putInView: function(withGuide) {
			var $ = this;
			$.setTop(withGuide);
			$.container.set().left($.left);
		},
		putOutView: function() {
			var $ = this;
			$.container.set().left($.hiddenLeft);
		},
		changeInterface: function() {
			var $ = this;
			if(body.build.controls.topMode==='editor') {
				$.side = 'dynamic';
				for(var i=0; i<$.paramNames.length; i++) {
					var name = $.paramNames[i],
						param = $.params[name];
					param.plane.canvas.set().display('block');
					param.slider.set().display('none');
				}
			} else {
				$.side = 'static';
				for(var i=0; i<$.paramNames.length; i++) {
					var name = $.paramNames[i],
						param = $.params[name];
					param.plane.canvas.set().display('none');
					param.slider.set().display('block');
				}
			}
		},
	makeParams: function() {
		var $ = this;
		for(var i=0; i<$.paramNames.length; i++) {
			var name = $.paramNames[i],
				param = {};
			param.title = $.makeTitle(name,i);
			param.plane = new $.Plane(name,i);
			param.slider = $.makeSlider(name,i);
			$.params[name] = param;
		}
	},
	makeTitle: function(name,pos) {
		var $ = this,
			title = dom.create('div',$.container);
		title.set()
			.width($.width)
			.innerHTML(name)
			.position('absolute')
			.background('yellow')
			.textAlign('center')
			.size($.titleHeight*3/4)
			.font('Times New Roman')
			.top(pos*$.paramHeight+$.spacing);
		return title;
	},
	makeSlider: function(name,pos) {
		var $ = this,
			values = { width: $.width*1/2, height: $.entryHeight*1/5, railColor: 'red', blockColor: 'blue' },
			onchange = function(value) {
				// $.changeSet(name,value);
			},
			slider = dom.makeSlider($.container,values,[0,100],onchange);
		slider.set()
			.position('absolute')
			.left($.width*1/4)
			.top(pos*$.paramHeight+$.titleHeight+($.entryHeight/2)-values.height/2);
		return slider;
	},
	Plane: function(name,pos) {
		var $ = this, params = body.build.params;
		$.canvas = dom.create('canvas',params.container);
		$.canvas.set()
			.canWidth(params.width)
			.canHeight(params.entryHeight-params.spacing)
			.left(0)
			.top(pos*params.paramHeight+params.titleHeight)
			.position('absolute')
			.background('orange');
		$.canvas.onmousedown = function(e) {
			e.preventDefault();
			$.mousedown(e);
		}
		$.canvas.ondblclick = function(e) {
			e.preventDefault();
			$.dblclick(e);
		}
		window.addEventListener('mousemove',function(e) {
			e.preventDefault();
			$.mousemove(e);
		});
		window.addEventListener('mouseup',function(e) {
			$.mouseup(e);
		});
		$.dynamic = [];
	},
	setPlanePrototype: function() {
		var params = body.build.params;
		params.Plane.prototype = {
			circleRadius: params.entryHeight/8,
			highlightIndex: undefined,
			// converters
				pointToCanvas: function(index) {
					var $ = this, point = $.dynamic[index],
						x = point[0], y = point[1];
					return { x: $.xToCanvas(x), y: $.yToCanvas(y) };
				},
				pointToData: function(index) {
					var $ = this, point = $.dynamic[index],
						x = point[0], y = point[1];
					return { x: $.xToData(x), y: $.yToData(y) };
				},
				xToCanvas: function(x) {
					var $ = this;
					return x*$.canvas.width;
				},
				yToCanvas: function(y) {
					var $ = this,
						flipped = y+1,
						outOfTwo = 2-flipped,
						toCanvas = outOfTwo/2*$.canvas.height;
					return toCanvas;
				},
				xToData: function(x) {
					var $ = this;
					return x/$.canvas.width;
				},
				yToData: function(y) {
					var $ = this,
						outOfTwo = y/$.canvas.height*2,
						flipped = 2-outOfTwo,
						toOnes = flipped-1;
					return toOnes;
				},
			draw: function() {
				var $ = this, ctx = $.canvas.context;
				$.erase();
				function findStart() {
					var point = $.dynamic[0],
						time = point[0];
					if(time===0) return point[1];
					else return params.entryHeight/2;
				}
				if($.dynamic.length===0) {
					ctx.beginPath();
					ctx.moveTo(0,params.entryHeight/2);
					ctx.lineTo($.canvas.width,params.entryHeight/2);
					ctx.strokeStyle = 'black';
					ctx.stroke();
					return;
				}
				// lines
					ctx.beginPath();
					for(var i=0; i<$.dynamic.length; i++) {
						var p = $.pointToCanvas(i);
						if(i===0) {
							if(p.x===0) ctx.moveTo(0,p.y);
							else ctx.moveTo(0,params.entryHeight/2);
						}
						ctx.lineTo(p.x,p.y);
						if(i===$.dynamic.length-1) {
							if(p.x===$.canvas.width) ctx.lineTo($.canvas.width,p.y);
							else ctx.lineTo($.canvas.width,params.entryHeight/2);
						}
					}
					ctx.strokeStyle = 'black';
					ctx.stroke();
				// highlighted lines
					if($.highlightIndex!==undefined) {
						ctx.beginPath();
						for(var i=$.highlightIndex-1; i<=$.highlightIndex+1; i++) {
							if(i===-1) {
								var firstX = $.dynamic[$.highlightIndex][0];
								if(firstX===0) ctx.moveTo(0,firstX);
								else ctx.moveTo(0,params.entryHeight/2);
								continue;
							} else if($.dynamic.length===i) {
								var lastX = $.dynamic[$.dynamic.length-1][0];
								if(lastX===1) ctx.lineTo($.canvas.width,p.y);
								else ctx.lineTo($.canvas.width,params.entryHeight/2);
								break;
							}
							var p = $.pointToCanvas(i);
							if(i===$.highlightIndex-1) ctx.moveTo(p.x,p.y);
							else ctx.lineTo(p.x,p.y);
						}
						ctx.strokeStyle = 'yellow';
						ctx.stroke();
					}
				// default circles
					for(var i=0; i<$.dynamic.length; i++) {
						var p = $.pointToCanvas(i);
						$.drawCircle(p.x,p.y,'red');
					}
				// highlighted circles
					if($.highlightIndex!==undefined) {
						var p = $.pointToCanvas($.highlightIndex);
						$.drawCircle(p.x,p.y,'orange');
					}
			},
			drawCircle: function(x,y,color) {
				var $ = this, ctx = $.canvas.context;
				ctx.beginPath();
				ctx.arc(x,y,$.circleRadius,0,Math.PI*2,false);
				ctx.fillStyle = color;
				ctx.fill();
			},
			erase: function() {
				var $ = this;
				$.canvas.context.clearRect(0,0,$.canvas.width,$.canvas.height);
			},
			addPoint: function(x,y) {
				var $ = this,
					xPerc = $.xToData(x),
					yPerc = $.yToData(y),
					array = [xPerc,yPerc];
				for(var i=0; i<$.dynamic.length; i++) {
					var point = $.dynamic[i];
					if(point[0]<xPerc) {
						if(i+1===$.dynamic.length) {
							$.dynamic.push(array);
							break;
						} else continue;
					} else {
						$.dynamic.splice(i,0,array);
						break;
					}
				}
				if($.dynamic.length===0) {
					$.dynamic.push(array);
				}
				return $.dynamic.indexOf(array);
			},
			removePoint: function(index) {
				var $ = this;
				$.dynamic.splice(index,1);
			},
			inBoundaries: function(index,x,y) {
				var $ = this;
				// sides
					if(x<0) x = 0;
					else if($.canvas.width<x) x = $.canvas.width;
					if(y<0) y = 0;
					else if($.canvas.height<y) y = $.canvas.height;
				// neighbors
					if(1<=index) {
						var left = $.pointToCanvas(index-1).x;
						if(x<=left) x = left+1;
					}
					if(index<=$.dynamic.length-2) {
						var right = $.pointToCanvas(index+1).x;
						if(right<=x) x = right-1;
					}
				return { x: x, y: y };
			},
			movePoint: function(index,x,y) {
				var $ = this,
					newCoords = $.inBoundaries(index,x,y),
					x = newCoords.x, y = newCoords.y;
				var array = [$.xToData(x),$.yToData(y)];
				$.dynamic[index] = array;
				$.draw();
			},
			onCircle: function(x,y) {
				var $ = this;
				for(var i=0; i<$.dynamic.length; i++) {
					var p = $.pointToCanvas(i);
					if(
						(p.x-$.circleRadius<=x && x<p.x+$.circleRadius)
						&&
						(p.y-$.circleRadius<=y && y<p.y+$.circleRadius)
					) return i;
				}
				return undefined;
			},
			mousedown: function(e) {
				var $ = this;
				var mouse = params.mouse(e,$.canvas),
					mX = mouse.x, mY = mouse.y,
					circleIndex = $.onCircle(mX,mY);
				if(circleIndex!==undefined) {
					$.moving = circleIndex;
					$.highlightIndex = circleIndex;
				} else {
					$.highlightIndex = undefined;
					$.draw();
				}
			},
			dblclick: function(e) {
				var $ = this,
					mouse = params.mouse(e,$.canvas),
					mX = mouse.x, mY = mouse.y,
					circleIndex = $.onCircle(mX,mY);
				if(circleIndex!==undefined) {
					$.removePoint(circleIndex);
					$.highlightIndex = undefined;
				} else {	
					$.highlightIndex = $.addPoint(mX,mY);
				}
				$.canvas.context.clearRect(0,0,$.canvas.width,$.canvas.height);
				$.draw();
			},
			mousemove: function(e) {
				var $ = this;
				var mouse = params.mouse(e,$.canvas),
					mX = mouse.x, mY = mouse.y;
				if($.moving!==undefined) $.movePoint($.moving,mX,mY);
			},
			mouseup: function(e) {
				var $ = this;
				var mouse = params.mouse(e,$.canvas);
				if($.moving!==undefined) $.moving = undefined;
			}
		}
	},
	mouse: function(e,element) {
		var rect = element.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		}
	},
	toggle: function() {
		var $ = this;
		if($.side==='set') {
			for(var i=0; i<$.paramNames.length; i++) {
				var param = $.params[$.paramNames[i]];
				param.slider.show();
				param.plane.erase();
			}
		} else {
			for(var i=0; i<$.paramNames.length; i++) {
				var param = $.params[$.paramNames[i]];
				param.slider.hide();
				param.plane.draw();
			}
		}
	},
	setState: function(prefs) {
		var $ = this, details = prefs.details;
		$.side = 'dynamic';
		if(details.paramsShow) $.putInView(details.guideShow);
		else $.putOutView();
		var initialPhrase = details.initialPhrase;
		for(var i=0; i<$.paramNames.length; i++) {
			var name = $.paramNames[i],
				param = $.params[name];
			param.plane.dynamic = initialPhrase[name];
			param.plane.draw();
		}
	},
	init: function(winWidth,winHeight) {
		var $ = this, prefs = tail.storage.preferences.build;
		$.setVariables();
		$.setLayout(winWidth,winHeight);
		$.setPlanePrototype();
		$.makeParams();
		$.setState(prefs);
	}
}