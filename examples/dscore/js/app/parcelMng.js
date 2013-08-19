define(['jquery','app/API','underscore','./computeD'],function($,API,_,compute){


	var parcelMng= {};


	$.extend(parcelMng, {

		parcelArray: [],

		Init: function(){

			var data = API.getLogs();
			var AnalyzedVar = compute.AnalyzedVar;
			var parcelVar = compute.parcelVar;
			var parcels = compute.parcelValue;
			var min = compute.minRT;
			var max = compute.maxRT;
			var fastRT= compute.fastRT;
			var totalScoredTrials = 0;
			var trialsUnder = 0;
			var maxFastTrialsRate = parseFloat(compute.maxFastTrialsRate);


			if (typeof parcels == 'undefined' || parcels.length == 0) {
				var p = {};
				p.name = 'general';
				p.trialIData = [];
				_.each (data, function (value,index) {// per object in logger
						if (value[AnalyzedVar]>=min && value[AnalyzedVar]<=max){
							//p.trialIData.push(value);//push all data
							//totalScoredTrials++;
							if (parcelMng.validate(p,value)) totalScoredTrials++;

						}else {
							if (value[AnalyzedVar]<= fastRT) trialsUnder++;
						}
				});
				parcelMng.parcelArray[0] = p;
			}else{

				_.each (parcels, function(parcelName,index) {// per parcel from parcelValue
					var p = {};
					p.name = parcelName;
					p.trialIData = [];
					_.each (data, function (value,index) {// per object in logger
						var trialParcelName = value.data[parcelVar];
						if (trialParcelName == parcelName){
							if (value[AnalyzedVar]>=min && value[AnalyzedVar]<=max){
								//p.trialIData.push(value);//push all data
								//totalScoredTrials++;
								if (parcelMng.validate(p,value)) totalScoredTrials++;


							}else {
								if (value[AnalyzedVar]<= fastRT) trialsUnder++;
							}

						}

					});
					parcelMng.parcelArray[index] = p;
				});
			}
			if ( (trialsUnder/totalScoredTrials) > maxFastTrialsRate)
				return "Too many fast trials";
			console.log('finished init the parcelArray is:');
			console.log(parcelMng.parcelArray);
			console.log('--------------------');
		},

		validate: function(p,value){
			var errorLatency = compute.errorLatency;
			var error = compute.ErrorVar;
			var data = value.data;


			if (errorLatency.use =='latency'){
				p.trialIData.push(value);
				return true;
			}else{
				if (errorLatency.use =='false'){
					if(data[error]=='1'){
						return false;
					}else{
						p.trialIData.push(value);
						return true;
					}
				}
				if(errorLatency.use =='penalty'){
					p.trialIData.push(value);
					return true;
				}
			}


		},
		addPenalty: function(p){
			var errorLatency = compute.errorLatency;


			if (errorLatency.use == 'penalty'){
				var penalty = parseFloat(errorLatency.penalty);
				var ErrorVar = compute.ErrorVar;
				var AnalyzedVar = compute.AnalyzedVar;
				var condVar = compute.condVar;
				var cond1 = compute.cond1VarValues;
				var cond2 = compute.cond2VarValues;
				var trialIData = p.trialIData;
				var avg1 = p.avgCon1;
				var avg2 = p.avgCon2;


				_.each (trialIData, function (value,index) {
					var data = value.data;
					var error = data[ErrorVar];
					var diff1 = ( _(data[condVar]).difference(cond1) );
					var diff2 = ( _(data[condVar]).difference(cond2) );
					if (error=='1'){
						if ( diff1.length == 0){
							value[AnalyzedVar] += avg1+ penalty;

						}else{
							if (diff2.length == 0 ){
								value[AnalyzedVar] += avg2+ penalty;
							}
						}

					}

				});

			}
		},

		avgAll: function(){



			_.each(parcelMng.parcelArray, function (value,index) {
				parcelMng.avgParcel(value);
			});

		},

		avgParcel: function(p){

			var trialIData = p.trialIData;
			var condVar = compute.condVar;
			var cond1 = compute.cond1VarValues;
			var cond2 = compute.cond2VarValues;
			var AnalyzedVar = compute.AnalyzedVar;
			var avgCon1 = 0;
			var avgCon2 = 0;
			var avgBoth = 0;
			var numCond1 = 0;
			var numCond2 = 0;
			var numBoth = 0;

			_.each (trialIData, function (value,index) {

				var AnVar = value[AnalyzedVar];
				var data = value.data;
				avgBoth += AnVar;
				numBoth ++;
				var diff1 = ( _(data[condVar]).difference(cond1) );
				var diff2 = ( _(data[condVar]).difference(cond2) );
				if ( diff1.length == 0 ) {
					numCond1++;
					avgCon1 += AnVar;
				} else {
					if ( diff2.length == 0 ){
						numCond2++;
						avgCon2 += AnVar;

					}
				}

			});
			if (numCond1 != 0) avgCon1 = avgCon1/numCond1;
			if (numCond2 != 0) avgCon2 = avgCon2/numCond2;
			p.avgCon1 = avgCon1;
			p.avgCon2 = avgCon2;
			p.avgBoth = avgBoth/numBoth;
			parcelMng.addPenalty(p);
			console.log('finished parcel: '+p.name);
			console.log('Avg1 is: '+p.avgCon1);
			console.log('Avg2 is: '+p.avgCon2);
			console.log('AvgBoth is: '+p.avgBoth);
			console.log('--------------------');
		},

		varianceAll: function(){
			console.log('starting varianceAll');
			_.each (parcelMng.parcelArray, function (value,index) {
				parcelMng.varianceParcel(value);
			});
			console.log(parcelMng.parcelArray);
		},

		varianceParcel: function(p){
			console.log('starting varianceParcel');
			var AnalyzedVar = compute.AnalyzedVar;
			var trialIData = p.trialIData;
			var cond1 = compute.cond1VarValues;
			var cond2 = compute.cond2VarValues;
			var condVar = compute.condVar;
			var dataLength = trialIData.length;
			var variance=0;
			var avg = p.avgBoth;
			var d = 0;
			var x2 = 0;
			var pooledCond1 = [];
			var pooledCond2 = [];
			var pooledData = [];
			var errorLatency = compute.errorLatency;
			var useForSTD = errorLatency.useForSTD;


			_.each (trialIData, function (value,index) {//pool to one array
				var data = value.data;
				var AnVar = value[AnalyzedVar];
				var ErrorVar = compute.ErrorVar;
				var error = data[ErrorVar];
				var diff1 = ( _(data[condVar]).difference(cond1) );
				var diff2 = ( _(data[condVar]).difference(cond2) );
				if ( diff1.length == 0 ) {
					if (useForSTD){
						pooledCond1.push(AnVar);
					}
					else{
						if (error=='0') pooledCond1.push(AnVar);
					}
				}
				else {
					if ( diff2.length == 0 ){
						if (useForSTD){
							pooledCond2.push(AnVar);
						}
						else{
							if (error=='0') pooledCond1.push(AnVar);
						}

					}
				}


			});

			pooledData = pooledCond1.concat(pooledCond2);
			_.each (pooledData, function (value,index) {//pool to one array
				var AnVar = value;
				d = AnVar-avg;
				x2 += d*d;

			});
			p.variance = x2/(pooledData.length-1);
			console.log('finished variance parcel: '+p.name);
			console.log('variance: '+p.variance);
			console.log('--------------------');

		},

		diffAll: function(){
			console.log('starting diffAll');
			_.each (parcelMng.parcelArray, function (value,index) {
				parcelMng.diffParcel(value);
			});

		},

		diffParcel: function(p){
			console.log('starting diffParcel');
			p.diff = p.avgCon1 - p.avgCon2;
			console.log('finished diff parcel: '+p.name);
			console.log('diff: '+p.diff);
			console.log('--------------------');

		},

		scoreAll: function(){
			console.log('starting scoreAll');
			var dAvg = 0;
			_.each (parcelMng.parcelArray, function (value,index) {
				parcelMng.scoreParcel(value);
				dAvg +=  value.score;

			});
			var score = (dAvg/(parcelMng.parcelArray.length));
			return score;
		},

		scoreParcel: function(p){
			console.log('starting scoreParcel');
			var sd = Math.sqrt(p.variance);
			p.score = p.diff/sd;
			console.log('finished score parcel: '+p.name);
			console.log('score: '+p.score);
			console.log('--------------------');

		},

		//for QA purposes only!!
		simulateOldCode: function(){

			//require
			var results = [];
			var rb = [2,3,5,6];
			var cond1 = compute.cond1VarValues;
			var cond2 = compute.cond2VarValues;
			var condVar = compute.condVar;
			var ErrorVar = compute.ErrorVar;
			var AnalyzedVar = compute.AnalyzedVar;
			var parcelA = parcelMng.parcelArray[0];
			var parcelB = parcelMng.parcelArray[1];
			var trialsA = parcelA.trialIData;
			var trialsB = parcelB.trialIData;


				//console.log('cond1 diff: ' + diff1.length );

			_.each (trialsA, function (value,index) {
				var data = value.data;
				var diff1 = ( _(data[condVar]).difference(cond1) );//block 2
				var diff2 = ( _(data[condVar]).difference(cond2) );//block 5
				var trial = {};
				if ( diff1.length == 0 ) {
					trial.block = rb[0];
					trial.lat = value[AnalyzedVar];
					trial.err = data[ErrorVar];

				} else {
					if ( diff2.length == 0 ){
					trial.block = rb[2];
					trial.lat = value[AnalyzedVar];
					trial.err = data[ErrorVar];

					}
				}
				results.push(trial);

			});
			_.each (trialsB, function (value,index) {
				var data = value.data;
				var diff1 = ( _(data[condVar]).difference(cond1) );//block 3
				var diff2 = ( _(data[condVar]).difference(cond2) );//block 6
				var trial = {};
				if ( diff1.length == 0 ) {
					trial.block = rb[1];
					trial.lat = value[AnalyzedVar];
					trial.err = data[ErrorVar];

				} else {
					if ( diff2.length == 0 ){
					trial.block = rb[3];
					trial.lat = value[AnalyzedVar];
					trial.err = data[ErrorVar];

					}
				}
				results.push(trial);

			});



			var score = parcelMng.scoreTask(results,rb);
			return score;

		},
		//old scorer

		scoreTask: function(results,rb) {

		        var b = new Array();
		        b[0] = new Array();
		        b[1] = new Array();
		        b[2] = new Array();
		        b[3] = new Array();

		        var pool36;
		        var pool47;
		        var ave3;
		        var ave4;
		        var ave6;
		        var ave7;
		        var diff36;
		        var diff47;
		        var score;
		        var iat1;
		        var iat2;

		        var rberr = new Array();
		        rberr[0] = 0;
		        rberr[1] = 0;
		        rberr[2] = 0;
		        rberr[3] = 0;
		        var trialsUnder = 0;
		        var totalScoredTrials = 0;

		        var errorString;
		        var trial;
		        // BNG Steps 1-5
		        console.log('-------starting old code---------');
		        for(i=0;i < results.length; i++){  //  Loop through all trials
		            trial = results[i];
		            for (j=0;j< rb.length; j++){  //  check if trial is in a report block and < 10000
		                if ((trial.block == rb[j]) && (trial.lat < 10000)){
		                    b[j].push([trial.lat,trial.err]);    //  add to scoring array
		                    if (trial.lat < 300)
		                        trialsUnder++;
		                    if (trial.err)
		                        rberr[j]++;
		                    totalScoredTrials++;
		                    break;
		                }
		            }
		        }

		        // for (i=0;i< b.length; i++){
		        //     if ((rberr[i]/b[i].length) > .4)
		        //         return("ERROR");
		        // }

		        // if ((trialsUnder/totalScoredTrials)>.1)
		        //     return("FAST");

		        if (rb.length == 2) {
		            pool36 = poolSD(b[0],b[1]);
		            ave3 = parcelMng.ave(b[0]);
		            ave6 = parcelMng.ave(b[1]);
		            diff36 =  ave3 - ave6;
		            score = diff36/pool36;
		            score = ((score)*1000)/1000;
		        }
		        else if (rb.length == 4) {
		            //  pool sd BNG Step 6
		            pool36 = parcelMng.poolSD(b[0],b[2]);
		            pool47 = parcelMng.poolSD(b[1],b[3]);
		            //            console.log("Pool SDS:"+pool36+","+pool47);

		            // average	BNG 9
		            ave3 = parcelMng.ave(b[0]);//block 2
		            ave4 = parcelMng.ave(b[1]);//block 3
		            ave6 = parcelMng.ave(b[2]);//block 5
		            ave7 = parcelMng.ave(b[3]);//blcok 6
		            console.log('Avg block 2: '+ave3);
		            console.log('Avg block 3: '+ave4);
		            console.log('Avg block 5: '+ave6);
		            console.log('Avg block 6: '+ave7);
		            console.log('---------------------');
		            //            console.log("ave3:"+ave3+",ave4:"+ave4+",ave6:"+ave6+",ave7:"+ave7);

		            // difference  BNG 10
		            diff36 = ave3 - ave6;
		            diff47 = ave4 - ave7;
		            console.log('diff between block 2 and 5: '+diff36);
		            console.log('diff between block 3 and 6: '+diff47);
		            console.log('---------------------');
		            //            console.log("Diffs "+diff36+","+diff47);

		            //  Divide  BNG11
		            iat1 = (diff36/pool36);
		            iat2 = (diff47/pool47);
		            //            console.log("IATs:"+iat1+","+iat2);

		            // Average quotients BNG 12
		            score = ((iat1+iat2)/2);
		        // Round to thousandths
		        // score = int((score)*1000)/1000;
		        }
		        //        console.log(score);
		        return score;
		},

	    //  IAT Math Functions
	    poolSD: function(arr1,arr2){
	        var temp = new Array();
	        for(var i=0;i<arr1.length;i++){
	            temp.push(arr1[i][0]);
	        }
	        for(i=0;i<arr2.length;i++){
	            temp.push(arr2[i][0]);
	        }
	        return(parcelMng.sd(temp));
	    },

	    ave: function(a){
	        var result=0,i=0,num=0;
	        while(i<a.length){
	            result+=a[i][0];
	            num++;
	            i++;
	        }
	        return(result/num);
	    },

	    //  Standard Math Functions
	    meanf: function(arr){
	        var l = arr.length, s=0;
	        while (l--) s += arr[l];
	        return s/arr.length;
	    },

	    variance: function(arr) {
	        var l = arr.length, x2=0,d=0, m = parcelMng.meanf(arr);
	        while (l--) {
	            d = arr[l]-m;
	            x2 += d*d;
	        }
	        console.log('variance from old code is: '+x2/(arr.length-1));
	        return (x2/(arr.length-1));
	    },

	    sd: function(arr){
	        return Math.sqrt(parcelMng.variance(arr));
	    }

	});

	return parcelMng;

});

