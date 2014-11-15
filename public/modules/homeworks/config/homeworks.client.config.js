'use strict';

// Configuring the Articles module
angular.module('homeworks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Homeworks', 'homeworks', 'dropdown', '/homeworks(/create)?');
		Menus.addSubMenuItem('topbar', 'homeworks', 'List Homeworks', 'homeworks');
		Menus.addSubMenuItem('topbar', 'homeworks', 'New Homework', 'homeworks/create');
	}
]);