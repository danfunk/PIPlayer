define(["jquery","./media_view","../inflator","utils/html","app/task/build_url","app/task/script"],function(e,t,a,i,r,l){return function(n,m){var o=l.global;if("string"==typeof n&&(n={word:n}),!n)throw new Error("Media object not defined for "+m.name());var d=a(n,"media");return d.template&&(d.template=r(d.template,"template")),d.image&&(d.image=r(d.image,"image")),d.source=e.extend({},d),d.model=m,i(d,{global:o,trialData:m.trial.data,stimulusData:m.get("data")}),new t(d)}});
//# sourceMappingURL=media_constructor.js.map