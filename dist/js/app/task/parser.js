define(["require","app/task/script","../trial/trial_sets","../stimulus/stimulus_sets","../media/media_sets","../sequencer/sourceSequence","utils/mixer","../sequencer/sequencePreload"],function(e){var s=e("app/task/script"),t=e("../trial/trial_sets"),u=e("../stimulus/stimulus_sets"),i=e("../media/media_sets"),r=e("../sequencer/sourceSequence"),a=e("utils/mixer"),l=e("../sequencer/sequencePreload");return function(){return s.trialSets&&t(s.trialSets),s.stimulusSets&&u(s.stimulusSets),s.mediaSets&&i(s.mediaSets),r.add(a(s.sequence)),l(s)}});
//# sourceMappingURL=parser.js.map