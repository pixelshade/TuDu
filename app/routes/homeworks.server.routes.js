'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var homeworks = require('../../app/controllers/homeworks.server.controller');

	// Homeworks Routes
	app.route('/homeworks')
		.get(homeworks.list)
		.post(users.requiresLogin, homeworks.create);

	app.route('/homeworks/:homeworkId')
		.get(homeworks.read)
		.put(users.requiresLogin, homeworks.hasAuthorization, homeworks.update)
		.delete(users.requiresLogin, homeworks.hasAuthorization, homeworks.delete);

	// Finish by binding the Homework middleware
	app.param('homeworkId', homeworks.homeworkByID);
};
