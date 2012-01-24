var xField="Budget",yField="Worldwide Gross",xDomain,yDomain,xScale,yScale,xAxis,yAxis,numberFormat=d3.format(",.0f"),locate=function(a,d){var b,c,e;d==="x"?(b=a[xField],c=xScale,e=xDomain):(b=a[yField],c=yScale,e=yDomain);return $.isNumeric(b)?c(b):e[0]};
d3.json("/data/moviedata.json",function(a){var d=$("#vis").width(),b=$("#vis").height(),c=[0,d-65],e=[b-65,0];xDomain=[d3.min(a,function(a){return $.isNumeric(a[xField])?+a[xField]:0}),d3.max(a,function(a){return $.isNumeric(a[xField])?+a[xField]:0})];yDomain=[d3.min(a,function(a){return $.isNumeric(a[yField])?+a[yField]:0}),d3.max(a,function(a){return $.isNumeric(a[yField])?+a[yField]:0})];xScale=d3.scale.linear().domain(xDomain).range(c);yScale=d3.scale.linear().domain(yDomain).range(e);xAxis=d3.svg.axis().scale(xScale).orient("bottom").ticks(5).tickSize(-(b-
65),0,0).tickFormat(numberFormat);yAxis=d3.svg.axis().orient("left").scale(yScale).ticks(5).tickSize(-(d-65),0,0).tickFormat(numberFormat);c=d3.select("#vis").append("svg").attr("width",d).attr("height",b).append("g").attr("transform","translate(55,10)");c.append("g").attr("class","x axis").attr("transform","translate(0,"+(b-65)+")").call(xAxis);c.append("text").attr("x",d/2).attr("y",b-65/3).attr("text-anchor","middle").attr("class","axisTitle").text(xField).on("click",changeAxis("x"));c.append("g").attr("class",
"y axis").attr("transform","translate(0,0)").call(yAxis);c.append("text").attr("x",b/2).attr("y",65/3).attr("text-anchor","end").attr("class","axisTitle").attr("transform","translate(-65,"+b*0.85+")rotate(-90)").text(yField).on("click",changeAxis("y"));c.selectAll("circle").data(a).enter().append("circle").attr("class","point").attr("cx",function(a){return locate(a,"x")}).attr("cy",function(a){return locate(a,"y")}).attr("r",5).on("mouseover",mouseover).on("mouseout",mouseout)});
function changeAxis(){}
function mouseover(a){$("#details").css("display","inline");$("#detail-film-value").html(a.Film);$("#detail-year-value").html(a.Year);$("#detail-profitability-value").html(a.Profitability);$("#detail-budget-value").html(a.Budget);$("#detail-theatres-value").html(a["Number of Theatres in US Opening Weekend"]);$("#detail-worldwide-value").html(a["Worldwide Gross"]);$("#detail-audience-value").html(a["Audience  score %"]);$("#detail-genre-value").html(a.Genre);$("#detail-openingweekend-value").html(a["Opening Weekend"]);$("#detail-domestic-value").html(a["Domestic Gross"]);
$("#detail-rotten-value").html(a["Rotten Tomatoes %"]);$("#detail-story-value").html(a.Story);$("#detail-avgcinema-value").html(a["Box Office Average per US Cinema (Opening Weekend)"]);$("#detail-foreign-value").html(a["Foreign Gross"]);$("#detail-oscar-value").html(a.Oscar);$("#detail-studio-value").html(a["Lead Studio"]);d3.select(this).style("stroke-width",2.5).style("stroke","orange")}
function mouseout(){$("#details").css("display","none");d3.select(this).style("stroke-width",null).style("stroke",null)};
