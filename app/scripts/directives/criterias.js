"use strict";

angular.module('Criterias', [])
.directive('criterias', function($parse, $window) {
   return{
      restrict:'EA',
      scope: {
      	data: '=data',
      	dimensions: '=dimensions',
      	load: '&',
      },
      templateUrl: '../../views/criterias.html',
      link: function(scope, elem, attrs){
      		//scope.data = {};
      		//scope.data.criteria = attrs.criteria;

      		scope.formtype = attrs.formtype;
      	    scope.trad = {
		      'autocar_count' : 'Autocars',
		      'bus_count' : 'Bus',
		      'citelib_count' : 'Citelibs',
		      'gsm_2g_count' : '2G',
		      'gsm_3g_count' : '3G',
		      'gsm_4g_count' : '4G',
		      'sncf_count' : 'SNCF',
		      'tram_count' : 'Tram',
		      'cyclelane_length' : 'Vélo voies',
		    };

		    // Init dimensions
		    scope.dimensions = {       
                        'name' : true,            
                        'autocar_count' : false,
                        'bus_count' : false,
                        'citelib_count' : false,
                        'gsm_2g_count' : false,
                        'gsm_3g_count' : false,
                        'gsm_4g_count' : false,
                        'sncf_count' : false,
                        'tram_count' : false,
                        'cyclelane_length' : false,
            };

            scope.getKey = function(i){
		      return Object.keys(scope.dimensions)[i];
		    };
      }
   }
});