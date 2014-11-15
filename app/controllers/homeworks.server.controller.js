'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Homework = mongoose.model('Homework'),
	_ = require('lodash');

/**
 * Create a Homework
 */
exports.create = function(req, res) {
	var homework = new Homework(req.body);
	homework.user = req.user;

	homework.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(homework);
		}
	});
};

/**
 * Show the current Homework
 */
exports.read = function(req, res) {
	res.jsonp(req.homework);
};

/**
 * Update a Homework
 */
exports.update = function(req, res) {
	var homework = req.homework ;

	homework = _.extend(homework , req.body);

	homework.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(homework);
		}
	});
};

/**
 * Delete an Homework
 */
exports.delete = function(req, res) {
	var homework = req.homework ;

	homework.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(homework);
		}
	});
};

/**
 * List of Homeworks
 */
exports.list = function(req, res) { 
	Homework.find().sort('-created').populate('user', 'displayName').exec(function(err, homeworks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(homeworks);
		}
	});
};

/**
 * Homework middleware
 */
exports.homeworkByID = function(req, res, next, id) { 
	Homework.findById(id).populate('user', 'displayName').exec(function(err, homework) {
		if (err) return next(err);
		if (! homework) return next(new Error('Failed to load Homework ' + id));
		req.homework = homework ;
		next();
	});
};

/**
 * Homework authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.homework.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
