"use strict";

angular.module('Bar', ['MongoApi'])
  .controller('BarCtrl', function ($scope, $routeParams, MongoApiSvc) {

    $scope.data = [];

    $scope.loadData = function(){
      console.log("loadData");

      MongoApiSvc.load('neighborhood').then(function(data){
        $scope.data = data;
        // if ($routeParams.nghb) {
        //   console.log($routeParams.nghb);
        //   });
        // } else {
          $scope.currentNeighborhood = $scope.data[0];
        // }
      });
    }

    $scope.loadData();

  });