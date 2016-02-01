'use strict';

angular.module('Stop', [])
  .factory('StopSvc', function ($http) {
    var service = {};
    service.route = "http://127.0.0.1:5000/stop";

    service.load = function() {
      return $http.get(service.route).then(function(success) {
        var stops = success.data._items;
        service.labelize_stops(stops);
        return stops;
      });
    };

    service.loadInPolygon = function(polygon) {
      var params = 'where={\"geometry\": {\"$geoWithin\": {\"$geometry\": ' + JSON.stringify(polygon) + '}}}';
      return $http.get(service.route + '?' + params).then(function(success) {
        var stops = success.data._items;
        service.labelize_stops(stops);
        return stops;
      });
    };

    // Could be done directly in mongo on data import
    // Not working
    service.labelize_stops = function(stops) {
      var tram_lines = ['SEM_A', 'SEM_B', 'SEM_C', 'SEM_D', 'SEM_E'];

      _.forEach(stops, function(stop) {
        if (stop.properties) {
          stop.properties.tram = false;
          stop.properties.bus = false;
          stop.properties.sncf = false;
          stop.properties.autocar = false;

          var lines = stop.properties.LIGNESARRET.split(',');
          _.forEach(lines, function(line) {
            if (_.contains(tram_lines, line)) {
              stop.properties.tram = true;
            } else if (line.startsWith('SEM_')) {
              stop.properties.bus = true;
            } else if (line.startsWith('SNC_')) {
              stop.properties.sncf = true;
            } else {
              stop.properties.autocar = true;
            }
          });
        }
      });
    }

    return service;
  });