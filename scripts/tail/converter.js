'use strict';
tail.converter = {
	noteLetts: ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'],
	noteLettToNum: function(noteLett) {
		var $ = this;
		return $.noteLetts.indexOf(noteLett);
	},
	noteNumToLett: function(noteNum) {
		var $ = this;
		return $.noteLetts[noteNum];
	},
	numToFreq: function(num) {
		var $ = this,
			semitones = num-24,
			freq = tail.sound.c1*Math.pow(tail.sound.k,semitones);
		return freq;
	},
	numToNote: function(num) {
		var $ = this;
		return $.noteLetts[num%12];
	},
	modeWordToLett: function(modeWord) {
		if(modeWord==='major') return 'M';
		else return 'm';
	},
	modeLettToWord: function(modeLett) {
		if(modeLett==='M') return 'major';
		else return 'minor';
	}
}