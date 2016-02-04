"use strict";

angular.module('ParallelCoordinates', ['MongoApi', 'Criterias'])
  .controller('ParallelCoordinatesCtrl', function ($scope, MongoApiSvc, CriteriasSvc) {
    $scope.crit = {};
    $scope.crit.criteria = CriteriasSvc.getKey(1);
    $scope.criterias = {};

    $scope.data = {}
    $scope.data.dimensions = CriteriasSvc.getDimensions();
    $scope.data.data = [];

    $scope.getKey = function(i){
      return Object.keys($scope.data.dimensions)[i];
    };



    $scope.loadData = function(){
      MongoApiSvc.relativeLoadPerNeighborhood($scope.data.dimensions).then(function (success) {
        if(success != undefined && success.length > 0){
          $scope.data.data = success;
        }
      });
    };

    $scope.loadData();

  });
