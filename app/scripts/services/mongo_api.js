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
      return service.load('neighborhood').then(function(neighborhoods) {
        return Promise.all(neighborhoods.map(function(n){
          var area =  turf.area(n.geometry);
          var obj = { 'properties' : 
                      { 
                        'name': n.properties.SDEC_LIBEL,
                        'autocar_count' : n.properties.autocar_count / area,
                        'bus_count' : n.properties.bus_count / area,
                        'citelib_count' : n.properties.citelib_count / area,
                        'gsm_2g_count' : n.properties.gsm_2g_count / area,
                        'gsm_3g_count' : n.properties.gsm_3g_count / area,
                        'gsm_4g_count' : n.properties.gsm_4g_count / area,
                        'sncf_count' : n.properties.sncf_count / area,
                        'tram_count' : n.properties.tram_count / area,
                        'cyclelane_length' : n.properties.cyclelane_length / area,
                      }, 
                      'geometry':n.geometry, 
                      'type': n.type
                    };
          // Work out the density of stops per neighborhood

          switch(collection) {
              case 'gsm':
                  obj.properties.weight = (n.properties.gsm_4g_count + n.properties.gsm_3g_count + n.properties.gsm_2g_count)/turf.area(n.geometry);
                  break;
              case 'stop':
                  obj.properties.weight = (n.properties.bus_count + n.properties.tram_count)/turf.area(n.geometry);
                  break;
              case 'citelib':
                  obj.properties.weight = n.properties.citelib_count/turf.area(n.geometry);
                  break;
              case 'cyclelane':
                  obj.properties.weight = n.properties.cyclelane_length/turf.area(n.geometry);
                  break;
              default:
                  break;
          }

          return obj;
        }));
      });
    };

    return service;
  });