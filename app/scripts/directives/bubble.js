"use strict";

angular.module('Bubble')
.directive('bubble', function($parse, $window) {
   return{
      restrict:'EA',
      template: '<svg id="bubbleGraph" width="850" height="200"></svg>',
       link: function(scope, elem, attrs){
          // Load data :
          var exp = $parse(attrs.chartData);
          var dataToPlot=exp(scope);

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
                .padding(3);

          // generate data with calculated layout values
          var nodes = bubble.nodes(processData(dataToPlot))
                        .filter(function(d) { return !d.children; }); // filter out the outer bubble
 
          var vis = svg.selectAll('circle')
                       .data(nodes);

          vis.enter().append('circle')
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .attr('r', function(d) { return d.r; })
            .attr('class', function(d) { return d.className; });

          // Update data
          scope.$watchCollection(exp, function(newVal, oldVal){
               dataToPlot=newVal;
               nodes = bubble.nodes(processData(dataToPlot))
                        .filter(function(d) { return !d.children; });
          });
  
          // Format data to fit in the required d3 layout
          function processData(data) {
            var obj = data.data;

            var newDataSet = [];

            for(var prop in obj) {
              newDataSet.push({name: prop, className: prop.toLowerCase(), size: obj[prop]});
            }
            return {children: newDataSet};
          }
       }
   };
});