'use strict';

angular.module('Stop', [])
  .factory('StopSvc', function ($http) {
    var service = {};
    service.route = "http://127.0.0.1:5000/stop";

    service.load = function() {
      return $http.get(service.route).then(function(success) {
        return success.data;
      });
    };

    service.loadInPolygon = function(polygon) {
      var params = 'where={\"geometry\": {\"$geoWithin\": {\"$geometry\": ' + JSON.stringify(polygon) + '}}}';
      return $http.get(service.route + '?' + params).then(function(success) {
        return success.data;
      });
    };

    return service;
  });