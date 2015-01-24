/* Ruben Orduz © 2015 
   Released under MIT License */
'use strict';

angular.module('foundryApp')
  .controller('TemplateCtrl', function($scope, $rootScope, $location) {
    
    $rootScope.output = '';
    $scope.format = 'JSON';

    $scope.generate = function () {
        $scope.templateObj = {};
        $scope.templateObj['heat_template_version'] = '2014-10-16';
        $scope.templateObj['description'] = $rootScope.template['description'];
        $scope.templateObj['resources'] = {};
        $scope.templateObj['outputs'] = {};
        angular.forEach($rootScope.resources, function (res) {
            switch (res.resType) {
                case $rootScope.resourceTypes.nova:
                    $scope.addServerToTemplate($scope.templateObj, res);
                    break;
                case $rootScope.resourceTypes.lb:
                    $scope.addLBToTemplate($scope.templateObj, res);
                    break;
                case $rootScope.resourceTypes.swift:
                    $scope.addContainerToTemplate($scope.templateObj, res);
                    break;
                default:
                    break;
            };
        });
        
        $rootScope.output = JSON.stringify($scope.templateObj, null, '  ');
    };

    $scope.addServerToTemplate = function (template, res) {
        template['resources'][res.server_name] = {};
        template['resources'][res.server_name]['type'] = res.resType;
        template['resources'][res.server_name]['properties'] = {};
        template['resources'][res.server_name]['properties']['key_name'] = res.key_name;
        template['resources'][res.server_name]['properties']['image'] = res.image_name;
        template['resources'][res.server_name]['properties']['flavor'] = res.flavor_name;
        template['resources'][res.server_name]['properties']['config_drive'] = res.config_drive;
        if (res['user_data']) {
            template['resources'][res.server_name]['properties']['user_data_format'] = "RAW"
            template['resources'][res.server_name]['properties']['user_data'] = res.user_data;
        }
        template['outputs'][res.server_name + ' Output'] = {};
        template['outputs'][res.server_name + ' Output']['value'] = {get_resource: res.server_name};
        template['outputs'][res.server_name + ' Output']['description'] = 'Generated output for: ' + res.server_name;
    };
    
    $scope.addLBToTemplate = function(template, res) {
        template['resources'][res.lb_name] = {};
        template['resources'][res.lb_name]['type'] = res.resType;
        template['resources'][res.lb_name]['properties'] = {};
        template['resources'][res.lb_name]['properties']['port'] = res.port;
        template['resources'][res.lb_name]['properties']['protocol'] = res.protocol;
        template['resources'][res.lb_name]['properties']['algorithm'] = res.algorithm;
        template['resources'][res.lb_name]['properties']['nodes'] = [];
        angular.forEach(res.nodes, function (node) {
            var n = {addresses: [{
            get_attr: [node.server_name, 'accessIPv4']}], 
            port: 80
            };
            template['resources'][res.lb_name]['properties']['nodes'].push(n);
        });
        template['resources'][res.lb_name]['properties']['virtualIps'] = [{
            ipVersion: 'IPV4',
            type: 'PUBLIC'
        }];
    };

    $scope.addContainerToTemplate = function (template, res) {
        template['resources'][res.container_name]                                       = {};
        template['resources'][res.container_name]['type']                               = res.resType;
        template['resources'][res.container_name]['properties']                         = {};
        template['resources'][res.container_name]['properties']['name']                 = res.container_name;
        template['resources'][res.container_name]['properties']['X-Container-Read']     = res.aclRead || '';
        template['resources'][res.container_name]['properties']['X-Container-Write']    = res.aclWrite || '';
    };

    $scope.getJSON = function () {
        $scope.format = 'JSON';
        $rootScope.output = JSON.stringify($scope.templateObj, null, '  ');
    };

    $scope.getYAML = function () {
        $scope.format = 'YAML';
        $rootScope.output = jsyaml.safeDump($scope.templateObj);
    };

    $scope.saveToFile = function () {
        
        var blob = new window.Blob(
            [$scope.output],
            {type: '"application/'+ $scope.format.toLowerCase() + ';charset=' + document.characterSet});
            saveAs(
                blob,
                $rootScope.template['description'] + '.' + $scope.format.toLowerCase()
                );
            
    };

    $scope.confirmCopy = function () {
        alert('Template has been copied to your clipboard!');
    };

    $scope.back = function () {
        $location.path('/resources');
    }

    //init and display
    $scope.generate();
});