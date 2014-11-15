'use strict';

//Homeworks service used to communicate Homeworks REST endpoints
angular.module('homeworks').factory('Homeworks', ['$resource',
	function($resource) {
		return $resource('homeworks/:homeworkId', { homeworkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);