'use strict';

angular.module('MongoApi', [])
  .factory('MongoApiSvc', function ($http) {
    var service = {};
    service.route = "http://127.0.0.1:5000/";

    service.load = function(collection) {
      return $http.get(service.route + collection).then(function(success) {
        return success.data._items;
      });
    };

    service.loadInPolygon = function(collection, polygon) {
      var params = 'where={\"geometry\": {\"$geoWithin\": {\"$geometry\": ' + JSON.stringify(polygon) + '}}}';
      return $http.get(service.route + '?' + params).then(function(success) {
        return success.data._items;
      });
    };

    service.loadPerNeighborhood = function(collection){
        return service.load(neighborhood).then(function(neighborhoods) {
            return Promise.all(neighborhoods.map(function(n){
                var obj = { properties : {'name': n.properties.SDEC_LIBEL}, 'geometry':n.geometry, 'type':"Feature"};
                return service.loadInPolygon(collection, n.geometry).then(function(data){
                    // Work out the density of stops per neighborhood
                    obj.properties.weight = data.length/turf.area(n.geometry);
                    return obj;
                });
            }))
        });
    };

    return service;
  });