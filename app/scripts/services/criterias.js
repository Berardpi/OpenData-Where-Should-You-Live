'use strict';

angular.module('Criterias')
  .factory('CriteriasSvc', function () {
    var service = {};

    var trad = {
          'autocar_count' : 'Autocars',
          'bus_count' : 'Bus',
          'citelib_count' : 'Citelibs',
          'gsm_2g_count' : '2G',
          'gsm_3g_count' : '3G',
          'gsm_4g_count' : '4G',
          'sncf_count' : 'SNCF',
          'tram_count' : 'Tram',
          'cyclelane_length' : 'Vélo voies',
          'supermarket_count' : 'Supermarchés',
          'restaurant_count' : 'Restaurants',
          'name': 'Nom',
    };

    var dimensions = {       
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
                        'supermarket_count' : false,
                        'restaurant_count' : false,
                      };

    service.getDimensions = function(){
      return dimensions;
    };

    service.getTrad = function(dim){
      return trad[dim];
    }

    service.getKey = function(i){
      return Object.keys(dimensions)[i];
    };

    return service;
  });
