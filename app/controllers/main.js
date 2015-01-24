/* Ruben Orduz © 2015 
   Released under MIT License */

'use strict';

angular.module('foundryApp')
  .controller('MainCtrl', function($scope, $rootScope, $location) {

    $scope.init = function () {
        if (!$rootScope.template) {
            $rootScope.template = {};
        }
        $rootScope.template['version'] = '2014-10-16'
        $rootScope.template['description'] = $scope.stack_descr;
        $rootScope.servers      = [];
        $rootScope.lbs          = [];
        $rootScope.containers   = [];
        $rootScope.resources    = [];
    };

    $scope.addResources = function () {
        $scope.init();
        $location.path('/resources');
    };

    $rootScope.reset = function () {
        if(confirm('Warning: all resources will be deleted.')) {
            $rootScope.template     = {};
            $rootScope.servers      = [];
            $rootScope.lbs          = [];
            $rootScope.resources    = [];
            $rootScope.containers   = [];
            $location.path('/');
        }
    };
});