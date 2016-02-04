"use strict";

angular.module('ParallelCoordinates')
.directive('parallelcoordinates', function($parse, $window, CriteriasSvc) {
   return{
      restrict:'EA',
      template: '<svg id="parallelCoordinatesGraph" width="850" height="200"></svg>',
      link: function(scope, elem, attrs){
        // Load directive data :
        var evalDataToPlot = $parse(attrs.chartData); //(scope)

        var d3 = $window.d3;
        var duration = 1000;
        var delay = 0;

        var dimensions;

        var margin = {top: 30, right: 0, bottom: 10, left: 0},
          width = 650 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

        var x = d3.scale.ordinal().rangePoints([0, width], 1),
          y = {};

        var line = d3.svg.line(),
          axis = d3.svg.axis().orient("left"),
          background,
          foreground;

        var svg = d3.select(elem.find("#parallelCoordinatesGraph")[0])
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Update data
        scope.$watchCollection(evalDataToPlot, function(newVal, oldVal){
          drawGraph(newVal);
        });

        function clearGraph() {
          svg.selectAll(".background").remove();
          svg.selectAll(".foreground").remove();
          svg.selectAll(".dimensions").remove();
        }

        function drawGraph(dataToPlot){
          if(dataToPlot === undefined){
            return;
          }
          clearGraph();

          // Extract the list of dimensions and create a scale for each.
          x.domain(dimensions = d3.keys(dataToPlot.dimensions).filter(function(dim){
            if(dim == "name"){
              //return; // dataToPlot.data.map(function(d) {console.log(d.properties[dim]); return d.properties[dim]; }).sort();
              return y[dim] = d3.scale.ordinal()
                .domain(dataToPlot.data.map(function(d) { return d.properties[dim]; }).sort())
                .rangePoints([height, 0]);
            }

            return dataToPlot.dimensions[dim] &&
              (y[dim] = d3.scale.linear()
             .domain(d3.extent(dataToPlot.data,
                function(neighb) {
                  return +neighb.properties[dim];
                }
             ))
             .range([height, 0]));
          }));


          // Add grey background lines for context.
          svg.selectAll(".background").remove();
          background = svg.append("g")
                      .attr("class", "background")
                    .selectAll("path")
                      .data(dataToPlot.data)
                    .enter().append("path")
                      .attr("d", path);

          svg.selectAll(".foreground").remove();
          // Add blue foreground lines for focus.
          foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(dataToPlot.data)
            .enter().append("path")
            .attr("d", path);

          svg.selectAll(".dimension").transition()
           .duration(duration)
           .delay(function(d, i) {delay = i * 7; return delay;})
           .attr("transform", function(d) { return "translate(" + x(d) + ")"; })

          svg.selectAll(".dimension").remove();

          // Add a group element for each dimension.
          var g = svg.selectAll(".dimension")
            .data(dimensions, function(d){ return d;})
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })

          // Add an axis and title.
          g.append("g")
           .attr("class", "axis")
           .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
           .append("text")
           .style("text-anchor", "middle")
           .attr("y", -9)
           .text(function(d) { return CriteriasSvc.getTrad(d); });

          // Add and store a brush method for each axis.
          g.append("g")
           .attr("class", "brush")
           .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
           .selectAll("rect")
           .attr("x", -8)
           .attr("width", 16);

          svg.selectAll(".brush").each(function(d) {d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); });
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function(p) { return [x(p), y[p](d.properties[p])]; }));
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
          var actives = dimensions.filter(function(p) {return !y[p].brush.empty(); }),
              extents = actives.map(function(p) { return y[p].brush.extent(); });
          foreground.style("display", function(d) {
            return actives.every(function(p, i) {
              //convert to pixel range if ordinal
              var prop = (y[p].ticks) ? d.properties[p] : y[p](d.properties[p]); 
              return extents[i][0] <= prop && prop <= extents[i][1];
            }) ? null : "none";
          });
        }
      }
   };
});