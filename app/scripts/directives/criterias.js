"use strict";

angular.module('Criterias', [])
.directive('criterias', function($parse, $window, CriteriasSvc) {
   return{
      restrict:'EA',
      scope: {
      	data: '=data',
      	dimensions: '=dimensions',
      	load: '&',
      },
      templateUrl: '../../views/criterias.html',
      link: function(scope, elem, attrs){

      	scope.formtype = attrs.formtype;
      	scope.getTrad = CriteriasSvc.getTrad;
      	scope.getKey = CriteriasSvc.getKey;

		    // Init dimensions
		    scope.dimensions = CriteriasSvc.getDimensions();
      }
   }
});