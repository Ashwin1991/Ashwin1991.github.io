/* DataDriven.org project: Water in Tanzania
work for UW, iSchool, INFX575 DataSci3, taught by Jevin West */

//************************************ Part 0. Global variables ************************************//
var width = 500,
    height = 400,
    height2=300,
    r = 29;
var margin = {top: 20, right: 20, bottom: 30, left: 50};

//datasets and data structures
var dataset, datasetMetrics1; //to hold full dataset, summarized datasets
var years = [];
var circles, bars;

//init axes variables
var minYear, maxYear, maxYear_axes, y_min, y_dynamic_max ; 
minYear=1960;
maxYear=2013;
maxYear_axes=maxYear+2;
y_min=-1;
//************************************ Part 1. Perceptron: Data and global variables  ************************************//


//************************************ Part 2. Write SVG elements ************************************//
//Create svg elements - main to display the graph, and side for summaries and navigation
var svg = d3.select("#graph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//add tooltip for hover event
var tooltip;
tooltip = d3.select("#graph").append("div") 
.attr("class", "tooltip")
.style("opacity", 0);

//Plot #1 - Barplot that shows waterpoints by operational status
function drawVis_barplot(data) {
  //clear canvas
  svg.selectAll("*").remove();

  //scale for barplot
  var xScale = d3.scale.ordinal()
      .rangeRoundBands([0, width], .2);

  var yScale = d3.scale.linear()
      .range([height2, 0]);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10);

  xScale.domain(data.map(function(d) { return d.status_value; }));
  yScale.domain([0, d3.max(data, function(d) { return Math.ceil(d.count/5000)*5000; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  //draw data driven bars
  bars = svg.selectAll(".bar")
    .data(data)

    // Add new bars 
    bars.enter().append("rect"); 
   // Remove bars 
    bars.exit().remove();

   bars
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d.status_value); })
    .attr("width", xScale.rangeBand())
    .attr("y", function(d) { return yScale(d.count); })
    .attr("height", function(d) { return height2 - yScale(d.count); })
    .style("fill", function(d) { if(d.status_id== 0) { return "green";} else if(d.status_id== 1) { return "yellow";} else if(d.status_id== 2) { return "red";} })
    .style("fill-opacity", 0.7)
    //.style("stroke", "black")
    .style("stroke-width", "1.5px")
    .style("stroke", function(d) {if(d.status_id== 0) { return "green";} else if(d.status_id== 1) { return "orange";} else if(d.status_id== 2) { return "red";} })
    
    .on("mouseover", function(d) {
      svg.selectAll('rect')
      .filter(function (dOther) { return d.status_id == dOther.status_id }) 
      .style('opacity', 1.0)
        
      tooltip.transition()
      .duration(200)
      .style("opacity", .9);
      tooltip.html(d.count + " waterpoints")
      .style("left", xScale(d.status_value) + width/(2*data.length) - 20 + "px") //(d3.event.pageX - 125) + "px")
      .style("top", yScale(d.count) + "px")}) //(d3.event.pageY - 28) + "px")})

    .on("mouseout", function(d) {
      svg.selectAll('rect')
      .filter(function (dOther) { return d.status_id == dOther.status_id })
      .style('opacity', 0.7) 

      tooltip.transition()
        .duration(500)
        .style("opacity", 0) });

}      

//Plot #2 - Scatterplot that shows waterpoints by construction year, color-coded with operational status
function drawVis_scatter(data) {
  //clear canvas
  svg.selectAll("*").remove();

  //scale for scatterplot
  var x = d3.scale.linear()
          .domain([minYear-1, maxYear_axes])
          .range([0, width]);

  var y = d3.scale.linear()
          .domain([0, 2070])
          .range([height2, 0]);
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(10)
      .tickFormat(d3.format("i"));

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis)
       .append("text")
        .attr("x", width - 200)
        .attr("y", +30)
        .style("text-anchor", "end")
        .text("Construction Year");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  svg.append("g")
     .attr("class", "axis")
     .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count"); 

  circles = svg.selectAll("circle")
   .data(data)

   // Add new circles 
    circles.enter().append("circle"); 

    // Remove circles 
    circles.exit().remove();
   //.enter()
   //.append("circle")

   circles
    .attr("cx", function(d) { return x(d.year);  })
    .attr("cy", function(d) { return y(d.count);  })
    .attr("r", function(d) { if(d.count>0 && d.count<=200) { return 3;} else if(d.count>200 && d.count<1350) {return d.count * .015;} else {return d.count * .01;}})
    .style("fill", function(d) { if(d.status_id== 0) { return "green";} else if(d.status_id== 1) { return "yellow";} else if(d.status_id== 2) { return "red";} })
    .style("fill-opacity", 0.6)
    //.style("stroke", "black")
    .style("stroke-width", "1.5px")
    .style("stroke", function(d) {if(d.status_id== 0) { return "green";} else if(d.status_id== 1) { return "orange";} else if(d.status_id== 2) { return "red";} })
    
    
    .on("mouseover", function(d) {
        svg.selectAll('circle')
        .filter(function (dOther) { return d.status_id == dOther.status_id })
        .style('opacity', 1.0)
        //.attr("r",function(dLast) { if(dLast.count>0 && dLast.count<=200) { return 6;} else if(dLast.count>200 && dLast.count<1300) {return dLast.count * .030;} else {return dLast.count * .018;}})
        .attr("r",function(dLast) { if(dLast.count>0 && dLast.count<=200) { return 6;} else if(dLast.count>200 && dLast.count<1350) {return dLast.count * .018;} else {return dLast.count * .011;}})

        tooltip.transition()
        .duration(200)
        .style("opacity", .9);
        //.text("hello")
        tooltip.html("Year: " + d.year + "<br> Status: " + d.Status + "<br> Count: " + d.count)
        .style("left", "75px") //(d3.event.pageX - 75) + "px")
        .style("top", "75px") //(d3.event.pageY - 75) + "px")
        })

    .on("mouseout", function(d) {
        svg.selectAll('circle')
        .filter(function (dOther) { return d.status_id == dOther.status_id })
        .style('opacity', 0.6)
        //    .attr("r",function(dLast) { if(dLast.count>0 && dLast.count<=200) { return 3;} else if(dLast.count>200 && dLast.count<1300) {return dLast.count * .015;} else {return dLast.count * .012;}})
        .attr("r", function(d) { if(d.count>0 && d.count<=200) { return 3;} else if(d.count>200 && d.count<1350) {return d.count * .015;} else {return d.count * .01;}});
        tooltip.transition()
        .duration(500)
        .style("opacity", 0)
        }) 

}

//clear canvas
function drawNothing(){
  svg.selectAll("*").remove();
}

// Update function
var update = function(value) {
  switch(value) {

   case 0:
    console.log ('inside case 0')
    //clear canvas
    drawNothing();
    break;
    
   case 1:
    console.log ('inside case 1')
    // load data from csv file
    d3.csv("data/water_full.csv", function(error, water) {
      
      //read in the data - original dataset
      if (error) return console.warn(error);
        
       water.forEach(function(d) {
          d.Year = +d.year;
          d.Status_id=+d.status_group_id;
          d.Status_value = d.status_group;   
          /*var status_value;
          if (d.status_id==0) {status_value = "functional"} else if (d.status_id==1) {status_value =  "needs repairs"} else {status_value=  "non-functional"};
          d.Status = status_value;*/
       });
       dataset=water;
       
       //group values by status
       var datasetAggr1 = d3.nest()
        .key(function(d) { return d.Status_id; })
        .rollup(function(v) { return v.length}) 
        .entries(dataset);
        //console.log("aggr:", JSON.stringify(datasetAggr1));

       //Flatten rolled up dataset(s)
       function flattenNested1(dataset) {
        var newData = [];
        var v_status_value;
        
        dataset.forEach(function(d) {
          console.log("forEach1" + d.key + d.values);
          if (d.key==0) { v_status_value="functional"} else if (d.key==1) {v_status_value="needs-repairs"} else {v_status_value="non-functional"};
            newData.push({
                status_id: d.key,
                count: d.values,
                status_value: v_status_value
              });
        });
        return newData;
      }

      //populate dataset1 tidy - waterpoints aggregated by status
      datasetMetrics1= flattenNested1(datasetAggr1);

      //draw plot
      drawVis_barplot(datasetMetrics1);
      
    });
    break;

    case 2:
      console.log ('inside case 2')
      // load data from csv file
      d3.csv("data/dynamic_water_status_byYear.csv", function(error, water) {
        
        //read in the data - original dataset
        if (error) return console.warn(error);
          
           water.forEach(function(d) {
              d.Year = +d.year;
              d.Status_id=+d.status_id;
              d.Value = +d.count;
              var status_value;
              if (d.status_id==0) {status_value = "functional"} else if (d.status_id==1) {status_value =  "needs repairs"} else {status_value=  "non-functional"};
              d.Status = status_value;
           });
         dataset=water;
         //initVis(dataset);

         //enumearate main data structures
        //get a list of years that data was recorded for (because some years are missing)
        years=d3.range(minYear,maxYear+1)
        
        //drawVis(dataset)
         //animate
        var year_idx=0;
        var year_interval= setInterval(function () {
          filterData(minYear,years[year_idx]);
          year_idx++;
          
          if(year_idx>=years.length) {
            clearInterval(year_interval);
          }
        }, 20);
        
      });
      break;
    
    default:
      console.log ('inside default')
      //do nothing
      break;
    
  }
  //draw(data)
  //label(data)
}


//******* Graph Scroll
var gs = graphScroll()
    .container(d3.select('#container'))
    .graph(d3.selectAll('#graph'))
    .sections(d3.selectAll('#sections > div'))
    .on('active', function(i){
      console.log(i + 'th section active');

      var pos = [ {cx: width - r,         cy: r},
                  {cx: r,                 cy: r},
                  {cx: width - r, cy: height2 - r},
                  {cx: width/2,   cy: height2/2} ][i]

      //if (i>0) {console.log("updating: ", i); update(i)};
      console.log("updating: ", i); update(i)
      
      });


//the end
/*d3.select('#source')
    .style({'margin-bottom': window.innerHeight - 500 + 'px', padding: '100px'})*/


//************************************ Part 3 - Filter for animation ************************************////
// Filter parts

//define filter function - filter dataset based on parameters
function filterData(startYear, endYear){
  //console.log("inside filterData" + startYear + endYear );
  var fDataset;

  // filter by years
  fDataset=dataset.filter(function(d){return d.year>=startYear && d.year<=endYear});
  //ready to draw circles
  drawVis_scatter(fDataset);
  
};


//************************************ Xtra chunks ************************************//

//Create svg elements - main part to display the graph
/*var svg = d3.select('#graph')
  .append('svg')
    .attr({width: width, height: height})
    //.attr("width", width + margin.left + margin.right)  //$goodcode
    //.attr("height", height + margin.top + margin.bottom)

var circle_setup = function(circle) {
  //console.log("inside circle setup: ", circle);
  circle.attr('r', radius)
        .attr('cx', function(d, i) { if (state_original) {if ((i % 2)==0) {return i*50+83} else {return i*50+70}} else {if (i==0 | i==1) {return 100} else if (i==2 | i==3) {return 200} else if (i==4 | i==5){return 300} else {return 400}}})
        .attr('cy', function() {if (state_original) {return 100} else {return 300}})
        .attr("fill", function(d) {if (d==0) {return "blue"} else {return "red"} })
        .style("fill-opacity", 0.2)
        .style("stroke", function(d) {if (d==0) {return "blue"} else {return "red"} }
        )
}

var circleText_setup = function(text) {
  text.text(function(d) { return d; })
        .attr('dx', function(d, i) { if (state_original) {if ((i % 2)==0) {return i*50+83-4} else {return i*50+70-4}} else {if (i==0 | i==1) {return 100-4} else if (i==2 | i==3) {return 200-4} else if (i==4 | i==5){return 300-4} else {return 400-4}}})
        .attr('dy', function() {if (state_original) {return 100+5} else {return 300+5}})
      
}

// Reusable drawing function
var draw = function(data) {
  // Bind self.settings.data
  var circles = svg.selectAll('circle').data(data)

  // Enter new elements
  circles.enter().append('circle').call(circle_setup)

  // Exit elements that may have left
  circles.exit().remove()

  // Transition all circles to new dself.settings.data
  svg.selectAll('circle').transition().duration(1500).call(circle_setup)  
}

*/