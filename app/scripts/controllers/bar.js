"use strict";

angular.module('Bar', ['MongoApi'])
  .controller('BarCtrl', function ($scope, MongoApiSvc) {

    $scope.data = [];

    $scope.loadData = function(){
      console.log("loadData");

      MongoApiSvc.load('neighborhood').then(function(data){
        $scope.data = data;
        $scope.currentNeighborhood = $scope.data[0];
      });
    }


    $scope.loadData();

  });