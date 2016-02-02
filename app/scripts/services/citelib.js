'use strict';

angular.module('Citelib', ['Neighborhood'])
  .factory('CitelibSvc', function ($http, NeighborhoodSvc) {
    var service = {};
    service.route = "http://127.0.0.1:5000/citelib";

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
                return service.loadInPolygon(n.geometry).then(function(citelibs){
                    // Work out the density of citelibs per neighborhood
                    obj.properties.weight = citelibs.length/turf.area(n.geometry);
                    return obj;
                });
            }))
        });
    };

    return service;
  });