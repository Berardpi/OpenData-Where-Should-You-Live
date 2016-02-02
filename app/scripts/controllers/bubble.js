"use strict";

angular.module('Bubble',['MongoApi'])
  .controller('BubbleCtrl', function ($scope, MongoApiSvc) {

    $scope.criteria = "cyclelane";
    $scope.criteriaTraduc = {
      'cyclelane' : 'Vélo voies',
      'stop' : 'Arrêts de tram',
      'citelib' : 'Citélib',
      'gsm' : 'GSM'
    }
    $scope.data = [];

    MongoApiSvc.loadPerNeighborhood('cyclelane').then(function(data) {
      $scope.data = data;
    });

    $scope.loadData = function(){
      console.log("loadData");
      MongoApiSvc.loadPerNeighborhood($scope.criteria).then(function(data){
        $scope.data = data;
      });
    }

  });
