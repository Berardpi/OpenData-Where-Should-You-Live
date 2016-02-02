'use strict';

angular.module('Gsm', ['Neighborhood'])
  .factory('GsmSvc', function ($http, NeighborhoodSvc) {
    var service = {};
    service.route = "http://127.0.0.1:5000/gsm";

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

    service.loadPerNeighborhood = function(){
        return NeighborhoodSvc.load().then(function(neighborhoods) {
            return Promise.all(neighborhoods.map(function(n){
                var obj = { properties : {'name': n.properties.SDEC_LIBEL}, 'geometry':n.geometry, 'type':"Feature"};
                return service.loadInPolygon(n.geometry).then(function(gsms){
                    // Work out the density of stops per neighborhood
                    obj.properties.weight = gsms.length/turf.area(n.geometry);
                    return obj;
                });
            }))
        });
    };

    return service;
  });