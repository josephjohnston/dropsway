tail.storage = {
	phrases: {
		build: undefined,
		browse: undefined
	},
	menuIcons: {
		browse: [0,0,50,50],
		build: [50,0,0,50],
		logout: [50,0,0,50]
	},
	sortOptions: [
		{ name: 'date' },
		{ name: 'hits' },
		{ name: 'author' },
		{ name: 'instrument' },
	],
	preferences: {},
	notes: [
		{ name: 'B' },
		{ name: 'Bb' },
		{ name: 'A' },
		{ name: 'Ab' },
		{ name: 'G' },
		{ name: 'Gb' },
		{ name: 'F' },
		{ name: 'E' },
		{ name: 'Eb' },
		{ name: 'D' },
		{ name: 'Db' },
		{ name: 'C' }
	],
	modes: [
		{ name: 'major' },
		{ name: 'minor' }
	],
	instruments: [
		{
			name: 'cello', 
			icon: {
				regular: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(0,0);
					ctx.lineTo(side,side);
					ctx.stroke();
				},
				hover: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(side,10);
					ctx.lineTo(0,side);
					ctx.stroke();
				},
				active: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(0,side/2);
					ctx.lineTo(side,side/2);
					ctx.stroke();
				}
			},
			versions: [
				[],
				[],
				[]
			] 
		},{ 
			name: 'drums',
			icon: {
				regular: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(0,0);
					ctx.lineTo(side,side);
					ctx.stroke();
				},
				hover: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(side,20);
					ctx.lineTo(0,side);
					ctx.stroke();
				},
				active: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(0,side/2);
					ctx.lineTo(side,side/2);
					ctx.stroke();
				}
			},
			versions: [
				[],
				[],
				[],
				[]
			] 
		},{
			name: 'flute',
			icon: {
				regular: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(0,0);
					ctx.lineTo(side,side);
					ctx.stroke();
				},
				hover: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(side,30);
					ctx.lineTo(0,side);
					ctx.stroke();
				},
				active: function(ctx,side) {
					ctx.clearRect(0,0,side,side);
					ctx.beginPath();
					ctx.moveTo(0,side/2);
					ctx.lineTo(side,side/2);
					ctx.stroke();
				}
			},
			versions: [
				[],
				[],
				[]
			] 
		}
	],
	keyboardLabelButtons: {
		finger: {
			regular: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(width,height);
				ctx.stroke();
			},
			hover: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(width,0);
				ctx.lineTo(0,height);
				ctx.stroke();
			},
			active: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(0,height);
				ctx.lineTo(width/2,0);
				ctx.stroke();
			}
		},
		note: {
			regular: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(width,height);
				ctx.stroke();
			},
			hover: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(width,0);
				ctx.lineTo(0,height);
				ctx.stroke();
			},
			active: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(0,height);
				ctx.lineTo(width/2,0);
				ctx.stroke();
			}
		},
		neither: {
			regular: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(width,height);
				ctx.stroke();
			},
			hover: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(width,0);
				ctx.lineTo(0,height);
				ctx.stroke();
			},
			active: function(ctx,width,height) {
				ctx.beginPath();
				ctx.moveTo(0,height);
				ctx.lineTo(width/2,0);
				ctx.stroke();
			}
		}
	},
	colors: [
		[219,  0,215],
        [  2,219,  0],
        [255,100,  0],
        [ 26,142,255],
        [255,198,  0],
        [138,  0,241],
        [170,255,  0],
        [255,  0,100],
        [  0,199,166],
        [255,153,  0],
        [ 74, 31,255],
        [255,255, 11]
    ],
// instrument stuff
	 //    instrumentTabs: {
	 //    	wave: function(ctx,side) {
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(0,0);
		// 		ctx.lineTo(side,side);
		// 		ctx.stroke();
		// 	},
		// 	filters: function(ctx,side) {
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(0,0);
		// 		ctx.lineTo(side,side);
		// 		ctx.stroke();
	 //    	},
	 //    	envelope: function(ctx,side) {
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(0,0);
		// 		ctx.lineTo(side,side);
		// 		ctx.stroke();
	 //    	},
	 //    	waveshaper: function(ctx,side) {
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(0,0);
		// 		ctx.lineTo(side,side);
		// 		ctx.stroke();
	 //    	}
		// },
		// waveIcons: [
		// 	{
		// 		name: 'sine',
		// 		icon: {
		// 			draw: function(ctx,side) {
		// 				var a = side/4,
		// 					b = side-a;
		// 				ctx.clearRect(0,0,side,side);
		// 				ctx.beginPath();
		// 				ctx.moveTo(a,b);
		// 				ctx.quadraticCurveTo((a+b)/2,-a,b,b);
		// 				ctx.stroke();
		// 			},
		// 			regular: function(ctx,side) {
		// 				ctx.strokeStyle = 'blue';
		// 				this.draw(ctx,side);
		// 			},
		// 			hover: function(ctx,side) {
		// 				ctx.strokeStyle = 'red';
		// 				this.draw(ctx,side);
		// 			},
		// 			active: function(ctx,side) {
		// 				ctx.strokeStyle = 'orange';
		// 				this.draw(ctx,side);
		// 			}
		// 		}
		// 	},{
		// 		name: 'square',
		// 		icon: {
		// 			draw: function(ctx,side) {
		// 				var a = side/4,
		// 					b = side-a;
		// 				ctx.clearRect(0,0,side,side);
		// 				ctx.beginPath();
		// 				ctx.moveTo(a,b);
		// 				ctx.lineTo(a,a);
		// 				ctx.lineTo(b,a);
		// 				ctx.lineTo(b,b);
		// 				ctx.stroke();
		// 			},
		// 			regular: function(ctx,side) {
		// 				ctx.strokeStyle = 'blue';
		// 				this.draw(ctx,side);
		// 			},
		// 			hover: function(ctx,side) {
		// 				ctx.strokeStyle = 'red';
		// 				this.draw(ctx,side);
		// 			},
		// 			active: function(ctx,side) {
		// 				ctx.strokeStyle = 'orange';
		// 				this.draw(ctx,side);
		// 			}
		// 		}
		// 	},{
		// 		name: 'sawtooth',
		// 		icon: {
		// 			draw: function(ctx,side) {
		// 				var a = side/4,
		// 					b = side-a;
		// 				ctx.clearRect(0,0,side,side);
		// 				ctx.beginPath();
		// 				ctx.moveTo(a,b);
		// 				ctx.lineTo(b,a);
		// 				ctx.lineTo(b,b);
		// 				ctx.stroke();
		// 			},
		// 			regular: function(ctx,side) {
		// 				ctx.strokeStyle = 'blue';
		// 				this.draw(ctx,side);
		// 			},
		// 			hover: function(ctx,side) {
		// 				ctx.strokeStyle = 'red';
		// 				this.draw(ctx,side);
		// 			},
		// 			active: function(ctx,side) {
		// 				ctx.strokeStyle = 'orange';
		// 				this.draw(ctx,side);
		// 			}
		// 		}
		// 	},{
		// 		name: 'triangle',
		// 		icon: {
		// 			draw: function(ctx,side) {
		// 				var a = side/4,
		// 					b = side-a;
		// 				ctx.clearRect(0,0,side,side);
		// 				ctx.beginPath();
		// 				ctx.moveTo(a,b);
		// 				ctx.lineTo((a+b)/2,a);
		// 				ctx.lineTo(b,b);
		// 				ctx.stroke();
		// 			},
		// 			regular: function(ctx,side) {
		// 				ctx.strokeStyle = 'blue';
		// 				this.draw(ctx,side);
		// 			},
		// 			hover: function(ctx,side) {
		// 				ctx.strokeStyle = 'red';
		// 				this.draw(ctx,side);
		// 			},
		// 			active: function(ctx,side) {
		// 				ctx.strokeStyle = 'orange';
		// 				this.draw(ctx,side);
		// 			}
		// 		}
		// 	},{
		// 		name: 'custom',
		// 		icon: {
		// 			draw: function(ctx,side) {
		// 				var a = side/4,
		// 					b = side-a;
		// 				ctx.clearRect(0,0,side,side);
		// 				ctx.beginPath();
		// 				ctx.moveTo(a,b);
		// 				ctx.quadraticCurveTo(a,a,b,a);
		// 				ctx.stroke();
		// 			},
		// 			regular: function(ctx,side) {
		// 				ctx.strokeStyle = 'blue';
		// 				this.draw(ctx,side);
		// 			},
		// 			hover: function(ctx,side) {
		// 				ctx.strokeStyle = 'red';
		// 				this.draw(ctx,side);
		// 			},
		// 			active: function(ctx,side) {
		// 				ctx.strokeStyle = 'orange';
		// 				this.draw(ctx,side);
		// 			}
		// 		}
		// 	}
		// ],
		// envelopeTypes: [
		// 	{
		// 		name: 'linear',
		// 		icon: {
		// 			draw: function(ctx,side) {
		// 				var a = side/4,
		// 					b = side-a;
		// 				ctx.clearRect(0,0,side,side);
		// 				ctx.beginPath();
		// 				ctx.moveTo(a,b);
		// 				ctx.lineTo(b,a);
		// 				ctx.stroke();
		// 			},
		// 			regular: function(ctx,side) {
		// 				ctx.strokeStyle = 'blue';
		// 				ctx.lineWidth = 2;
		// 				this.draw(ctx,side);
		// 			},
		// 			hover: function(ctx,side) {
		// 				ctx.strokeStyle = 'red';
		// 				ctx.lineWidth = 2;
		// 				this.draw(ctx,side);
		// 			},
		// 			active: function(ctx,side) {
		// 				ctx.strokeStyle = 'orange';
		// 				ctx.lineWidth = 2;
		// 				this.draw(ctx,side);
		// 			}
		// 		}
		// 	},{
		// 		name: 'exponential',
		// 		icon: {
		// 			draw: function(ctx,side) {
		// 				var a = side/4,
		// 					b = side-a;
		// 				ctx.clearRect(0,0,side,side);
		// 				ctx.beginPath();
		// 				ctx.moveTo(a,b);
		// 				ctx.quadraticCurveTo(b,b,b,a);
		// 				ctx.stroke();
		// 			},
		// 			regular: function(ctx,side) {
		// 				ctx.strokeStyle = 'blue';
		// 				ctx.lineWidth = 2;
		// 				this.draw(ctx,side);
		// 			},
		// 			hover: function(ctx,side) {
		// 				ctx.strokeStyle = 'red';
		// 				ctx.lineWidth = 2;
		// 				this.draw(ctx,side);
		// 			},
		// 			active: function(ctx,side) {
		// 				ctx.strokeStyle = 'orange';
		// 				ctx.lineWidth = 2;
		// 				this.draw(ctx,side);
		// 			}
		// 		}
		// 	}
		// ],
		// filterIcons: {
		// 	highpass: function(ctx,side) {
		// 		var a = side/4,
		// 			b = side-a;
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(a,b);
		// 		ctx.quadraticCurveTo(a,a,b,a);
		// 		ctx.stroke();
		// 	},
		// 	lowshelf: function(ctx,side) {
		// 		var a = side/4,
		// 			b = side-a,
		// 			c = a+(b-a)/2;
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(b,b);
		// 		ctx.quadraticCurveTo(c,b,c,c);
		// 		ctx.quadraticCurveTo(c,a,a,a);
		// 		ctx.stroke();
		// 	},
		// 	bandpass: function(ctx,side) {
		// 		var a = side/4,
		// 			b = side-a,
		// 			c = a+(b-a)/2;
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(a,b);
		// 		ctx.quadraticCurveTo(c,b,c,a);
		// 		ctx.quadraticCurveTo(c,b,b,b);
		// 		ctx.stroke();
		// 	},
		// 	peaking: function(ctx,side) {
		// 		var a = side/4,
		// 			b = side-a,
		// 			c = a+(b-a)/2;
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(a,b);
		// 		ctx.quadraticCurveTo(c,-a,b,b);
		// 		ctx.stroke();
		// 	},
		// 	notch: function(ctx,side) {
		// 		var a = side/4,
		// 			b = side-a,
		// 			c = a+(b-a)/2;
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(a,a);
		// 		ctx.quadraticCurveTo(c,a,c,b);
		// 		ctx.quadraticCurveTo(c,a,b,a);
		// 		ctx.stroke();
		// 	},
		// 	highshelf: function(ctx,side) {
	 //    		var a = side/4,
		// 			b = side-a,
		// 			c = a+(b-a)/2;
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(a,b);
		// 		ctx.quadraticCurveTo(c,b,c,c);
		// 		ctx.quadraticCurveTo(c,a,b,a);
		// 		ctx.stroke();
		// 	},
		// 	lowpass: function(ctx,side) {
	 //    		var a = side/4,
		// 			b = side-a;
		// 		ctx.clearRect(0,0,side,side);
		// 		ctx.beginPath();
		// 		ctx.moveTo(b,b);
		// 		ctx.quadraticCurveTo(b,a,a,a);
		// 		ctx.stroke();
		// 	}
		// },
	init: function() {
		var $ = this;
		$.phrases.build = data.buildPhrases;
		$.preferences.build = {
			state: data.buildPreferences.state,
			details: data.buildPreferences.details
		}
		$.phrases.browse = data.browsePhrases;
		$.preferences.browse = {
			pinnedPhraseIds: data.browsePreferences.pinnedPhraseIds
		}
	}
}

