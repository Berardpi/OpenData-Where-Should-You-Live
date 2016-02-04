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
            cyclelane_length: data.properties.cyclelane_length,
          };
        } else {
          return {};
        }
      };
      // var data = processData(evalDataToPlot);

      var margin = {top: 20, right: 40, bottom: 30, left: 20},
        width = 680 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y0 = d3.scale.linear()
        .range([height, 0]);

      var y1 = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var y0Axis = d3.svg.axis()
        .scale(y0)
        .orient("left")
        .ticks(10);

      var y1Axis = d3.svg.axis()
        .scale(y1)
        .orient("right")
        .ticks(10);

      var svg = d3.select(elem.find("#barChart")[0])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      function clearGraph() {
        svg.selectAll('.bar').remove();
        svg.selectAll('.bartext').remove();
        svg.selectAll('.axis').remove();
      }

      function drawGraph(dataToPlot) {
        clearGraph();
        var data = processData(dataToPlot);

        x.domain(Object.keys(data).map(function(k) { return CriteriasSvc.getTrad(k); }));
        y0.domain([0, 1.05 * d3.max(Object.keys(data), function(k) {if (k != 'cyclelane_length') {return data[k]} else {return 0;}})]);
        y1.domain([0, 1.08 * data.cyclelane_length])

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y0 axis")
            .call(y0Axis);

        svg.append("g")
          .attr("class", "y1 axis")
          .attr("transform", "translate(" + width + " ,0)")
          .call(y1Axis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 30)
            .attr("x", -225)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Longueur piste cyclable (m)");

        var bars = svg.selectAll(".bar").data(Object.keys(data));

          // .append("text")
          //   .attr("y", 6)
          //   .attr("dy", ".71em")
          //   .style("text-anchor", "end")
          //   .text(function(k) {return k;});

        bars.enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(k) {return x(CriteriasSvc.getTrad(k));})
          .attr("width", x.rangeBand())
          .attr("y", function(k) {
            if (k == 'cyclelane_length') {
              return y1(data[k]);
            } else {
              return y0(data[k]);
            }
          })
          .attr("height", function(k) {
            if (data[k] != 0) {
              if (k == 'cyclelane_length') {
                return height - y1(data[k]);
              } else {
                return height - y0(data[k]);
              }
            } else {
              return 1;
            }
          });

        var yTextPadding = 15;
        svg.selectAll(".bartext")
            .data(Object.keys(data))
          .enter()
            .append("text")
              .attr("class", "bartext")
              .attr("text-anchor", "middle")
              .attr("fill", "white")
              .attr("x", function(k) {
                  return x(CriteriasSvc.getTrad(k)) + x.rangeBand()/2;
              })
              .attr("y", function(k) {
                if (k == 'cyclelane_length') {
                  return y1(data[k]) + yTextPadding;
                } else {
                  return y0(data[k]) + yTextPadding;
                }
              })
              .text(function(k){
                if (k == 'cyclelane_length') {
                  return Math.round(data[k]) + "m";
                } else {
                  return Math.round(data[k]);
                }

              });
      }

    }
  }
});