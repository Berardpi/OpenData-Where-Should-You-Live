"use strict";

angular.module('Bubble')
.directive('bubble', function($parse, $window) {
   return{
      restrict:'EA',
      template: '<svg id="bubbleGraph" width="850" height="200"></svg>',
       link: function(scope, elem, attrs){
          // Load data :
          var evalDataToPlot = $parse(attrs.chartData);
          var bubbleWeightAttr = attrs.bubbleWeight;
          console.log(bubbleWeight);
          //var dataToPlot=$parse(attrs.chartData)(scope);

          var diameter = 600;

          var d3 = $window.d3;
          var svg = d3.select(elem.find("#bubbleGraph")[0])
                      .attr('width', diameter)
                      .attr('height', diameter);

          // Set D3 layout : 
          var bubble = d3.layout.pack()
                .size([diameter, diameter])
                .value(function(d) {return d.size;})
                .sort(null)
                .padding(5);

          // Update data
          scope.$watchCollection(evalDataToPlot, function(newVal, oldVal){
				drawGraph(newVal);
          });
  
          // Format data to fit in the required d3 layout
          function processData(data) {
            var obj = data;

            var newDataSet = [];

            for(var prop in obj) {
              newDataSet.push({name: obj[prop].properties.name, className: "bubble", size: obj[prop].properties.length});
            }
            return {children: newDataSet};
          }

          function clearGraph(){
	          svg.selectAll('.node').remove();
          }

          function drawGraph(dataToPlot){
          	  if(dataToPlot === undefined || dataToPlot.length === 0){
          	  	return; 
          	  }

          	  var duration = 1000;
          	  var delay = 0;

	          var nodesData = bubble.nodes(processData(dataToPlot))
	                        .filter(function(d) { return !d.children; }); // filter out the outer bubble
	 
	          var nodes = svg.selectAll('.node')
	          				 .remove()
	                         .data(nodesData);

	          nodes.enter()
	          	   .append("g")
      			   .attr("class", "node")
      			   .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      		  nodes.append('circle')
	               .attr('r', function(d) { return d.r; })
	               .attr('class', function(d) { return d.className; })
	               .style('opacity', 0) 
				   .transition()
				   .duration(duration * 1.2)
				   .style('opacity', 1);

	          nodes.append("text")
			       .attr("dy", ".3em")
			       .style("text-anchor", "middle")
			       .text(function(d) { 
				       	var text = d.name.substring(0, d.r / 4);
				        if(text !== d.name){
				          	text += ".";
				        }
			       		return text; 
			       })
			       .style('opacity', 0) 
				   .transition()
				   .duration(duration * 1.2)
				   .style('opacity', 1);

			  nodes.exit()
				  .transition()
				  .duration(duration + delay)
				  .style('opacity', 0)
				  .remove();
          }
       }
   };
});