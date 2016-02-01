'use strict';

angular.module('Neighborhood', [])
  .factory('NeighborhoodSvc', function ($http) {
    var service = {};
    service.route = "http://127.0.0.1:5000/neighborhood";
    service.data = {};

    service.load = function() {
      return $http.get(service.route).then(function(success) {
        return success.data
      });
    };

    return service;
  });