'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Homework = mongoose.model('Homework'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, homework;

/**
 * Homework routes tests
 */
describe('Homework CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Homework
		user.save(function() {
			homework = {
				name: 'Homework Name'
			};

			done();
		});
	});

	it('should be able to save Homework instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Homework
				agent.post('/homeworks')
					.send(homework)
					.expect(200)
					.end(function(homeworkSaveErr, homeworkSaveRes) {
						// Handle Homework save error
						if (homeworkSaveErr) done(homeworkSaveErr);

						// Get a list of Homeworks
						agent.get('/homeworks')
							.end(function(homeworksGetErr, homeworksGetRes) {
								// Handle Homework save error
								if (homeworksGetErr) done(homeworksGetErr);

								// Get Homeworks list
								var homeworks = homeworksGetRes.body;

								// Set assertions
								(homeworks[0].user._id).should.equal(userId);
								(homeworks[0].name).should.match('Homework Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Homework instance if not logged in', function(done) {
		agent.post('/homeworks')
			.send(homework)
			.expect(401)
			.end(function(homeworkSaveErr, homeworkSaveRes) {
				// Call the assertion callback
				done(homeworkSaveErr);
			});
	});

	it('should not be able to save Homework instance if no name is provided', function(done) {
		// Invalidate name field
		homework.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Homework
				agent.post('/homeworks')
					.send(homework)
					.expect(400)
					.end(function(homeworkSaveErr, homeworkSaveRes) {
						// Set message assertion
						(homeworkSaveRes.body.message).should.match('Please fill Homework name');
						
						// Handle Homework save error
						done(homeworkSaveErr);
					});
			});
	});

	it('should be able to update Homework instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Homework
				agent.post('/homeworks')
					.send(homework)
					.expect(200)
					.end(function(homeworkSaveErr, homeworkSaveRes) {
						// Handle Homework save error
						if (homeworkSaveErr) done(homeworkSaveErr);

						// Update Homework name
						homework.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Homework
						agent.put('/homeworks/' + homeworkSaveRes.body._id)
							.send(homework)
							.expect(200)
							.end(function(homeworkUpdateErr, homeworkUpdateRes) {
								// Handle Homework update error
								if (homeworkUpdateErr) done(homeworkUpdateErr);

								// Set assertions
								(homeworkUpdateRes.body._id).should.equal(homeworkSaveRes.body._id);
								(homeworkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Homeworks if not signed in', function(done) {
		// Create new Homework model instance
		var homeworkObj = new Homework(homework);

		// Save the Homework
		homeworkObj.save(function() {
			// Request Homeworks
			request(app).get('/homeworks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Homework if not signed in', function(done) {
		// Create new Homework model instance
		var homeworkObj = new Homework(homework);

		// Save the Homework
		homeworkObj.save(function() {
			request(app).get('/homeworks/' + homeworkObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', homework.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Homework instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Homework
				agent.post('/homeworks')
					.send(homework)
					.expect(200)
					.end(function(homeworkSaveErr, homeworkSaveRes) {
						// Handle Homework save error
						if (homeworkSaveErr) done(homeworkSaveErr);

						// Delete existing Homework
						agent.delete('/homeworks/' + homeworkSaveRes.body._id)
							.send(homework)
							.expect(200)
							.end(function(homeworkDeleteErr, homeworkDeleteRes) {
								// Handle Homework error error
								if (homeworkDeleteErr) done(homeworkDeleteErr);

								// Set assertions
								(homeworkDeleteRes.body._id).should.equal(homeworkSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Homework instance if not signed in', function(done) {
		// Set Homework user 
		homework.user = user;

		// Create new Homework model instance
		var homeworkObj = new Homework(homework);

		// Save the Homework
		homeworkObj.save(function() {
			// Try deleting Homework
			request(app).delete('/homeworks/' + homeworkObj._id)
			.expect(401)
			.end(function(homeworkDeleteErr, homeworkDeleteRes) {
				// Set message assertion
				(homeworkDeleteRes.body.message).should.match('User is not logged in');

				// Handle Homework error error
				done(homeworkDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Homework.remove().exec();
		done();
	});
});