define(["backbone","underscore"],function(t,e){var r=t.Collection.extend({orderList:[],nextPick:0,whereData:function(t){return e.isEmpty(t)?[]:this.filter(function(e){var r=e.get("data")||{};for(var n in t)if(t[n]!==r[n])return!1;return!0})},random:function(){return this.at(Math.floor(Math.random()*this.length)).attributes},exRandom:function(){return this.orderList=this.orderList.length?this.orderList:e.shuffle(e.range(this.length)),this.at(this.orderList.pop()).attributes},bySequence:function(){return this.nextPick<this.length||(this.nextPick=0),this.at(this.nextPick++).attributes},byData:function(t){if(e.isUndefined(t.data))throw console.log(t),new Error("A data property must by defined for byData");var r=e.isString(t.data)?{handle:t.data}:t.data,n=this.whereData(r)[0];if(!n)throw new Error("Inherit by Data failed. Data not found: "+t.data);return n.attributes},inherit:function(t){if(e.isFunction(t.type))return t.type.call(this,t);switch(t.type){case"bySequence":return this.bySequence();case"byData":return this.byData(t);case"exRandom":return this.exRandom();case"random":default:return this.random()}}});return r});
//# sourceMappingURL=set.js.map