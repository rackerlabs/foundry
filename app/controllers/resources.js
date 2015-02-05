/* Ruben Orduz © 2015 
   Released under MIT License */
   
'use strict';

angular.module('foundryApp')
  .controller('ResourcesCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    /* data to populate dropdowns */
    $scope.images   =   
        {
            "ea98e34c-7a25-4670-9e2a-7fa9815f6c9f": "Fedora 21 (PVHVM)",
            "df924994-b686-449a-86e3-1876998022aa": "Arch 2014.10 (PVHVM)",
            "59addab2-1551-4949-b635-bc88f1b6dc7c": "OpenSUSE 13.1 (PVHVM)",
            "0766e5df-d60a-4100-ae8c-07f27ec0148f": "Ubuntu 14.10 (Utopic Unicorn) (PVHVM)"
        };
    $scope.flavors  =
        {
            "general1-1": "1 GB General Purpose v1",
            "general1-2": "2 GB General Purpose v1",
            "io1-15": "15 GB I/O v1",
            "io1-30": "30 GB I/O v1"
        };
    $scope.algorithms = [
        'LEAST_CONNECTIONS',
        'RANDOM',
        'ROUND_ROBIN'
    ];
    $scope.protocols = [
        'HTTP',
        'HTTPS'
    ];
    $scope.caching = [
        'ENABLED',
        'DISABLED'
    ];
    /* end dropdown data */


    $scope.server       = {};
    $scope.lb           = {};
    $scope.lb.nodes     = [];
    $scope.db           = {};
    $scope.container    = {};

    $scope.addServer = function () {
        var srvrObj = {};
        srvrObj['resType']      = $rootScope.resourceTypes.nova;
        srvrObj['server_name']  = $scope.server.server_name;
        srvrObj['key_name']     = $scope.server.key_name;
        srvrObj['image_name']   = $scope.server.image_name;
        srvrObj['flavor_name']  = $scope.server.flavor_name;
        srvrObj['user_data']    = $scope.server.user_data;
        srvrObj['config_drive'] = true;
        $rootScope.servers.push(srvrObj);   
        $rootScope.resources.push(srvrObj);
        $scope.resetModel('srv');
    };

    $scope.select = function (index) {
        $rootScope.servers[index].clicked = true;
        $scope.lb.nodes.push($rootScope.servers[index]);
    };

    $scope.addLB = function () {
        //console.dir($scope.lb);
        var lbObj           = {};
        lbObj['resType']    = $rootScope.resourceTypes.lb;
        lbObj['lb_name']    = $scope.lb.lbname;
        lbObj['port']       = $scope.lb.port;
        lbObj['protocol']   = $scope.lb.protocol;
        lbObj['algorithm']  = $scope.lb.algorithm;
        lbObj['nodes']      = $scope.lb.nodes;
        $rootScope.lbs.push(lbObj);   
        $rootScope.resources.push(lbObj);
        $scope.resetModel('lb');
    };

    $scope.addContainer = function () {
        var cntObj                  = {};
        cntObj['resType']           = $rootScope.resourceTypes.swift;
        cntObj['container_name']    = $scope.container.container_name;
        //cntObj['CDN']               = $scope.container.CDN; // not currently possible via Orchestration
        cntObj['aclRead']           = $scope.container.aclRead;
        cntObj['aclWrite']          = $scope.container.aclWrite;
        $rootScope.containers.push(cntObj);
        $rootScope.resources.push(cntObj);
        $scope.resetModel('swift');
    };

    $scope.addDBaaS = function () {
        $scope.resetModel('dbaas');
    };

    $scope.createTemplate = function () {
        $location.path('/template');
    };

    $scope.resetModel = function (res) {
        switch (res) {
            case 'srv':
                $scope.server = {};
                $scope.serverform = null;
                break;
            case 'lb':
                $scope.lb = {};
                $scope.lbform = null;
                break;
            case 'swift':
                $scope.container = {};
                $scope.swiftform = null;
                break;
            case 'dbaas':
                $scope.db = {};
                $scope.dbaasform = null;
            default:
                break; 
        };
    };
    
}]);