/*
 * this file is resposible for taking the experiment script (json) and parsing it
 */

define(['require','app/task/script','../trial/trial_sets','../stimulus/stimulus_sets','../media/media_sets','../sequencer/sourceSequence','utils/mixer','../sequencer/sequencePreload'],function(require){
	// load dependancies
	var script = require('app/task/script');
	var trialSets = require('../trial/trial_sets');
	var stimulusSets = require('../stimulus/stimulus_sets');
	var mediaSets = require('../media/media_sets');
	var sequence = require('../sequencer/sourceSequence');
	var mix = require('utils/mixer');
	var preload = require('../sequencer/sequencePreload');

	return function(){
		// load component sets
		if (script.trialSets) {
			trialSets(script.trialSets);
		}
		if (script.stimulusSets) {
			stimulusSets(script.stimulusSets);
		}
		if (script.mediaSets) {
			mediaSets(script.mediaSets);
		}

		// load sequence
		sequence.add(mix(script.sequence));

		// preload and return deferred
		return preload(script);
	};
});
