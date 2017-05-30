'use strict';
body.browse.panel = {
	show: function() {
		var $ = this;
		// $.leftSide.holder.set()
		// 	.display('block');
		// $.rightSide.holder.set()
		// 	.display('block');
	},
	hide: function() {
		var $ = this;
		// $.leftSide.holder.set()
		// 	.display('none');
		// $.rightSide.holder.set()
		// 	.display('none');
	},
	changeLayout: function(width,height) {
		var $ = this;
		console.log('panel change layout');
	},
	setVariables: function(width,height) {
		var $ = this, dom = body.helpers.dom;
		$.top = 75;
		$.width = 1200;
		$.height = 423;
		$.leftSide = {};
		$.rightSide = {};
		// helpers
			$.rowNum = 4;
			$.specialColNum = 1;
			$.totalColNum = 6;
			$.tilePadding = 20;
			$.sidebarWidth = 6;
			var widthWithoutSidebars = $.width-$.sidebarWidth*2-$.tilePadding;
			$.tileWidth = (widthWithoutSidebars-$.tilePadding*$.totalColNum)/$.totalColNum;
			$.tileHeight = ($.height-$.tilePadding*$.rowNum)/$.rowNum;
		// dragging
			$.dragTile = undefined;
			$.dragOffset = undefined;
			$.dragOriginalCell = undefined;
		window.addEventListener('mouseup',function(e) {
			if($.dragTile) $.endMove(e);
		});
		window.addEventListener('mousemove',function(e) {
			if($.dragTile) {
				e.preventDefault();
				$.moveTile(e);
			}
		});
	},
	// make stuff
		makeLeftSide: function() {
			var $ = this,
				colNum = $.specialColNum,
				width = ($.tileWidth+$.tilePadding)*colNum;
			$.leftSide = new dom.Scroller(head.design.htmlBody,width,$.height,$.rowNum,colNum,$.tilePadding,$.sidebarWidth,$.Tile);
			$.leftSide.left = 100;
			$.leftSide.holder.set()
				.display('none')
				.position('absolute')
				.background('green')
				.left($.leftSide.left)
				.top($.top);
		},
		makeRightSide: function() {
			var $ = this,
				colNum = $.totalColNum-$.leftSide.colNum,
				width = ($.tileWidth+$.tilePadding)*colNum;
			$.rightSide = new dom.Scroller(head.design.htmlBody,width,$.height,$.rowNum,colNum,$.tilePadding,$.sidebarWidth,$.Tile);
			$.rightSide.left = $.leftSide.left+$.leftSide.width+$.sidebarWidth+$.tilePadding/2;
			$.rightSide.holder.set()
				.display('none')
				.position('absolute')
				.background('red')
				.left($.rightSide.left)
				.top($.top);
		},
		makeActionLabel: function() {
			var $ = this;
			$.actionLabel = dom.create('div');
			$.actionLabel.set()
				.width($.tileWidth)
				.height($.tileHeight*1/8)
				.position('absolute')
				.background('red');
		},
	// move tile
		mouse: function(element,e) {
			var rect = element.getBoundingClientRect();
			return {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			}
		},
		startMove: function(tile,e) {
			var $ = this;
			$.dragTile = tile;
			$.dragOffset = $.mouse(tile.container,e);
			$.dragOriginalCell = $.findCurrentCell(tile.side,tile,e);
			var body = head.design.htmlBody,
				windowCoords = $.mouse(body,e);
			tile.side.container
				.removeChild(tile.container);
			tile.container.set()
				.left(windowCoords.x-$.dragOffset.x)
				.top(windowCoords.y-$.dragOffset.y);
			body.appendChild(tile.container);
			tile.container.set()
				.zIndex(1);
		},
		inside: function(side,mouse) {
			var $ = this,
				x = mouse.x, y = mouse.y;
			if(side.left<x && x< side.left+side.width &&
				$.top<y && y<$.top+$.height) return true;
			else return false;
		},
		moveTile: function(e) {
			var $ = this,
				tile = $.dragTile,
				side = tile.side,
				mouse = $.mouse(head.design.htmlBody,e),
				offset = $.dragOffset,
				left = mouse.x-offset.x,
				top = mouse.y-offset.y;
			tile.container.set()
				.left(left)
				.top(top);
			// action label
				if(tile.side===$.rightSide) {
					if($.inside($.leftSide,mouse)) {
						if(!tile.withLabel) {
							$.actionLabel.set()
								.left(0)
								.top(-$.tileHeight*1/8-4)
								.innerHTML('add to favorites');
							tile.container.appendChild($.actionLabel);
							tile.withLabel = true;
						}
					} else {
						if(tile.withLabel) {
							tile.container.removeChild($.actionLabel);
							tile.withLabel = false;
						}
					}
				} else if(tile.side===$.leftSide) {
					if(!$.inside($.leftSide,mouse)) {
						if(!tile.withLabel) {
							$.actionLabel.set()
								.left(0)
								.top(-$.tileHeight*1/8-4)
								.innerHTML('remove to favorites');
							tile.container.appendChild($.actionLabel);
							tile.withLabel = true;
						}
					} else {
						if(tile.withLabel) {
							tile.container.removeChild($.actionLabel);
							tile.withLabel = false;
						}
					}
				}
		},
		endMove: function(e) {
			var $ = this,
				tile = $.dragTile,
				bodyMouse = $.mouse(head.design.htmlBody,e),
				returnToOriginal = undefined;
			$.dragTile = undefined;
			// return to original
				if(tile.side===$.rightSide && !$.inside($.leftSide,bodyMouse)) returnToOriginal = true;
				else if(tile.side===$.leftSide && $.inside($.leftSide,bodyMouse)) returnToOriginal = true;
				else returnToOriginal = false;
				if(returnToOriginal) {
					tile.side.container.appendChild(tile.container);
					tile.container.set().zIndex(0);
					tile.side.moveToRow(tile,$.dragOriginalCell.row)
					tile.side.moveToColumn(tile,$.dragOriginalCell.col);
					return;
				}
			// insert and/or delete
				tile.container.set()
					.transition('0.5s')
					.background('transparent');
				window.setTimeout(function() {
					head.design.htmlBody.removeChild(tile.container);
					tile.container.set().transition('0');
				},150);
				tile.side.removeTile(tile,undefined,$.dragOriginalCell.row,$.dragOriginalCell.col);
				if($.inside($.leftSide,bodyMouse)) $.leftSide.insertTile(tile,undefined,$.dragOriginalCell.row,$.dragOriginalCell.col);
		},
		findCurrentCell: function(side,tile,e) {
			var $ = this, row, col;
			for(var r=0; r<side.rows.length; r++) {
				var row = side.rows[r];
				for(var c=0; c<row.length; c++) {
					if(row[c]===tile)
						return { row: r, col: c };
				}
			}
		},
		findNearestCell: function(side,tile,e) {
			var $ = this,
				mouse = $.mouse(side.container,e),
				offset = $.dragOffset,
				halfPad = $.tilePadding/2,
				leftWithPad = mouse.x-offset.x-halfPad,
				topWithPad = mouse.y-offset.y-halfPad,
				col = Math.round(leftWithPad/$.colWidth),
				row = Math.round(topWithPad/$.rowHeight);
			return (row+1)*side.colNum-(side.colNum-col);
		},
	// tiles
		Tile: function(side,width,height) {
			var  $ = this;
			$.side = side;
			$.width = width;
			$.height = height;
			$.makeContainer();
			$.makeDisplay();
			$.makeMeasureNum();
			$.makeHits();
			$.makeZoom();
			$.makeAuthor();
			$.makeInstrument();
		},
		setTilePrototype: function() {
			var panel = this;
			panel.Tile.prototype = {
				side: undefined,
				content: undefined,
				width: undefined,
				height: undefined,
				withLabel: undefined,
				// helpers
					load: function(content) {
						var $ = this;
						if(content && !$.content)
							$.container.set()
								.display('block');
						if(content) {
							$.measureNum.reset(content);
						} else
							$.container.set()
								.display('none');
						$.content = content;
					},
				// elements
					makeContainer: function() {
						var $ = this;
						$.container = dom.create('div',$.side.container);
						$.container.set()
							.width($.width)
							.height($.height)
							.background('yellow')
							.position('absolute')
							.borderRadius(10);
						$.container.onmousedown = function(e) {
							panel.startMove($,e);
						}
					},
					makeDisplay: function() {
						var $ = this;
						$.display = dom.create('canvas',$.container);
						$.display.set()
							.canWidth($.playerSide)
							.canHeight($.playerSide)
							.borderRadius($.width/2)
							.background('white')
							.position('absolute')
							.mousePointer();
						$.display.onclick = function() {
							preservePointer();
							//$.play();
						}
					},
					makeMeasureNum: function() {
						var $ = this;
						$.measureNum = {
							p: dom.create('p',$.container),
							num: '',
							values: { font: 'Times New Roman', size: 24, color: 'white' }
						}
						var measNum = $.measureNum,
							values = measNum.values;
						measNum.p.set()
							.font(values.font)
							.size(values.size)
							.color(values.color)
							.innerHTML(measNum.num)
							.position('absolute')
							.padding(values.size/2,['Left','Right'])
							.padding(values.size/4,['Top','Bottom'])
							.borderRadius(values.size)
							.background('orange')
							.mousePointer();
						measNum.p.onclick = function() {
							preservePointer();
							$.play();
						}
						measNum.reset = function(measureNum) {
							this.num = measureNum;
							this.p.set().innerHTML(measureNum);
						}
					},
					makeHits: function() {
						var $ = this;
						$.hits = {
							figure: {
								p: dom.create('p',$.container),
								num: '',
								values: { font: 'Times New Roman', size: 24, color: 'white' }
							},
							word: {
								p: dom.create('p',$.container),
								text: 'hits',
								values: { font: 'Times New Roman', size: 14, color: 'white' }
							}
						}
						// figure
							var figure = $.hits.figure,
								values = figure.values;
							figure.p.set()
								.font(values.font)
								.size(values.size)
								.color(values.color)
								.innerHTML(figure.num)
								.position('absolute')
								.mousePointer();
						// word
							var word = $.hits.word,
								values = word.values;
							word.p.set()
								.font(values.font)
								.size(values.size)
								.color(values.color)
								.innerHTML(word.text)
								.position('absolute')
								.transform('rotate(-90deg)');
						$.hits.reset = function(hits) {
							this.figure.p.set().innerHTML(hits);
						}
					},
					makeZoom: function() {
						var $ = this;
						$.zoom = {
							values: { text: '+', font: 'Times New Roman', size: 36, color: 'white' }
						}
						var zoom = $.zoom,
							values = zoom.values;
						zoom.sign = dom.create('p',$.container);
						zoom.sign.set()
							.font(values.font)
							.size(values.size)
							.color(values.color)
							.innerHTML(values.text)
							.background('purple')
							.position('absolute')
							.transition('0.1s')
							.mousePointer([['transform','scale(1.1,1.1)','scale(1,1)']]);
						zoom.sign.onclick = function() {
							preservePointer();
							console.log('analyzing');
						}
					},
					makeAuthor: function() {
						var $ = this;
						$.author = {
							pic: dom.create('div',$.container),
							values: { side: 30, borderRadius: 4 }
						}
						var author = $.author,
							values = author.values;
						author.pic.set()
							.width(values.side)
							.height(values.side)
							.background('purple')
							.borderRadius(values.borderRadius)
							.position('absolute');
					},
					makeInstrument: function() {
						var $ = this;
						$.instrument = {
							canvas: dom.create('canvas',$.container),
							values: { side: 30, borderRadius: 4 }
						}
						var inst = $.instrument,
							values = inst.values;
						inst.canvas.set()
							.canWidth(values.side)
							.canHeight(values.side)
							.background('blue')
							.borderRadius(values.borderRadius)
							.position('absolute');
					},
				// functionality
					drawDisplay: function() {
						var $ = this, player = $.player,
							canvas = player.bottom, ctx = canvas.context,
							inRadius = $.measureNum.values.size/2*3/2,
							outRadius = canvas.width/2,
							diff = outRadius-inRadius,
							measNum = $.phrase.measureNum,
							shapes = $.phrase.shapes,
							secs = [];
						// organize shapes
							for(var i=0; i<measNum*32; i++) secs.push([]);
							for(var s=0; s<shapes.length; s++) {
								var shape = shapes[s];
								for(var i=shape[0]; i<shape[1]; i++) {
									secs[i].push(shape[2]);
								}
							}
							for(var i=0; i<secs.length; i++) secs[i].sort(function(a,b) { return b-a });
						// erasing
							ctx.clearRect(0,0,canvas.width,canvas.height);
						// draw
							var startAngle = 0,
								incrementAngle = Math.PI/(measNum*32/2),
								endAngle = incrementAngle;
							for(var i=0; i<secs.length; i++) {
								var sec = secs[i],
									b = inRadius,
									h = diff/sec.length,
									toExtend;
								if(secs[i+1] && secs[i+1].length>0) toExtend = true;
								else toExtend = false;
								for(var s=0; s<sec.length; s++) {
									var num = sec[s],
										block = panel.colors[num-Math.floor(num/12)*12],
										color = 'rgb('+block[0]+','+block[1]+','+block[2]+')';
									ctx.beginPath();
									if(toExtend) {
										ctx.arc(outRadius,outRadius,b,startAngle,endAngle+incrementAngle);
										ctx.arc(outRadius,outRadius,b+h,endAngle+incrementAngle,startAngle,true);
									} else {
										ctx.arc(outRadius,outRadius,b,startAngle,endAngle);
										ctx.arc(outRadius,outRadius,b+h,endAngle,startAngle,true);
									}
									ctx.closePath();
									ctx.fillStyle = color;
									ctx.fill();
									b+=h;
								}
								startAngle = endAngle;
								endAngle += incrementAngle;
							}
					},
					playPlayer: function() {
						var $ = this, player = $.player;
							//canvas = player.top, ctx = canvas.context;
						// console.log('drawing in some way');
						// javascript
							// var inRadius = $.details.measureNum.values.size/2*3/2,
							// 	outRadius = canvas.width/2,
							// 	diff = outRadius-inRadius,
							// 	angle = 0,
							// 	time = 1800,
							// 	draws = 0;
							// var interval = window.setInterval(function() {
							// 	if(draws<Infinity) {
							// 		angle -= 2*Math.PI/300;
							// 		draw(angle);
							// 		draws += 1;
							// 	} else window.clearInterval(interval);
							// },8);
							// function draw(angle) {
							// 	ctx.clearRect(0,0,canvas.width,canvas.height);
							// 	ctx.beginPath();
							// 	ctx.moveTo(
							// 		outRadius+Math.cos(angle)*inRadius,
							// 		outRadius-Math.sin(angle)*inRadius
							// 		);
							// 	ctx.lineTo(
							// 		outRadius+Math.cos(angle)*outRadius,
							// 		outRadius-Math.sin(angle)*outRadius
							// 		);
							// 	ctx.lineWidth = 2;
							// 	ctx.stroke();
							// }
						// css
							// var mid = canvas.width/2;
							// ctx.beginPath();
							// ctx.moveTo(mid,mid);
							// ctx.lineTo(canvas.width,mid);
							// ctx.lineWidth = 2;
							// ctx.stroke();
							// canvas.set()
							// 	.transition('20s linear')
							// 	.transform('rotate(1000deg)');
					},
					stopPlayer: function() {
						var $ = this;
						// console.log('stopping');
					},
					play: function() {
						var $ = this;
						$.playPlayer();
						//tail.sound.playBrowsePhrase($.phrase.shapes);
					},
					stop: function() {
						var $ = this;
						$.stopPlayer();
						//tail.sound.stopBrowsePhrase();
					}
			}
		},
	setState: function() {
		var $ = this;
		// left side
			var lSStartIndex = 0,
				lSStream = ['a','b','c','d','e','f','g'];
			$.leftSide.loadStream(lSStream);
		// right side
			var rSStartIndex = 0,
				rSStream = ['h','i','j','k','l','m','n','o','p','q','r','s'];
			var stream = [];
			for(var i=0; i<1000; i++) stream.push(i+'');
			$.rightSide.loadStream(stream);
	},
	init: function(width,height) {
		var $ = this;
		$.setVariables(width,height);
		// $.setTilePrototype();
		// $.makeActionLabel();
		// $.makeLeftSide();
		// $.makeRightSide();
		// $.setState();
	}
}

