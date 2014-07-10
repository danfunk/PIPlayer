define(["underscore","app/task/script","./current_trial"],function(e,r,a){return function(t,o){var n=r.global,l=a();if(!t)throw new Error("There is an interaction without conditions!!");t=e.isArray(t)?t:[t],o=o||{};var i=!0;if("begin"==o.type){var u=e.reduce(t,function(e,r){return e||"begin"==r.type},!1);if(!u)return!1}return e.each(t,function(r){var a,t,u=!0;switch(r.type){case"begin":"begin"!==o.type&&(u=!1);break;case"inputEquals":e.isArray(r.value)||(r.value=[r.value]),-1===e.indexOf(r.value,o.handle)&&(u=!1);break;case"inputEqualsTrial":o.handle!==l.data[r.property]&&(u=!1);break;case"inputEqualsStim":a={},r.handle&&(a.handle=r.handle),a[r.property]=o.handle,t=l._stimulus_collection.whereData(a),0===t.length&&(u=!1);break;case"inputEqualsGlobal":if("undefined"==typeof r.property)throw new Error('inputEqualsGlobal requires both "property" to be defined');o.handle!==n[r.property]&&(u=!1);break;case"trialEquals":if("undefined"==typeof r.property||"undefined"==typeof r.value)throw new Error('trialEquals requires both "property" and "value" to be defined');r.value!==l.data[r.property]&&(u=!1);break;case"globalEquals":if("undefined"==typeof r.property||"undefined"==typeof r.value)throw new Error('globalEquals requires both "property" and "value" to be defined');r.value!==n[r.property]&&(u=!1);break;case"globalEqualsTrial":if("undefined"==typeof r.globalProp||"undefined"==typeof r.trialProp)throw new Error('globalEqualsTrial requires both "globalProp" and "trialProp" to be defined');n[r.globalProp]!==l.data[r.trialProp]&&(u=!1);break;case"globalEqualsStim":if("undefined"==typeof r.globalProp||"undefined"==typeof r.stimProp)throw new Error('globalEqualsStim requires both "globalProp" and "stimProp" to be defined');a={},r.handle&&(a.handle=r.handle),a[r.stimProp]=n[r.globalProp],t=l._stimulus_collection.whereData(a),0===t.length&&(u=!1);break;case"function":r.value.apply(l,[l,o])||(u=!1);break;default:throw new Error("Unknown condition type: "+r.type)}i=i&&(r.negate?!u:u)}),i}});
//# sourceMappingURL=evaluate.js.map