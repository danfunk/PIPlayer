require.config({waitSeconds:200,enforceDefine:!0,baseUrl:"js",paths:{text:["//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text.min","libs/text"],jquery:["//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min","libs/jquery"],underscore:["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.1.0/lodash.min","libs/lodash"],backbone:["//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min","libs/backbone"],JSON:"libs/json2"},shim:{JSON:{exports:"JSON"},backbone:{deps:["underscore","jquery"],exports:"Backbone"}},deps:["jquery","JSON","backbone","underscore"]}),define({});
//# sourceMappingURL=config.js.map