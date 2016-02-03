'use strict';

angular.module('MongoApi', ['Criterias'])
  .factory('MongoApiSvc', function ($http, CriteriasSvc) {
    var service = {};
    service.route = "http://127.0.0.1:5000/";

    service.load = function(collection) {
      return $http.get(service.route + collection).then(function(success) {
        return success.data._items;
      });
    };

    service.loadInPolygon = function(collection, polygon) {
      var params = 'where={\"geometry\": {\"$geoWithin\": {\"$geometry\": ' + JSON.stringify(polygon) + '}}}';
      return $http.get(service.route + '?' + params).then(function(success) {
        return success.data._items;
      });
    };

    service.loadPerNeighborhood = function(weightProperty){

      return service.load('neighborhood').then(function(neighborhoods) {
        return Promise.all(neighborhoods.map(function(n){
          var area =  turf.area(n.geometry);
          var obj = { 'properties' :
                      {
                        'name': n.properties.SDEC_LIBEL,
                        'autocar_count' : n.properties.autocar_count / area,
                        'bus_count' : n.properties.bus_count / area,
                        'citelib_count' : n.properties.citelib_count / area,
                        'gsm_2g_count' : n.properties.gsm_2g_count / area,
                        'gsm_3g_count' : n.properties.gsm_3g_count / area,
                        'gsm_4g_count' : n.properties.gsm_4g_count / area,
                        'sncf_count' : n.properties.sncf_count / area,
                        'tram_count' : n.properties.tram_count / area,
                        'cyclelane_length' : n.properties.cyclelane_length / area,
                      },
                      'geometry':n.geometry,
                      'type':"Feature"
                    };
        
          return obj;
        }));
      });
    };

    /**
    * @return all the neighborhoods with their geometry and properties. 
    *  The function also adds a property "weight, for each neighborhood.
    *  The property weight computed depends on the value of the 
    *  attribute "weightProperty" (see computeWeightAttribute()).
    **/
    service.relativeLoadPerNeighborhood = function(weightProperty) {
      return service.loadPerNeighborhood(weightProperty).then(function(neighborhoods) {
        if(neighborhoods.length > 0){
          // For each prop, except name, we normalize the data and add the weight field
          var len = Object.keys(neighborhoods[0].properties).length;
          for(var i= 0; i <= len; ++i){
            var propertyKey = Object.keys(neighborhoods[0].properties)[i];
            if(propertyKey !== "name"){
              neighborhoods = normalizeProperty(neighborhoods, propertyKey);
              neighborhoods = computeWeightProperty(neighborhoods, weightProperty);
            }
          }
        }

        return neighborhoods;
      });
    };

    /**
    * @return the neighborhoods with a weight property according to the "weightProperty" value.
    * @param weightProperty: can be either a property name, OR an object with the names 
    *   of the different properties as keys and a boolean as value (ex: {'prop1': true, 'prop2': false}).
    */
    var computeWeightProperty = function(neighborhoods, weightProperty){
      // Work out the density of stops per neighborhood
      _.each(neighborhoods, function(neighborhood){
          if(weightProperty !== undefined) {
            if(weightProperty !== null && typeof weightProperty === 'object'){

              neighborhood.properties.weight = 0;

              var nb = 0;
              for(var i= 0; i <= Object.keys(weightProperty).length; ++i){
                var propKey = Object.keys(weightProperty)[i];
                if(propKey !== "name" && weightProperty[propKey] === true){
                  neighborhood.properties.weight += neighborhood.properties[propKey];
                  ++nb;
                }
              }

              if(nb > 0){
                neighborhood.properties.weight /= nb;
              }

            } else {
              neighborhood.properties.weight = neighborhood.properties[weightProperty];
            }
          }
      });

      return neighborhoods;
    }

    /**
    * @return the neighborhoods. Each neighborhood has its property "propertyKey" normalized.
    * @param propertyKey: corresponds to the name of the property
    */
    var normalizeProperty = function(neighborhoods, propertyKey){
      var max_weight = _.maxBy(neighborhoods, function (o) {
          return o.properties[propertyKey]
        }).properties[propertyKey];

      var factor = 100/max_weight;
      _.each(neighborhoods, function(neighborhood) {
        neighborhood.properties[propertyKey] = factor * neighborhood.properties[propertyKey];
      });

      return neighborhoods;
    };

    return service;
  });