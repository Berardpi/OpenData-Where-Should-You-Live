'use strict';

angular.module('Neighborhood', [])
  .factory('NeighborhoodSvc', function ($http) {
    var service = {};
    service.route = "http://127.0.0.1:5000/neighborhood";
    service.data = {};

    service.load = function() {
      $http.get(service.route).then(function(success) {
        return angular.copy(success.data, service.data);
      });
      return service.data
    };

    return service;
  });