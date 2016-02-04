"use strict";

angular.module('Bar')
// angular.module('Bar', ['Criterias'])
.directive('bar', function($parse, $window, CriteriasSvc) {
  return {
    restrict:'EA',
    template: '<svg id="barChart" width="680" height="400"></svg>',
    link: function(scope, elem, attrs){
      var d3 = $window.d3;
      // Load directive data :
      var evalDataToPlot = $parse(attrs.chartData); //(scope)
      var data = {};

      scope.$watchCollection(evalDataToPlot, function(newVal, oldVal){
        drawGraph(newVal);
      });

      function processData(data) {
        if (data != undefined) {
          return {
            bus_count: data.properties.bus_count,
            tram_count: data.properties.tram_count,
            autocar_count: data.properties.autocar_count,
            citelib_count: data.properties.citelib_count,
            gsm_2g_count: data.properties.gsm_2g_count,
            gsm_3g_count: data.properties.gsm_3g_count,
            gsm_4g_count: data.properties.gsm_4g_count,
            sncf_count: data.properties.sncf_count,
            cyclelane_length: data.properties.cyclelane_length/100,
          };
        } else {
          return {};
        }
      };
      // var data = processData(evalDataToPlot);

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 680 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

      var svg = d3.select(elem.find("#barChart")[0])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function drawGraph(dataToPlot) {
      var data = processData(dataToPlot);

      x.domain(Object.keys(data).map(function(k) { return CriteriasSvc.getTrad(k); }));
      y.domain([0, d3.max(Object.keys(data), function(k) {return data[k]})]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
        // .append("text")
        //   .attr("transform", "rotate(-90)")
        //   .attr("y", 6)
        //   .text("Frequency");

      svg.selectAll(".bar")
          .data(Object.keys(data))
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(k) {return x(CriteriasSvc.getTrad(k));})
          .attr("width", x.rangeBand())
          .attr("y", function(k) { return y(data[k]); })
          .attr("height", function(k) {
            if (data[k] != 0) {
              return height - y(data[k]); 
            } else {
              return 1;
            }
          })
          .append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(function(k) {return k;});
    }


    }
  }
});