'use strict';
body.build.keyboard = {
	show: function() {
		this.container.set()
			.display('block');
	},
	hide: function() {
		this.container.set()
			.display('none');
	},
	setVariables: function(prefs) {
		var $ = this;
		// structure
			$.structureState = undefined;
		// container
			$.container = dom.create('div',htmlBody);
			$.container.set()
				.display('none')
				.position('absolute')
				.background('pink')
				.borderRadius(10)
				.transition(body.build.topTransitionTime+'s');
		// helpers
			// colors
				$.activeDiff = 80;
				var inacCol = 200;
				$.inactiveColor = [inacCol,inacCol,inacCol];
				var antiCol = 255;
				$.antiHighlightColor = 'rgba('+antiCol+','+antiCol+','+antiCol+','+0.8+')';
			// recording
				$.givingIntro = false;
				$.recording = false;
				$.introTimeout = undefined;
				$.recordingTimeout = undefined;
				$.recordStartTime = undefined;
				$.recordedNotes = [];
				$.activeNotesStart = {};
			$.typeOrder = [0,1,0,1,0,0,1,0,1,0,1,0]; // 0: white, 1: black
			$.totalNotes = body.build.editor.totalOctaves*12;
			$.dragging = false;
			$.focus = undefined; // board or tracker
			$.fingerSymbols = ['Q','A','W','S','E','D','R','F','T','G','Y','H','U','J','I','K','O','L','P',';','[',"'",']']
			$.fingerNames = ["81", "65", "87", "83", "69", "68", "82", "70", "84", "71", "89", "72", "85", "74", "73", "75", "79", "76", "80", "186", "219", "222", "221"];
			$.fingerMap = {};
			for(var i=0; i<$.fingerNames.length; i++) {
				var name = $.fingerNames[i];
				$.fingerMap[name] = {
					currentIndex: undefined,
					oldIndex: undefined,
					symbol: $.fingerSymbols[i],
				};
			}
			$.activeIndexes = [];
			$.bottomIndex = undefined;
		// listeners
			window.addEventListener('mousemove',function(e) {
				if($.dragging) {
					if($.focus==='board') $.moveByBoard(e);
					else $.moveByTracker(e);
				}
			});
			window.addEventListener('mouseup',function(e) {
				$.dragging = false;
				$.boardMouseup(e);
			});
		// board
			$.board = dom.create('canvas',$.container);
			$.board.set()
				.position('absolute')
				.background('white');
			$.board.ctx = $.board.getContext('2d');
			// text
				$.textMode = undefined; // finger or note
			// listeners
				$.board.onmousedown = function(e) {
					$.boardMousedown(e);
				}
				$.board.onmousewheel = function(e) {
					e.preventDefault();
					$.move($.keyboardLeft+e.wheelDeltaX/3);
				}
				window.addEventListener('keydown',$.fingerDown);
				window.addEventListener('keyup',$.fingerUp);
		// tracker
			$.tracker = dom.create('canvas',$.container);
			$.tracker.set()
				.position('absolute')
				.background('white')
				.display('none');
			$.tracker.ctx = $.tracker.getContext('2d');
			// listeners
				$.tracker.onmousedown = function(e) {
					$.trackerMousedown(e);
				}
			// helpers
				$.keyCodes = [];
	},
	startRecording: function() {
		var $ = this,
			measureNum = body.build.editor.measureNum,
			measureTime = tail.sound.measureTime;
		if($.recordedNotes.length>0) $.recordedNotes = [];
		$.givingIntro = true;
		$.recordButton.div.set().background('orange');
		$.introTimeout = window.setTimeout(realStart,measureTime*1000);
		function realStart() {
			$.givingIntro = false;
			$.recording = true;
			$.recordButton.div.set().background('purple');
			$.recordStartTime = tail.sound.context.currentTime;
			$.recordingTimeout = window.setTimeout(function() {
				$.stopRecording();
			},measureNum*measureTime*1000);
		}
	},
	stopRecording: function() {
		var $ = this;
		if(!($.givingIntro || $.recording)) return;
		if($.givingIntro) {
			$.givingIntro = false;
			window.clearTimeout($.introTimeout);
		} else if($.recording) {
			$.recording = false;
			window.clearTimeout($.recordingTimeout);
		}
		$.recordButton.div.set().background('black');
	},
	sendRecording: function() {
		var $ = this;
		if($.recordedNotes.length>0) {
			body.build.editor.makeShapes($.recordedNotes);
			$.recordedNotes = [];
		}
	},
	// structure
		setLayout: function(winWidth,winHeight) {
			var $ = this;
			// dimensions
				var editor = body.build.editor;
				$.availableHeight = winHeight-body.build.verticalPadding*2;
				var quarterHeight = $.availableHeight/4;
				$.width = editor.width;
				$.left = editor.left+editor.offsetSide;
				$.top = editor.top;
				$.hideLeft = ($.left*2+$.width)/2+body.build.hideOffset;
			// container
				$.container.set()
					.width($.width)
					.top($.top);
			// helpers
				$.buttonSide = quarterHeight*1/3;
			// board
				$.boardWidth = $.width*4/5;
				$.boardHeight = quarterHeight*4/5;
				$.boardMiddle = $.boardHeight/2;
				$.leftBoardLeft = $.width*1/15;
				$.middleBoardLeft = ($.width-$.boardWidth)/2;
				$.board.set()
					.canWidth($.boardWidth)
					.canHeight($.boardHeight);
				// text
					$.textSize = 18;
					$.board.ctx.font = $.textSize+'px Helvetica';
				// key dimensions
					var vertPadding = 2;
					$.boardKeyDimensions = {};
					var bKD = $.boardKeyDimensions;
					bKD.whiteKeyWidth = $.boardWidth/11;
					bKD.blackKeyWidth = bKD.whiteKeyWidth*4/5;
					bKD.whiteKeyHeight = $.boardHeight-vertPadding*2;
					bKD.blackKeyHeight = bKD.whiteKeyHeight/2;
					bKD.borderRadius = 4;
					bKD.padding = 1;
				// helpers
					$.keyboardLeft = undefined;
					$.keyboardLeftPercentage = undefined;
					$.keyboardWidth = $.totalNotes*7/12*bKD.whiteKeyWidth;
					$.vertBoardPadding = vertPadding;
					$.boardClickedX = undefined;
					$.boardClickedY = undefined;
					$.structureHeight = quarterHeight*2; // half mode height
					$.structureTop = undefined;
			// tracker
				$.trackerWidth = $.boardWidth*2/3;
				$.trackerHeight = $.boardHeight*1/4;
				$.trackerMiddle = $.trackerHeight/2;
				$.middleTrackerLeft = ($.width-$.trackerWidth)/2;
				$.trackerLeft = $.boardLeft+($.boardWidth-$.trackerWidth)/2;
				$.tracker.set()
					.canWidth($.trackerWidth)
					.canHeight($.trackerHeight);
				// key dimensions
					var vertPadding = 1;
					$.trackerKeyDimensions = {};
					var tKD = $.trackerKeyDimensions;
					tKD.whiteKeyWidth = $.trackerWidth/($.totalNotes*7/12);
					tKD.blackKeyWidth = tKD.whiteKeyWidth*4/5;
					tKD.whiteKeyHeight = $.trackerHeight-vertPadding*2;
					tKD.blackKeyHeight = tKD.whiteKeyHeight/2;
					tKD.borderRadius = 1;
					tKD.padding = 0.5;
				// helpers
					$.highlightClickedX = undefined;
					$.trackerVertPadding = 1;
					$.trackerHighlightWidth = ($.boardWidth/$.keyboardWidth)*$.trackerWidth;
					$.trackerHighlightLeft = undefined;
		},
		changeLayout: function(winWidth,winHeight) {
			var $ = this;
			// change when window changes
		},
		putInView: function() {
			var $ = this;
			$.container.set().left($.left);
		},
		putOutView: function() {
			var $ = this;
			$.container.set().left($.hideLeft);
			$.sendRecording();
		},
		makeLabelButtons: function() {
			var $ = this;
			$.labelButtons = {};
			var values = { width: $.buttonSide, height: $.buttonSide, borderRadius: $.buttonSide/12, background: 'blue' },
				pics = tail.storage.keyboardLabelButtons;
			var onclick = function() {
				$.textMode = 'finger';
				$.draw();
			}
			var finger = dom.makeCanvasButton($.container,values,pics.finger,onclick);
			finger.set()
				.position('absolute')
				.display('none');
			var onclick = function() {
				$.textMode = 'note';
				$.draw();
			}
			var note = dom.makeCanvasButton($.container,values,pics.note,onclick);
			note.set()
				.position('absolute')
				.display('none');
			var onclick = function() {
				$.textMode = undefined;
				$.draw();
			}
			var neither = dom.makeCanvasButton($.container,values,pics.neither,onclick);
			neither.set()
				.position('absolute')
				.display('none');
			$.labelButtons.finger = finger;
			$.labelButtons.note = note;
			$.labelButtons.neither = neither;
		},
		makeRecordButton: function() {
			var $ = this;
			$.recordButton = {};
			var div = dom.create('div',$.container);
			div.set()
				.width($.buttonSide)
				.height($.buttonSide)
				.borderRadius($.buttonSide/8)
				.background('black')
				.position('absolute')
				.mousePointer();
			var light = dom.create('div',div);
			light.set()
				.width($.buttonSide/2)
				.height($.buttonSide/2)
				.borderRadius($.buttonSide/4)
				.background('-webkit-radial-gradient(6px 6px, circle, white, red)')
				.position('absolute')
				.left($.buttonSide/4)
				.top($.buttonSide/4)
				.boxShadow(0,0,20,10,'red');
			$.recordButton.div = div;
			$.recordButton.lgith = light;
			$.recordButton.div.onclick = function() {
				preservePointer();
				if($.givingIntro || $.recording) $.stopRecording();
				else $.startRecording();
			}
		},
		setQuarter: function() {
			var $ = this;
			// $.height = $.availableHeight/4;
			$.height = body.build.editor.height;
			var middle = $.height/2;
			$.container.set()
				.height($.height);
			$.tracker.set()
				.display('none');
			$.board.set()
				.left($.leftBoardLeft)
				.top(middle-$.boardMiddle);
			$.recordButton.div.set()
				.left($.width-$.width*1/17-$.buttonSide/2)
				.top(middle-$.buttonSide/2);
			$.labelButtons.finger.set()
				.display('none');
			$.labelButtons.note.set()
				.display('none');
			$.labelButtons.neither.set()
				.display('none');
			$.structureState = 'quarter';
		},
		setStructure: function() {
			var $ = this;
			$.structureTop = ($.height-$.structureHeight)/2;
			$.container.set()
				.height($.height);
			$.tracker.set()
				.left($.middleTrackerLeft)
				.top($.structureTop+$.structureHeight*7/17-$.trackerMiddle)
				.display('block');
			$.board.set()
				.left($.middleBoardLeft)
				.top($.structureTop+$.structureHeight*12/17-$.boardMiddle);
			var buttonHeight = $.structureTop+$.structureHeight*4/17-$.buttonSide/2;
			$.recordButton.div.set()
				.left($.width-$.width*1/17-$.buttonSide/2)
				.top(buttonHeight);
			$.labelButtons.finger.set()
				.display('block')
				.left($.width*7.5/17-$.buttonSide/2)
				.top(buttonHeight);
			$.labelButtons.note.set()
				.display('block')
				.left($.width*8.5/17-$.buttonSide/2)
				.top(buttonHeight);
			$.labelButtons.neither.set()
				.display('block')
				.left($.width*9.5/17-$.buttonSide/2)
				.top(buttonHeight);
		},
		setHalf: function() {
			var $ = this;
			// $.height = $.availableHeight*1/2;
			$.height = body.build.editor.height;
			$.setStructure();
			$.structureState = 'half';
		},
		setThreeQuarters: function() {
			var $ = this;
			// $.height = $.availableHeight*3/4;
			$.height = body.build.editor.height;
			$.setStructure();
			$.structureState = 'threeQuarters';
		},
		setWhole: function() {
			var $ = this;
			// $.height = $.availableHeight;
			$.height = body.build.editor.height;
			$.setStructure();
			$.structureState = 'whole';
		},
	// players
		noteOn: function(index) {
			var $ = this,
				noteNum = index-1+24,
				startTime = $.activeNotesStart[noteNum+''];
			if(startTime) $.activeNotesStart[noteNum+''] = undefined;
			if($.recording)
				$.activeNotesStart[noteNum+''] = tail.sound.context.currentTime;
		},
		noteOff: function(index) {
			var $ = this,
				noteNum = index-1+24,
				startTime = $.activeNotesStart[noteNum+''];
			if(startTime) {
				var endTime = tail.sound.context.currentTime,
					secondsStart = startTime-$.recordStartTime,
					secondsEnd = endTime-$.recordStartTime,
					editor = body.build.editor,
					sPTS = tail.sound.secondsPerThirtySecond,
					mult = editor.mult(),
					left = Math.round(secondsStart/(sPTS*mult))*mult,
					right = Math.round(secondsEnd/(sPTS*mult))*mult,
					top = 84-index,
					total = editor.measureNum*32;
				if(!startTime) return;
				if(left===right) right++;
				if(left<0) left = 0;
				if(total<right) right = total;
				$.recordedNotes.push([left,right,top]);
				startTime = undefined;
			}
		},
	// mouse events
		mouse: function(e,element) {
			var $ = this,
				rect = element.getBoundingClientRect();
			return {
				x: e.clientX-rect.left,
				y: e.clientY-rect.top
			}
		},
		// board
			boardMousedown: function(e) {
				var $ = this,
					mouse = $.mouse(e,$.board);
				if($.focus!=='board') $.focus = 'board';
				$.dragging = true;
				$.boardClickedX = mouse.x-$.keyboardLeft;
				$.boardClickedY = mouse.y;
				var keyIndex = $.findKeyIndex($.boardClickedX,$.boardClickedY);
				$.activeIndexes.push(keyIndex);
				$.noteOn(keyIndex);
				$.draw();
			},
			boardMouseup: function(e) {
				var $ = this,
					mouse = $.mouse(e,$.board),
					keyIndex = $.findKeyIndex($.boardClickedX,$.boardClickedY);
				if(!$.boardClickedX) return;
				$.boardClickedX = $.boardClickedY = undefined;
				$.activeIndexes.splice($.activeIndexes.indexOf(keyIndex),1);
				$.noteOff(keyIndex);
				$.draw();
			},
		// tracker
			trackerMousedown: function(e) {
				var $ = this,
					mouse = $.mouse(e,$.tracker);
				if($.focus!=='tracker') $.focus = 'tracker';
				$.dragging = true;
				if($.insideHighlight(mouse.x)) {
					$.highlightClickedX = mouse.x-$.trackerHighlightLeft;
				} else {
					$.highlightClickedX = $.trackerHighlightWidth/2;
					var leftPercentage = (mouse.x-$.trackerHighlightWidth/2)/$.tracker.width;
					$.set(leftPercentage);
				}
			},
	// keyboard events
		fingerDown: function(e) {
			var $ = body.build.keyboard,
				code = e.keyCode,
				finger = $.fingerMap[code],
				toDraw = false;
			if(finger && !finger.oldIndex) {
				var keyIndex = finger.currentIndex;
				if(keyIndex) {
					finger.oldIndex = keyIndex;
					$.activeIndexes.push(keyIndex);
					if(keyIndex) toDraw = true;
					$.noteOn(keyIndex);
				}
			} else {
				var whiteKeyWidth = $.boardKeyDimensions.whiteKeyWidth;
				if(code===37) { // left arrow
					var toBeLeft = $.keyboardLeft+whiteKeyWidth;
					$.move(toBeLeft);
					toDraw = true;
				} else if(code===39) { // right arrow
					var toBeLeft = $.keyboardLeft-whiteKeyWidth;
					$.move(toBeLeft);
					toDraw = true;
				}
			}
			if(toDraw) $.draw();
		},
		fingerUp: function(e) {
			var $ = body.build.keyboard,
				code = e.keyCode,
				finger = $.fingerMap[code];
			if(!finger || !finger.oldIndex) return;
			$.activeIndexes.splice($.activeIndexes.indexOf(finger.oldIndex),1);
			$.mapFingers();
			$.noteOff(finger.oldIndex);
			finger.oldIndex = undefined;
			$.draw();
		},
	// helpers
		findKeyIndex: function(x,y) { // x relative to keyboard
			var $ = this,
				wW = $.boardKeyDimensions.whiteKeyWidth,
				bW = $.boardKeyDimensions.blackKeyWidth,
				whiteKeyWhiteIndex = Math.floor(x/wW),
				w = whiteKeyWhiteIndex,
				octaves = Math.floor(w/7),
				extraWhites = w%7+1,
				whiteKeyIndex = undefined,
				keyIndex = undefined;
			// find white key index
				var whitesPassed = 0,
					blacksPassed = 0;
				for(var i=0; i<$.typeOrder.length; i++) {
					var type = $.typeOrder[i];
					if(whitesPassed===extraWhites) break;
					if(type===0) whitesPassed += 1;
					if(type===1) blacksPassed += 1;
				}
				whiteKeyIndex = octaves*12+extraWhites+blacksPassed;
			// check for blacks
				function checkLeft() {
					var left = w*wW,
						right = left+wW*2/5;
					if(left<=x && x<=right) {
						keyIndex = whiteKeyIndex-1;
					}
				}
				function checkRight() {
					var left = w*wW+wW*3/5,
						right = left+wW*2/5;
					if(left<=x && x<=right) {
						keyIndex = whiteKeyIndex+1;
					}
				}
				function checkBoth() {
					checkLeft();
					checkRight();
				}
				var e = extraWhites;
				if(e===1) checkRight();
				else if(e===2) checkBoth();
				else if(e===3) checkLeft();
				else if(e===4) checkRight();
				else if(e===5) checkBoth();
				else if(e===6) checkBoth();
				else if(e===7) checkLeft();
			// final checks
				// key index currently only defined if black was found
				var inBlackZone = y<=$.boardHeight/2;
				if(!keyIndex || !inBlackZone) keyIndex = whiteKeyIndex;
			return keyIndex;
		},
		findBottomIndex: function() {
			var $ = this,
				boardLeft = -$.keyboardLeft,
				// boardRight = boardLeft+$.boardWidth,
				offset = $.boardKeyDimensions.whiteKeyWidth*1/3,
				lowestIndex = $.findKeyIndex(boardLeft+offset,0);
				// highestIndex= $.findKeyIndex(boardRight+offset,0);
			$.bottomIndex = lowestIndex;
		},
		mapFingers: function() {
			var $ = this,
				low = $.bottomIndex,
				lowestType = $.findType(low),
				assignments = [],
				binary,
				lastInRange = 0,
				i;
			if(lowestType===0) {
				binary = 0;
				i=1;
				assignments.push(undefined);
			} else {
				binary = 1;
				i=0;
			}
			for(i; i<$.fingerNames.length; i++) {
				var index = low+lastInRange,
					type = $.findType(index);
				if(binary===1 && type===1) {
					assignments.push(index);
					lastInRange += 1;
				} else if(binary===0 && type===0) {
					assignments.push(index);
					lastInRange += 1;
				} else assignments.push(undefined);
				if(binary===1) binary = 0;
				else binary = 1;
			}
			for(var i=0; i<$.fingerNames.length; i++) {
				var finger = $.fingerMap[$.fingerNames[i]];
				finger.currentIndex = assignments[i];
			}
		},
		findType: function(keyIndex) {
			var $ = this;
			return $.typeOrder[(keyIndex-1)%12];
		},
		findFinger: function(keyIndex) {
			var $ = this;
			for(var i=0, finger; i<$.fingerNames.length; i++) {
				var aFinger = $.fingerMap[$.fingerNames[i]];
				if(aFinger.currentIndex===keyIndex) {
					finger = aFinger;
				}
			}
			return finger;
		},
		set: function(leftPercentage) {
			var $ = this,
				toBeLeft = -leftPercentage*$.keyboardWidth,
				toBeRight = toBeLeft;
			$.move(toBeLeft);
		},
		move: function(toBeLeft) {
			var $ = this,
				toBeRight = toBeLeft+$.keyboardWidth;
			// update variables
				if(!(toBeLeft<=0)) toBeLeft = 0;
				else if(!($.boardWidth<=toBeRight))
					toBeLeft = $.boardWidth-$.keyboardWidth;
				$.keyboardLeft = toBeLeft-0.5;
			// update finger map
				$.findBottomIndex();
				$.mapFingers();
			$.draw();
		},
		draw: function() {
			var $ = this;
			// board
				$.board.ctx.clearRect(0,0,$.board.width,$.board.height);
				$.drawRow($.board.ctx,0,$.totalNotes,$.keyboardLeft,$.vertBoardPadding,$.boardKeyDimensions,$.textMode);
			// tracker
				$.tracker.ctx.clearRect(0,0,$.tracker.width,$.tracker.height);
				$.trackerHighlightLeft = (-$.keyboardLeft/$.keyboardWidth)*$.trackerWidth;
				$.drawRow($.tracker.ctx,0,$.totalNotes,0,$.trackerVertPadding,$.trackerKeyDimensions);
				$.drawHighlight();
		},
	// drawers
		drawRow: function(ctx,startIndex,number,left,top,keyDimensions,showText) {
			var $ = this, totalPassed = 0, blacksPassed = 0,
				whitesToDraw = [],
				blacksToDraw = [],
				whiteKeyIndexes = [],
				blackKeyIndexes = [],
				kD = keyDimensions,
				wW = kD.whiteKeyWidth,
				wH = kD.whiteKeyHeight,
				bW = kD.blackKeyWidth,
				bH = kD.blackKeyHeight,
				kR = kD.borderRadius,
				kP = kD.padding;
			for(var i=startIndex; i<startIndex+number; i++) {
				if(i===$.typeOrder.length) {
					var numPassed = $.typeOrder.length-startIndex;
					number -= numPassed;
					startIndex = 0;
					i = 0;
				}
				var type = $.typeOrder[i],
					keyIndex = startIndex+totalPassed+1;
				if(type===0) {
					var assumedLeft = left+totalPassed*wW,
						leftWithBlacks = assumedLeft-blacksPassed*wW;
					whiteKeyIndexes.push(keyIndex);
					whitesToDraw.push(leftWithBlacks);
				} else {
					var assumedLeft = left+totalPassed*wW,
						leftWithBlacks = assumedLeft-blacksPassed*wW,
						adjustedLeft = leftWithBlacks-bW/2;
					blackKeyIndexes.push(keyIndex);
					blacksToDraw.push(adjustedLeft);
					blacksPassed += 1;
				}
				totalPassed += 1;
			}
			for(var i=0; i<whitesToDraw.length; i++) {
				var text,
					keyLeft = whitesToDraw[i],
					keyIndex = whiteKeyIndexes[i],
					finger = $.findFinger(keyIndex),
					invert = 84-keyIndex,
					color, active;
				if(body.build.editor.invertScale.indexOf(invert)===-1)
					color = body.build.editor.colors[invert-Math.floor(invert/12)*12];
				else color = $.inactiveColor;
				if(showText) {
					if($.textMode==='note')
						text = tail.converter.numToNote(keyIndex-1);
					else if(finger) text = finger.symbol;
				}
				if($.activeIndexes.indexOf(keyIndex)===-1) active = false;
				else active = true;
				$.drawWhite(ctx,keyLeft,top,wW,wH,kR,kP,color,active,text);
				text = undefined;
			}
			for(var i=0; i<blacksToDraw.length; i++) {
				var text,
					keyLeft = blacksToDraw[i],
					keyIndex = blackKeyIndexes[i],
					finger = $.findFinger(keyIndex),
					invert = 84-keyIndex,
					color, active;
				if(body.build.editor.invertScale.indexOf(invert)===-1)
					color = body.build.editor.colors[invert-Math.floor(invert/12)*12];
				else color = $.inactiveColor;
				if(showText) {
					if($.textMode==='note')
						text = tail.converter.numToNote(keyIndex-1);
					else if(finger) text = finger.symbol;
				}
				if($.activeIndexes.indexOf(keyIndex)===-1) active = false;
				else active = true;
				$.drawBlack(ctx,keyLeft,top,bW,bH,kR,color,active,text);
				text = undefined;
			}
		},
		drawWhite: function(ctx,left,top,width,height,radius,padding,color,active,text) {
			var $ = this,
				l = left+padding,
				t = top,
				c = radius,
				r = l+width-padding*2,
				b = t+height;
			ctx.beginPath();
			ctx.moveTo(l+c,t);
			ctx.quadraticCurveTo(l,t,l,t+c);
			ctx.lineTo(l,b-c);
			ctx.quadraticCurveTo(l,b,l+c,b);
			ctx.lineTo(r-c,b);
			ctx.quadraticCurveTo(r,b,r,b-c);
			ctx.lineTo(r,t+c);
			ctx.quadraticCurveTo(r,t,r-c,t);
			ctx.closePath();
			if(active) ctx.fillStyle = 'rgb('+(color[0]-$.activeDiff)+','+(color[1]-$.activeDiff)+','+(color[2]-$.activeDiff)+')';
			else ctx.fillStyle = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
			ctx.fill();
			if(text===undefined) return;
			ctx.fillStyle = 'orange';
			var left = l+$.textSize/3,
				top = (t+b)*7/8;
			ctx.fillText(text,left,top);
		},
		drawBlack: function(ctx,left,top,width,height,radius,color,active,text) {
			var $ = this,
				l = left,
				t = top,
				c = radius,
				r = l+width,
				b = t+height;
			ctx.beginPath();
			ctx.moveTo(l+c,t);
			ctx.quadraticCurveTo(l,t,l,t+c);
			ctx.lineTo(l,b-c);
			ctx.quadraticCurveTo(l,b,l+c,b);
			ctx.lineTo(r-c,b);
			ctx.quadraticCurveTo(r,b,r,b-c);
			ctx.lineTo(r,t+c);
			ctx.quadraticCurveTo(r,t,r-c,t);
			ctx.closePath();
			if(active) ctx.fillStyle = 'rgb('+(color[0]-$.activeDiff)+','+(color[1]-$.activeDiff)+','+(color[2]-$.activeDiff)+')';
			else ctx.fillStyle = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
			ctx.fill();
			if(text===undefined) return;
			ctx.fillStyle = 'orange';
			var left = l+$.textSize/3,
				top = (t+b)*4/5;
			ctx.fillText(text,left,top);
		},
	// tracker
		moveByTracker: function(e) {
			var $ = this, mouse = $.mouse(e,$.tracker),
				withHighlight = mouse.x-$.highlightClickedX,
				percentage = withHighlight/$.trackerWidth,
				toBeLeft = -percentage*$.keyboardWidth;
			$.move(toBeLeft);
		},
		insideHighlight: function(x) {
			var $ = this,
				left = $.trackerHighlightLeft,
				width = $.trackerHighlightWidth;
			if(left<=x && x<left+width) return true;
			else return false;
		},
		drawHighlight: function() {
			var $ = this, ctx = $.tracker.ctx;
			ctx.fillStyle = $.antiHighlightColor;
			ctx.fillRect(0,0,$.trackerHighlightLeft,$.tracker.height);
			var rightSideLeft = $.trackerHighlightLeft+$.trackerHighlightWidth;
			ctx.fillRect(rightSideLeft,0,$.tracker.width-rightSideLeft,$.tracker.height);
		},
	// board
		moveByBoard: function(e) {
			var $ = this, mouse = $.mouse(e,$.board),
				mX = mouse.x,
				toBeLeft = mX-$.boardClickedX;
			$.move(toBeLeft);
		},
	setState: function(prefs) {
		var $ = this, details = prefs.details;
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
			if(details.topMode==='editor') $.putOutView();
			else $.putInView();
		// other
			$.textMode = 'finger';
			// $.set(0.4285); // middle C
			$.set(0);
			$.findBottomIndex();
			$.mapFingers();
	},
	init: function(winWidth,winHeight) {
		var $ = this, prefs = body.build.prefs;
		$.setVariables(prefs);
		$.setLayout(winWidth,winHeight);
		$.makeRecordButton();
		$.makeLabelButtons();
		$.setState(prefs);
	}
}