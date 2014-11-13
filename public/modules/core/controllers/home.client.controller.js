'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        $scope.alerts = [
            {
                icon: 'glyphicon-user',
                colour:'btn-success',
                total:'9',
                description: ''
            },
            {
                icon: 'glyphicon-user',
                colour:'btn-success',
                total:'9',
                description: ''
            },
            {
                icon: 'glyphicon-user',
                colour:'btn-success',
                total:'9',
                description: ''
            },
            {
                icon: 'glyphicon-user',
                colour:'btn-success',
                total:'9',
                description: ''
            }
        ];
	}
]);