"use strict";

angular.module('Bubble',['MongoApi'])
  .controller('BubbleCtrl', function ($scope, $routeParams, MongoApiSvc, CriteriasSvc) {
    $scope.crit = {};
    if ($routeParams.criteria) {
      $scope.crit.criteria = $routeParams.criteria;
    } else {
      $scope.crit.criteria = CriteriasSvc.getKey(1);
    }
    $scope.criterias = {};

    $scope.data = [];

    $scope.loadData = function(){
      if($scope.crit.criteria !== undefined){
        console.log("loadData "+ JSON.stringify($scope.crit.criteria));

        MongoApiSvc.relativeLoadPerNeighborhood($scope.crit.criteria).then(function(data){
          $scope.data = data;
        });
      }
    }

    $scope.getTrad = CriteriasSvc.getTrad;

    $scope.loadData();
  });
