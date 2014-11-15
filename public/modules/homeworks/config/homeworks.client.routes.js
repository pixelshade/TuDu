'use strict';

//Setting up route
angular.module('homeworks').config(['$stateProvider',
	function($stateProvider) {
		// Homeworks state routing
		$stateProvider.
		state('listHomeworks', {
			url: '/homeworks',
			templateUrl: 'modules/homeworks/views/list-homeworks.client.view.html'
		}).
		state('createHomework', {
			url: '/homeworks/create',
			templateUrl: 'modules/homeworks/views/create-homework.client.view.html'
		}).
		state('viewHomework', {
			url: '/homeworks/:homeworkId',
			templateUrl: 'modules/homeworks/views/view-homework.client.view.html'
		}).
		state('editHomework', {
			url: '/homeworks/:homeworkId/edit',
			templateUrl: 'modules/homeworks/views/edit-homework.client.view.html'
		});
	}
]);