'use strict';

angular.module('Cyclelane', ['Neighborhood'])
  .factory('CyclelaneSvc', function ($http, NeighborhoodSvc) {
    var service = {};
    service.route = "http://127.0.0.1:5000/cyclelane";

    service.load = function() {
      return $http.get(service.route).then(function(success) {
        return success.data._items;
      });
    };

    service.loadInPolygon = function(polygon) {
      var params = 'where={\"geometry\": {\"$geoWithin\": {\"$geometry\": ' + JSON.stringify(polygon) + '}}}';
      return $http.get(service.route + '?' + params).then(function(success) {
        return success.data._items;
      });
    };

    service.lengthInPolygon = function(polygon) {
      return service.loadInPolygon(polygon).then(function(success) {
        var length = 0;
        _.forEach(success, function(lane) {
          length += lane.properties.longueur_section_m;
        });
        return length;
      });
    }

    service.lengthPerNeighborhood = function(){
        var neighborhoods = NeighborhoodSvc.load();
        var lengths = [];

        _.forEach(neighborhoods, function(n) {
          lengths.push({'name': n.properties.SDEC_LIEBEL, 'length': lengthInPolygon(n.geometry)});
        });
        return lengths
    }

    return service;
  });