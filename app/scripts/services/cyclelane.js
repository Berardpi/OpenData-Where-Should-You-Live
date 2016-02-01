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
        return NeighborhoodSvc.load().then(function(success) {
            var lengths = [];
            _.forEach(success, function(n) {
                var obj = {'name': n.properties.SDEC_LIBEL, 'geometry':n.geometry};
                service.lengthInPolygon(n.geometry).then(function(len){
                    obj.lenght = len;
                    lengths.push(obj);
                }); 
            });
            return lengths
        });
    }

    return service;
  });