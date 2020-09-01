var url;
var xKey;
var yKey;

$(document).ready(function(){
  $('#url').keydown(function(e) {
      var oldvalue=$(this).val();
      var field=this;
      setTimeout(function () {
          if(field.value.indexOf('https://api.mockaroo.com/api/') !== 0) {
              $(field).val(oldvalue);
          } 
      }, 1);
  });
  plotData(data,'x','y');
});

function testApi(){
  let schema = $('#url').val().trim();
  let apk = $('#apikey').val().trim();
  let test = true;
  if (schema.length<32) {
    $('#url').addClass("error");
    test = false;
  } else {
    $('#url').removeClass("error");
  }
  if (apk.length<3){
    $('#apikey').addClass("error");
    test = false;
  } else {
    $('#apikey').removeClass("error");
  }
  if (test){
    let testURL=schema+'?key='+apk+'&?array=true&?count=10';
    $.get(testURL)
    .success(function(data){
      if (data.length >0){
        $("#apiresult").html('&nbsp;&#10004;<span class="tooltiptext">API is properly configured.</span>');
        $('#url').removeClass("error");
        $('#apikey').removeClass("error");
        let keys=Object.keys(data[0]);
        let cnt = '<label for="count">Count&nbsp;</label><input type="number" min="10" max="1000" id="count" value="100" name="count"><div class="tooltip">&nbsp;&#x24D8;<span class="tooltiptext">Number of records to be retrieved.</span></div>';
        let xsel='<label for="x">X variable&nbsp;</label><select name="x" id="x"><option value="" selected disabled hidden>Choose x variable</option>';
        let ysel='<label for="y">Y variable&nbsp;</label><select name="y" id="y"><option value="" selected disabled hidden>Choose y variable</option>';
        keys.forEach(function(item,index){
          xsel+='<option value="'+item+'">'+item+'</option>';
          ysel+='<option value="'+item+'">'+item+'</option>';
        });
        xsel+='</select><div class="tooltip">&nbsp;&#x24D8;<span class="tooltiptext">Independent variable x from the schema.</span></div>';
        ysel+='</select><div class="tooltip">&nbsp;&#x24D8;&nbsp;<span class="tooltiptext">Dependant variable y from the schema.</span></div><input type="submit" id="getData" value="Retrieve Data" onclick="getData()" disabled><div class="tooltip">&nbsp;&#x24D8;<span class="tooltiptext">Retrieve data from Mockaroo.com and visualize.</span></div>';
        //$("#cnt").html(cnt);
        $("#xcombo").html(xsel);
        $("#ycombo").html(ysel);
        activateCombos();
        url = schema+'?key='+apk+'&?array=true&?count=';
        } else {
          apiError('No data received.');
        }      
    })
    .error(function(jqXHR, textStatus, errorThrown){
      apiError(textStatus);
    }) 
  }
}

function apiError(msg){
  $("#apiresult").html('&nbsp;&#10060;<span class="tooltiptext">API test failed. Check the settings and try again.</span>');
  $('#url').addClass("error");
  $('#apikey').addClass("error");
  console.log(msg);
  $("#cnt").html('');
  $("#xcombo").html('');
  $("#ycombo").html('');
}

function activateCombos(){
  $("select").each(function(){    
      $(this).change(function() {       
      verifyCombos();      
    });        
  });
}

function verifyCombos(){
  let xc = true;
  if ($('#x').val()=='') xc = false;
  let yc = true;
  if ($('#y').val()=='') yc = false;
  if (xc && yc) {
    if ($('#x').val()==$('#y').val()){
      xc = false;
      yc = false;
    }
  }
  if (!xc){
    $('#x').addClass("error");
    $('#getData').attr("disabled", true);
  }
  if (!yc){
    $('#y').addClass("error");
    $('#getData').attr("disabled", true);
  }
  if (xc && yc) {
    $('#x').removeClass("error");
    $('#getData').removeAttr("disabled");
    $('#y').removeClass("error");
    $('#getData').removeAttr("disabled");
    xKey = $('#x').val();
    yKey = $('#y').val();    
  }  
}

function getData(){ //download and visualize the data
  //let cnt = parseInt($('#count').val());
  let cnt = 100;
  console.log(url+cnt);
  $.get(url+cnt)
    .success(function(d){
      plotData(d,xKey,yKey);
    })
    .error(function(jqXHR, textStatus, errorThrown){
      apiError(textStatus);
    })
}

function plotData(idata,xk,yk){
  const xdata = idata.map((_,i)=>idata[i][xk]);
  const ydata = idata.map((_,i)=>idata[i][yk]);
  let sortxdata = [Math.min(...xdata),Math.max(...xdata)];
  let predydata = [];
  const regression = new ML.SimpleLinearRegression(xdata,ydata);
  for (let i=0; i<sortxdata.length; i++){
    predydata[i] = Math.round(regression.predict(sortxdata[i]));//Math.round((regression.predict(sortxdata[i])*100)+Number.EPSILON);
  }
  const config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'png', // one of png, svg, jpeg, webp
      filename: 'graph',
      height: 700,
      width: 1800,
      scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    }
  };            
  const pdata = [{'x' : xdata,                  
                'y' : ydata,
                'name' : 'Actual Data',
                'mode' : 'markers'},
                {'x' : sortxdata,                  
                'y' : predydata,
                'name' : 'Regression Line',
                'mode' : 'lines'}];
  //console.log(pdata);
  Plotly.newPlot('div1',[pdata[0],pdata[1]],{legend:{x:1,xanchor:'right',y:1.1,orientation:'h',font:{size:20}},xaxis:{title:{text:'X',font:{size:24}},dtick:10},yaxis:{title:{text:'Y',font:{size:24}}}},config);
  const score = regression.score(xdata,ydata);
  $("#div2").html('Line Equation '+regression.toString()+
                    '<br>R: '+score.r+ ' R<sup>2</sup>: '+score.r2+ ' &#967;<sup>2</sup>: '+score.chi2+
                    ' RMSD: '+score.rmsd);
}