define(["jquery","app/API","underscore","./msgMan"],function(a,r,e,c){var n={};return a.extend(n,{parcelArray:[],scoreData:{},Init:function(a){var t=r.getLogs();n.parcelArray=[],n.scoreData={};var o=a.AnalyzedVar,l=a.ErrorVar,s=a.parcelVar,u=a.parcelValue,i=a.minRT,v=a.maxRT,d=a.fastRT,h=0,f=0,y=0,g=0,V=parseFloat(a.maxFastTrialsRate);if("undefined"==typeof u||0===u.length){y=0,h=0,f=0,g=0;var A={};A.name="general",A.trialIData=[],e.each(t,function(r){r[o]>=i&&r[o]<=v?(y++,1==r.data[l]&&g++,n.validate(A,r,a)&&h++):r[o]<=d&&f++}),n.checkErrors(y,g,a),n.parcelArray[0]=A}else e.each(u,function(r,c){y=0,h=0,f=0,g=0;var u={};u.name=r,u.trialIData=[],e.each(t,function(e){var c=e.data[s];c==r&&(e[o]>=i&&e[o]<=v?(y++,1==e.data[l]&&g++,n.validate(u,e,a)&&h++):e[o]<=d&&f++)}),n.checkErrors(y,g,a),n.parcelArray[c]=u});f/h>V&&(n.scoreData.errorMessage=c.getMessage("tooFast"))},checkErrors:function(a,r,e){var t=e.maxErrorParcelRate;r/a>t&&(n.scoreData.errorMessage=c.getMessage("manyErrors"))},validate:function(a,r,e){var c=e.errorLatency,n=e.ErrorVar,t=r.data;return"latency"==c.use?(a.trialIData.push(r),!0):"false"==c.use?"1"==t[n]?!1:(a.trialIData.push(r),!0):"penalty"==c.use?(a.trialIData.push(r),!0):void 0},addPenalty:function(a,r){var c=r.errorLatency;if("penalty"==c.use){var t=parseFloat(c.penalty),o=r.ErrorVar,l=r.AnalyzedVar,s=r.condVar,u=r.cond1VarValues,i=r.cond2VarValues,v=a.trialIData,d=a.avgCon1,h=a.avgCon2;e.each(v,function(a){var r=a.data,e=r[o],c=r[s],v=n.checkArray(c,u),f=n.checkArray(c,i);"1"==e&&(v?a[l]+=d+t:f&&(a[l]+=h+t))})}},avgAll:function(a){e.each(n.parcelArray,function(r){n.avgParcel(r,a)})},avgParcel:function(a,r){var t=a.trialIData,o=r.condVar,l=r.cond1VarValues,s=r.cond2VarValues,u=r.AnalyzedVar,i=0,v=0,d=0,h=0,f=0,y=0;e.each(t,function(a){var r=a[u],e=a.data;d+=r,y++;var c=e[o],t=n.checkArray(c,l),g=n.checkArray(c,s);t?(h++,i+=r):g&&(f++,v+=r)}),(2>=h||2>=f)&&(n.scoreData.errorMessage=c.getMessage("notEnough")),0!==h&&(i/=h),0!==f&&(v/=f),a.avgCon1=i,a.avgCon2=v,a.diff=a.avgCon1-a.avgCon2,0!==y&&(a.avgBoth=d/y),n.addPenalty(a,r)},checkArray:function(a,r){for(var e=0;e<r.length;e++){var c=r[e];if(c==a)return!0}return!1},varianceAll:function(a){e.each(n.parcelArray,function(r){n.varianceParcel(r,a)})},varianceParcel:function(a,r){var c=r.AnalyzedVar,t=a.trialIData,o=r.cond1VarValues,l=r.cond2VarValues,s=r.condVar,u=a.avgBoth,i=0,v=0,d=[],h=[],f=[],y=r.errorLatency,g=y.useForSTD;e.each(t,function(a){var e=a.data,t=a[c],u=r.ErrorVar,i=e[u],v=e[s],f=n.checkArray(v,o),y=n.checkArray(v,l);f?g?d.push(t):"0"==i&&d.push(t):y&&(g?h.push(t):"0"==i&&d.push(t))}),f=d.concat(h),e.each(f,function(a){var r=a;i=r-u,v+=i*i}),a.variance=v/(f.length-1)},scoreAll:function(a){var r=0;e.each(n.parcelArray,function(e){n.scoreParcel(e,a),r+=e.score});var c=r/n.parcelArray.length;n.scoreData.score=c.toFixed(2)},scoreParcel:function(a){var r=Math.sqrt(a.variance);0===r?(n.scoreData.errorMessage=c.getMessage("notEnough"),a.score=a.diff):a.score=a.diff/r},simulateOldCode:function(a){var r=[],c=[2,3,5,6],t=a.cond1VarValues,o=a.cond2VarValues,l=a.condVar,s=a.ErrorVar,u=a.AnalyzedVar,i=n.parcelArray[0],v=n.parcelArray[1],d=i.trialIData,h=v.trialIData;e.each(d,function(a){var e=a.data,i=e[l],v=n.checkArray(i,t),d=n.checkArray(i,o),h={};v?(h.block=c[0],h.lat=a[u],h.err=e[s]):d&&(h.block=c[2],h.lat=a[u],h.err=e[s]),r.push(h)}),e.each(h,function(a){var e=a.data,i=e[l],v=n.checkArray(i,t),d=n.checkArray(i,o),h={};v?(h.block=c[1],h.lat=a[u],h.err=e[s]):d&&(h.block=c[3],h.lat=a[u],h.err=e[s]),r.push(h)});var f=n.scoreTask(r,c);return f}}),n});
//# sourceMappingURL=parcelMng.js.map