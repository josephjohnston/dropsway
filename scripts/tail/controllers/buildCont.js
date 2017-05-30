'use strict';
tail.controller.build = {
	setVariables: function() {
		var $ = this,
			prefs = tail.storage.preferences.build;
		if(prefs.state==='phrase') $.currentPhrase = prefs.details.initialPhrase;
		else $.currentPhrase = undefined;
	},
	savePhrase: function() {
		var $ = this,
			newShapes = body.build.editor.sendShapes(),
			newData = body.build.controls.sendData();
		// chnage current phrase
			var current = $.currentPhrase;
			current.shapes = newShapes;
			current.instrument = newData.instrument;
			current.key = newData.key;
			current.incrementing = newData.incrementing;
			current.measureNum = newData.measureNum;
		// save storage
			var phrases = tail.storage.phrases.build;
			for(var i=0; i<phrases.length; i++) {
				var phrase = phrases[i];
				if(phrase.id===$.currentPhrase.id) {
					phrase = $.currentPhrase;
					break;
				}
			}
		// do ajax update using $.currentPhrase
		// change elements appropriately
			body.build.selector.changeSelectedItem($.currentPhrase);
	},
	deletePhrase: function() {
		var $ = this, phrases = tail.storage.phrases.build;
		// do ajax delete using $.currentPhrase
		for(var i=0; i<phrases.length; i++) {
			var phrase = phrases[i];
			if(phrase.id===$.currentPhrase.id) {
				phrases.splice(i,1);
				break;
			}
		}
		// flipper
			body.build.flipper.switchToSelector();
			body.build.flipper.toFlip = false;
		body.build.editor.showEmptyPhrase();
		body.build.selector.deleteItem($.currentPhrase);
		$.currentPhrase = undefined;
	},
	newPhrase: function() {
		var $ = this,
			selector = body.build.selector,
			tabOpen =selector.tabOpen,
			topTab = selector.tabs[0],
			tabToAppend = tabOpen ? tabOpen : topTab;
		// do ajax and create new phrase and return id number
		var newPhrase = {
				id: 100,
				author: 1,
				date: 90000000001, 
				instrument: { name: tabToAppend.data.instrument.name, version: 1 }, 
				key: { note: 0, mode: 'M', focus: false },
				incrementing: false,
				measureNum: 1,
				shapes: []
			}
		$.currentPhrase = newPhrase;
		tail.storage.phrases.build.push(newPhrase);
		body.build.flipper.switchToEditor();
		body.build.selector.newItem(newPhrase);
		body.build.editor.newPhrase();
		body.build.controls.resetState(newPhrase);
	},
	selectPhrase: function(phraseId) {
		var $ = this, selectedPhrase, phrases = tail.storage.phrases.build;
		for(var i=0; i<phrases.length; i++) {
			var phrase = phrases[i];
			if(phrase.id===phraseId) {
				selectedPhrase = phrase;
				break;
			}
		}
		$.currentPhrase = selectedPhrase;
		// flipper
			if(body.build.flipper.toFlip===false) body.build.flipper.toFlip = true;
		// editor
			body.build.editor.switchPhrase(selectedPhrase);
		// controls
			body.build.controls.resetState(selectedPhrase);
	},
	playPhrase: function(measureStart) {
		var $ = this,
			shapes = body.build.editor.sendShapes();
		tail.sound.playBuildPhrase(shapes,measureStart);
	},
	init: function() {
		var $ = this;
		$.setVariables();
	}
}