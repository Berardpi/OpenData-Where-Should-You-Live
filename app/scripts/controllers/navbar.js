"use strict";

angular.module('Navbar', [])
  .controller('NavbarCtrl', function ($scope, $location) {

	$scope.isCurrent = function (navActive) {
    return navActive === $location.path();
  };

});