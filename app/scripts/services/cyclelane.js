'use strict';

angular.module('Cyclelane', [])
  .factory('CyclelaneSvc', function ($http) {
    var service = {};
    service.route = "http://127.0.0.1:5000/cyclelane";

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

    service.lengthInPolygon = function(polygon) {
      return service.loadInPolygon(polygon).then(function(success) {
        var length = 0;
        _.forEach(success._items, function(lane) {
          length += lane.properties.longueur_section_m;
        });
        return length;
      });
    }

    return service;
  });