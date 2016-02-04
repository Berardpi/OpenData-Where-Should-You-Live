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
          'name': 'Nom',
    };

    var unite = {
      'autocar_count' : ' arret(s)',
      'bus_count' : ' arret(s)',
      'citelib_count' : ' station(s)',
      'gsm_2g_count' : ' antenne(s)',
      'gsm_3g_count' : ' antenne(s)',
      'gsm_4g_count' : ' antenne(s)',
      'sncf_count' : ' quai(s)',
      'tram_count' : ' arret(s)',
      'cyclelane_length' : 'm',
    }

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
                      };

    service.getDimensions = function(){
      return dimensions;
    };

    service.getTrad = function(dim){
      return trad[dim];
    }

    service.getUnite = function(dim) {
      return unite[dim];
    }

    service.getKey = function(i){
      return Object.keys(dimensions)[i];
    };

    return service;
  });
