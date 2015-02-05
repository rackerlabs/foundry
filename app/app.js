/* Ruben Orduz © 2015 
   Released under MIT License */
'use strict';

angular.module('foundryApp', 
  ['ngRoute', 'ngClipboard'])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/views/main.html',
      controller: 'MainCtrl'
    })
    .when('/resources', {
      templateUrl: 'app/views/resources.html',
      controller: 'ResourcesCtrl'
    })
    .when('/template', {
      templateUrl: 'app/views/template.html',
      controller: 'TemplateCtrl'
    });
})
.config(['ngClipProvider', function(ngClipProvider) {
  ngClipProvider.setPath("//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf");
}]);