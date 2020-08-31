$(document).ready(function(){
	//console.log( "ready!" );
var config = {
  toImageButtonOptions: {
    format: 'png', // one of png, svg, jpeg, webp
    filename: 'graph',
    height: 700,
    width: 1800,
    scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
  }
};
	let url='https://api.mockaroo.com/api/0c0b0d20?key=92ae5410&?count=20&?array=true';    
    /*$.get(url).done(function (data) {    	
    	console.log(data);
    	const xdata = data.map((_,i)=>data[i].x);
  		const ydata = data.map((_,i)=>data[i].y);
  		let sortxdata = xdata.sort(function(a, b){return a - b});
  		sortxdata = sortxdata.map((_,i)=>parseFloat(sortxdata[i]));
  		let predydata = [];
  		const regression = new ML.SimpleLinearRegression(xdata,ydata);
  		for (let i=0; i<sortxdata.length; i++){
  			predydata[i] = Math.round(regression.predict(sortxdata[i]));//Math.round((regression.predict(sortxdata[i])*100)+Number.EPSILON);
  		} 
  		//console.log([sortxdata,predydata]); 		
    	const pdata = [{'x' : xdata,                  
                  'y' : ydata,
                  'name' : 'Actual Data',
                  'mode' : 'markers'},
                  {'x' : sortxdata,                  
                  'y' : predydata,
                  'name' : 'Regression Line',
                  'mode' : 'lines'}];
    	Plotly.newPlot('div1',[pdata[0],pdata[1]],{legend:{x:1,xanchor:'right',y:1.1,orientation:'h',font:{size:20}},xaxis:{title:{text:'X',font:{size:24}},dtick:1},yaxis:{title:{text:'Y',font:{size:24}}}},config);
    	$("#div2").append('Line Equation'+regression.toString());
	});*/

    const xdata = data.map((_,i)=>data[i].x);
    const ydata = data.map((_,i)=>data[i].y);
    let sortxdata = xdata.sort(function(a, b){return a - b});
    sortxdata = sortxdata.map((_,i)=>parseFloat(sortxdata[i]));
    let predydata = [];
    const regression = new ML.SimpleLinearRegression(xdata,ydata);
    
    for (let i=0; i<sortxdata.length; i++){
      predydata[i] = Math.round(regression.predict(sortxdata[i]));//Math.round((regression.predict(sortxdata[i])*100)+Number.EPSILON);
    }            
    const pdata = [{'x' : xdata,                  
                  'y' : ydata,
                  'name' : 'Actual Data',
                  'mode' : 'markers'},
                  {'x' : sortxdata,                  
                  'y' : predydata,
                  'name' : 'Regression Line',
                  'mode' : 'lines'}];
    Plotly.newPlot('div1',[pdata[0],pdata[1]],{legend:{x:1,xanchor:'right',y:1.1,orientation:'h',font:{size:20}},xaxis:{title:{text:'X',font:{size:24}},dtick:10},yaxis:{title:{text:'Y',font:{size:24}}}},config);
    $("#div2").append('Line Equation '+regression.toString());
    $("#div3").append('R-Square '+regression.score(x, y));
	});