(function(){var t,e=this,i=e.Backbone,s=[],n=s.push,r=s.slice,a=s.splice;t="undefined"!=typeof exports?exports:e.Backbone={},t.VERSION="1.0.0";var o=e._;o||"undefined"==typeof require||(o=require("underscore")),t.$=e.jQuery||e.Zepto||e.ender||e.$,t.noConflict=function(){return e.Backbone=i,this},t.emulateHTTP=!1,t.emulateJSON=!1;var h=t.Events={on:function(t,e,i){if(!c(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var s=this._events[t]||(this._events[t]=[]);return s.push({callback:e,context:i,ctx:i||this}),this},once:function(t,e,i){if(!c(this,"once",t,[e,i])||!e)return this;var s=this,n=o.once(function(){s.off(t,n),e.apply(this,arguments)});return n._callback=e,this.on(t,n,i)},off:function(t,e,i){var s,n,r,a,h,u,l,d;if(!this._events||!c(this,"off",t,[e,i]))return this;if(!t&&!e&&!i)return this._events={},this;for(a=t?[t]:o.keys(this._events),h=0,u=a.length;u>h;h++)if(t=a[h],r=this._events[t]){if(this._events[t]=s=[],e||i)for(l=0,d=r.length;d>l;l++)n=r[l],(e&&e!==n.callback&&e!==n.callback._callback||i&&i!==n.context)&&s.push(n);s.length||delete this._events[t]}return this},trigger:function(t){if(!this._events)return this;var e=r.call(arguments,1);if(!c(this,"trigger",t,e))return this;var i=this._events[t],s=this._events.all;return i&&l(i,e),s&&l(s,arguments),this},stopListening:function(t,e,i){var s=this._listeners;if(!s)return this;var n=!e&&!i;"object"==typeof e&&(i=this),t&&((s={})[t._listenerId]=t);for(var r in s)s[r].off(e,i,this),n&&delete this._listeners[r];return this}},u=/\s+/,c=function(t,e,i,s){if(!i)return!0;if("object"==typeof i){for(var n in i)t[e].apply(t,[n,i[n]].concat(s));return!1}if(u.test(i)){for(var r=i.split(u),a=0,o=r.length;o>a;a++)t[e].apply(t,[r[a]].concat(s));return!1}return!0},l=function(t,e){var i,s=-1,n=t.length,r=e[0],a=e[1],o=e[2];switch(e.length){case 0:for(;++s<n;)(i=t[s]).callback.call(i.ctx);return;case 1:for(;++s<n;)(i=t[s]).callback.call(i.ctx,r);return;case 2:for(;++s<n;)(i=t[s]).callback.call(i.ctx,r,a);return;case 3:for(;++s<n;)(i=t[s]).callback.call(i.ctx,r,a,o);return;default:for(;++s<n;)(i=t[s]).callback.apply(i.ctx,e)}},d={listenTo:"on",listenToOnce:"once"};o.each(d,function(t,e){h[e]=function(e,i,s){var n=this._listeners||(this._listeners={}),r=e._listenerId||(e._listenerId=o.uniqueId("l"));return n[r]=e,"object"==typeof i&&(s=this),e[t](i,s,this),this}}),h.bind=h.on,h.unbind=h.off,o.extend(t,h);var f=t.Model=function(t,e){var i,s=t||{};e||(e={}),this.cid=o.uniqueId("c"),this.attributes={},o.extend(this,o.pick(e,p)),e.parse&&(s=this.parse(s,e)||{}),(i=o.result(this,"defaults"))&&(s=o.defaults({},s,i)),this.set(s,e),this.changed={},this.initialize.apply(this,arguments)},p=["url","urlRoot","collection"];o.extend(f.prototype,h,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(){return o.clone(this.attributes)},sync:function(){return t.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return o.escape(this.get(t))},has:function(t){return null!=this.get(t)},set:function(t,e,i){var s,n,r,a,h,u,c,l;if(null==t)return this;if("object"==typeof t?(n=t,i=e):(n={})[t]=e,i||(i={}),!this._validate(n,i))return!1;r=i.unset,h=i.silent,a=[],u=this._changing,this._changing=!0,u||(this._previousAttributes=o.clone(this.attributes),this.changed={}),l=this.attributes,c=this._previousAttributes,this.idAttribute in n&&(this.id=n[this.idAttribute]);for(s in n)e=n[s],o.isEqual(l[s],e)||a.push(s),o.isEqual(c[s],e)?delete this.changed[s]:this.changed[s]=e,r?delete l[s]:l[s]=e;if(!h){a.length&&(this._pending=!0);for(var d=0,f=a.length;f>d;d++)this.trigger("change:"+a[d],this,l[a[d]],i)}if(u)return this;if(!h)for(;this._pending;)this._pending=!1,this.trigger("change",this,i);return this._pending=!1,this._changing=!1,this},unset:function(t,e){return this.set(t,void 0,o.extend({},e,{unset:!0}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,o.extend({},t,{unset:!0}))},hasChanged:function(t){return null==t?!o.isEmpty(this.changed):o.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?o.clone(this.changed):!1;var e,i=!1,s=this._changing?this._previousAttributes:this.attributes;for(var n in t)o.isEqual(s[n],e=t[n])||((i||(i={}))[n]=e);return i},previous:function(t){return null!=t&&this._previousAttributes?this._previousAttributes[t]:null},previousAttributes:function(){return o.clone(this._previousAttributes)},fetch:function(t){t=t?o.clone(t):{},void 0===t.parse&&(t.parse=!0);var e=this,i=t.success;return t.success=function(s){return e.set(e.parse(s,t),t)?(i&&i(e,s,t),void e.trigger("sync",e,s,t)):!1},R(this,t),this.sync("read",this,t)},save:function(t,e,i){var s,n,r,a=this.attributes;if(null==t||"object"==typeof t?(s=t,i=e):(s={})[t]=e,!(!s||i&&i.wait||this.set(s,i)))return!1;if(i=o.extend({validate:!0},i),!this._validate(s,i))return!1;s&&i.wait&&(this.attributes=o.extend({},a,s)),void 0===i.parse&&(i.parse=!0);var h=this,u=i.success;return i.success=function(t){h.attributes=a;var e=h.parse(t,i);return i.wait&&(e=o.extend(s||{},e)),o.isObject(e)&&!h.set(e,i)?!1:(u&&u(h,t,i),void h.trigger("sync",h,t,i))},R(this,i),n=this.isNew()?"create":i.patch?"patch":"update","patch"===n&&(i.attrs=s),r=this.sync(n,this,i),s&&i.wait&&(this.attributes=a),r},destroy:function(t){t=t?o.clone(t):{};var e=this,i=t.success,s=function(){e.trigger("destroy",e,e.collection,t)};if(t.success=function(n){(t.wait||e.isNew())&&s(),i&&i(e,n,t),e.isNew()||e.trigger("sync",e,n,t)},this.isNew())return t.success(),!1;R(this,t);var n=this.sync("delete",this,t);return t.wait||s(),n},url:function(){var t=o.result(this,"urlRoot")||o.result(this.collection,"url")||U();return this.isNew()?t:t+("/"===t.charAt(t.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(t){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},isValid:function(t){return this._validate({},o.extend(t||{},{validate:!0}))},_validate:function(t,e){if(!e.validate||!this.validate)return!0;t=o.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;return i?(this.trigger("invalid",this,i,o.extend(e||{},{validationError:i})),!1):!0}});var g=["keys","values","pairs","invert","pick","omit"];o.each(g,function(t){f.prototype[t]=function(){var e=r.call(arguments);return e.unshift(this.attributes),o[t].apply(o,e)}});var v=t.Collection=function(t,e){e||(e={}),e.url&&(this.url=e.url),e.model&&(this.model=e.model),void 0!==e.comparator&&(this.comparator=e.comparator),this._reset(),this.initialize.apply(this,arguments),t&&this.reset(t,o.extend({silent:!0},e))},m={add:!0,remove:!0,merge:!0},y={add:!0,merge:!1,remove:!1};o.extend(v.prototype,h,{model:f,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return t.sync.apply(this,arguments)},add:function(t,e){return this.set(t,o.defaults(e||{},y))},remove:function(t,e){t=o.isArray(t)?t.slice():[t],e||(e={});var i,s,n,r;for(i=0,s=t.length;s>i;i++)r=this.get(t[i]),r&&(delete this._byId[r.id],delete this._byId[r.cid],n=this.indexOf(r),this.models.splice(n,1),this.length--,e.silent||(e.index=n,r.trigger("remove",r,this,e)),this._removeReference(r));return this},set:function(t,e){e=o.defaults(e||{},m),e.parse&&(t=this.parse(t,e)),o.isArray(t)||(t=t?[t]:[]);var i,s,r,h,u,c=e.at,l=this.comparator&&null==c&&e.sort!==!1,d=o.isString(this.comparator)?this.comparator:null,f=[],p=[],g={};for(i=0,s=t.length;s>i;i++)(r=this._prepareModel(t[i],e))&&((h=this.get(r))?(e.remove&&(g[h.cid]=!0),e.merge&&(h.set(r.attributes,e),l&&!u&&h.hasChanged(d)&&(u=!0))):e.add&&(f.push(r),r.on("all",this._onModelEvent,this),this._byId[r.cid]=r,null!=r.id&&(this._byId[r.id]=r)));if(e.remove){for(i=0,s=this.length;s>i;++i)g[(r=this.models[i]).cid]||p.push(r);p.length&&this.remove(p,e)}if(f.length&&(l&&(u=!0),this.length+=f.length,null!=c?a.apply(this.models,[c,0].concat(f)):n.apply(this.models,f)),u&&this.sort({silent:!0}),e.silent)return this;for(i=0,s=f.length;s>i;i++)(r=f[i]).trigger("add",r,this,e);return u&&this.trigger("sort",this,e),this},reset:function(t,e){e||(e={});for(var i=0,s=this.models.length;s>i;i++)this._removeReference(this.models[i]);return e.previousModels=this.models,this._reset(),this.add(t,o.extend({silent:!0},e)),e.silent||this.trigger("reset",this,e),this},push:function(t,e){return t=this._prepareModel(t,e),this.add(t,o.extend({at:this.length},e)),t},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t),e},unshift:function(t,e){return t=this._prepareModel(t,e),this.add(t,o.extend({at:0},e)),t},shift:function(t){var e=this.at(0);return this.remove(e,t),e},slice:function(t,e){return this.models.slice(t,e)},get:function(t){return null==t?void 0:this._byId[null!=t.id?t.id:t.cid||t]},at:function(t){return this.models[t]},where:function(t,e){return o.isEmpty(t)?e?void 0:[]:this[e?"find":"filter"](function(e){for(var i in t)if(t[i]!==e.get(i))return!1;return!0})},findWhere:function(t){return this.where(t,!0)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");return t||(t={}),o.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(o.bind(this.comparator,this)),t.silent||this.trigger("sort",this,t),this},sortedIndex:function(t,e,i){e||(e=this.comparator);var s=o.isFunction(e)?e:function(t){return t.get(e)};return o.sortedIndex(this.models,t,s,i)},pluck:function(t){return o.invoke(this.models,"get",t)},fetch:function(t){t=t?o.clone(t):{},void 0===t.parse&&(t.parse=!0);var e=t.success,i=this;return t.success=function(s){var n=t.reset?"reset":"set";i[n](s,t),e&&e(i,s,t),i.trigger("sync",i,s,t)},R(this,t),this.sync("read",this,t)},create:function(t,e){if(e=e?o.clone(e):{},!(t=this._prepareModel(t,e)))return!1;e.wait||this.add(t,e);var i=this,s=e.success;return e.success=function(n){e.wait&&i.add(t,e),s&&s(t,n,e)},t.save(null,e),t},parse:function(t){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(t,e){if(t instanceof f)return t.collection||(t.collection=this),t;e||(e={}),e.collection=this;var i=new this.model(t,e);return i._validate(t,e)?i:(this.trigger("invalid",this,t,e),!1)},_removeReference:function(t){this===t.collection&&delete t.collection,t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,s){("add"!==t&&"remove"!==t||i===this)&&("destroy"===t&&this.remove(e,s),e&&t==="change:"+e.idAttribute&&(delete this._byId[e.previous(e.idAttribute)],null!=e.id&&(this._byId[e.id]=e)),this.trigger.apply(this,arguments))}});var _=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","indexOf","shuffle","lastIndexOf","isEmpty","chain"];o.each(_,function(t){v.prototype[t]=function(){var e=r.call(arguments);return e.unshift(this.models),o[t].apply(o,e)}});var b=["groupBy","countBy","sortBy"];o.each(b,function(t){v.prototype[t]=function(e,i){var s=o.isFunction(e)?e:function(t){return t.get(e)};return o[t](this.models,s,i)}});var w=t.View=function(t){this.cid=o.uniqueId("view"),this._configure(t||{}),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},x=/^(\S+)\s*(.*)$/,E=["model","collection","el","id","attributes","className","tagName","events"];o.extend(w.prototype,h,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this.stopListening(),this},setElement:function(e,i){return this.$el&&this.undelegateEvents(),this.$el=e instanceof t.$?e:t.$(e),this.el=this.$el[0],i!==!1&&this.delegateEvents(),this},delegateEvents:function(t){if(!t&&!(t=o.result(this,"events")))return this;this.undelegateEvents();for(var e in t){var i=t[e];if(o.isFunction(i)||(i=this[t[e]]),i){var s=e.match(x),n=s[1],r=s[2];i=o.bind(i,this),n+=".delegateEvents"+this.cid,""===r?this.$el.on(n,i):this.$el.on(n,r,i)}}return this},undelegateEvents:function(){return this.$el.off(".delegateEvents"+this.cid),this},_configure:function(t){this.options&&(t=o.extend({},o.result(this,"options"),t)),o.extend(this,o.pick(t,E)),this.options=t},_ensureElement:function(){if(this.el)this.setElement(o.result(this,"el"),!1);else{var e=o.extend({},o.result(this,"attributes"));this.id&&(e.id=o.result(this,"id")),this.className&&(e["class"]=o.result(this,"className"));var i=t.$("<"+o.result(this,"tagName")+">").attr(e);this.setElement(i,!1)}}}),t.sync=function(e,i,s){var n=k[e];o.defaults(s||(s={}),{emulateHTTP:t.emulateHTTP,emulateJSON:t.emulateJSON});var r={type:n,dataType:"json"};if(s.url||(r.url=o.result(i,"url")||U()),null!=s.data||!i||"create"!==e&&"update"!==e&&"patch"!==e||(r.contentType="application/json",r.data=JSON.stringify(s.attrs||i.toJSON(s))),s.emulateJSON&&(r.contentType="application/x-www-form-urlencoded",r.data=r.data?{model:r.data}:{}),s.emulateHTTP&&("PUT"===n||"DELETE"===n||"PATCH"===n)){r.type="POST",s.emulateJSON&&(r.data._method=n);var a=s.beforeSend;s.beforeSend=function(t){return t.setRequestHeader("X-HTTP-Method-Override",n),a?a.apply(this,arguments):void 0}}"GET"===r.type||s.emulateJSON||(r.processData=!1),"PATCH"!==r.type||!window.ActiveXObject||window.external&&window.external.msActiveXFilteringEnabled||(r.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")});var h=s.xhr=t.ajax(o.extend(r,s));return i.trigger("request",i,h,s),h};var k={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};t.ajax=function(){return t.$.ajax.apply(t.$,arguments)};var S=t.Router=function(t){t||(t={}),t.routes&&(this.routes=t.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},$=/\((.*?)\)/g,T=/(\(\?)?:\w+/g,H=/\*\w+/g,A=/[\-{}\[\]+?.,\\\^$|#\s]/g;o.extend(S.prototype,h,{initialize:function(){},route:function(e,i,s){o.isRegExp(e)||(e=this._routeToRegExp(e)),o.isFunction(i)&&(s=i,i=""),s||(s=this[i]);var n=this;return t.history.route(e,function(r){var a=n._extractParameters(e,r);s&&s.apply(n,a),n.trigger.apply(n,["route:"+i].concat(a)),n.trigger("route",i,a),t.history.trigger("route",n,i,a)}),this},navigate:function(e,i){return t.history.navigate(e,i),this},_bindRoutes:function(){if(this.routes){this.routes=o.result(this,"routes");for(var t,e=o.keys(this.routes);null!=(t=e.pop());)this.route(t,this.routes[t])}},_routeToRegExp:function(t){return t=t.replace(A,"\\$&").replace($,"(?:$1)?").replace(T,function(t,e){return e?t:"([^/]+)"}).replace(H,"(.*?)"),new RegExp("^"+t+"$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return o.map(i,function(t){return t?decodeURIComponent(t):null})}});var I=t.History=function(){this.handlers=[],o.bindAll(this,"checkUrl"),"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},N=/^[#\/]|\s+$/g,P=/^\/+|\/+$/g,O=/msie [\w.]+/,C=/\/$/;I.started=!1,o.extend(I.prototype,h,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(null==t)if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(C,"");t.indexOf(i)||(t=t.substr(i.length))}else t=this.getHash();return t.replace(N,"")},start:function(e){if(I.started)throw new Error("Backbone.history has already been started");I.started=!0,this.options=o.extend({},{root:"/"},this.options,e),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var i=this.getFragment(),s=document.documentMode,n=O.exec(navigator.userAgent.toLowerCase())&&(!s||7>=s);this.root=("/"+this.root+"/").replace(P,"/"),n&&this._wantsHashChange&&(this.iframe=t.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(i)),this._hasPushState?t.$(window).on("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!n?t.$(window).on("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=i;var r=this.location,a=r.pathname.replace(/[^\/]$/,"$&/")===this.root;return this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!a?(this.fragment=this.getFragment(null,!0),this.location.replace(this.root+this.location.search+"#"+this.fragment),!0):(this._wantsPushState&&this._hasPushState&&a&&r.hash&&(this.fragment=this.getHash().replace(N,""),this.history.replaceState({},document.title,this.root+this.fragment+r.search)),this.options.silent?void 0:this.loadUrl())},stop:function(){t.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl),clearInterval(this._checkUrlInterval),I.started=!1},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(){var t=this.getFragment();return t===this.fragment&&this.iframe&&(t=this.getFragment(this.getHash(this.iframe))),t===this.fragment?!1:(this.iframe&&this.navigate(t),void(this.loadUrl()||this.loadUrl(this.getHash())))},loadUrl:function(t){var e=this.fragment=this.getFragment(t),i=o.any(this.handlers,function(t){return t.route.test(e)?(t.callback(e),!0):void 0});return i},navigate:function(t,e){if(!I.started)return!1;if(e&&e!==!0||(e={trigger:e}),t=this.getFragment(t||""),this.fragment!==t){this.fragment=t;var i=this.root+t;if(this._hasPushState)this.history[e.replace?"replaceState":"pushState"]({},document.title,i);else{if(!this._wantsHashChange)return this.location.assign(i);this._updateHash(this.location,t,e.replace),this.iframe&&t!==this.getFragment(this.getHash(this.iframe))&&(e.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,t,e.replace))}e.trigger&&this.loadUrl(t)}},_updateHash:function(t,e,i){if(i){var s=t.href.replace(/(javascript:|#).*$/,"");t.replace(s+"#"+e)}else t.hash="#"+e}}),t.history=new I;var j=function(t,e){var i,s=this;i=t&&o.has(t,"constructor")?t.constructor:function(){return s.apply(this,arguments)},o.extend(i,s,e);var n=function(){this.constructor=i};return n.prototype=s.prototype,i.prototype=new n,t&&o.extend(i.prototype,t),i.__super__=s.prototype,i};f.extend=v.extend=S.extend=w.extend=I.extend=j;var U=function(){throw new Error('A "url" property or function must be specified')},R=function(t,e){var i=e.error;e.error=function(s){i&&i(t,s,e),t.trigger("error",t,s,e)}}}).call(this);
//# sourceMappingURL=backbone.js.map