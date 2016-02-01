'use strict';

angular.module('Citelib', [])
  .factory('CitelibSvc', function ($http) {
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

    return service;
  });