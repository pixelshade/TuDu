'use strict';

(function() {
	// Homeworks Controller Spec
	describe('Homeworks Controller Tests', function() {
		// Initialize global variables
		var HomeworksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Homeworks controller.
			HomeworksController = $controller('HomeworksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Homework object fetched from XHR', inject(function(Homeworks) {
			// Create sample Homework using the Homeworks service
			var sampleHomework = new Homeworks({
				name: 'New Homework'
			});

			// Create a sample Homeworks array that includes the new Homework
			var sampleHomeworks = [sampleHomework];

			// Set GET response
			$httpBackend.expectGET('homeworks').respond(sampleHomeworks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.homeworks).toEqualData(sampleHomeworks);
		}));

		it('$scope.findOne() should create an array with one Homework object fetched from XHR using a homeworkId URL parameter', inject(function(Homeworks) {
			// Define a sample Homework object
			var sampleHomework = new Homeworks({
				name: 'New Homework'
			});

			// Set the URL parameter
			$stateParams.homeworkId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/homeworks\/([0-9a-fA-F]{24})$/).respond(sampleHomework);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.homework).toEqualData(sampleHomework);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Homeworks) {
			// Create a sample Homework object
			var sampleHomeworkPostData = new Homeworks({
				name: 'New Homework'
			});

			// Create a sample Homework response
			var sampleHomeworkResponse = new Homeworks({
				_id: '525cf20451979dea2c000001',
				name: 'New Homework'
			});

			// Fixture mock form input values
			scope.name = 'New Homework';

			// Set POST response
			$httpBackend.expectPOST('homeworks', sampleHomeworkPostData).respond(sampleHomeworkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Homework was created
			expect($location.path()).toBe('/homeworks/' + sampleHomeworkResponse._id);
		}));

		it('$scope.update() should update a valid Homework', inject(function(Homeworks) {
			// Define a sample Homework put data
			var sampleHomeworkPutData = new Homeworks({
				_id: '525cf20451979dea2c000001',
				name: 'New Homework'
			});

			// Mock Homework in scope
			scope.homework = sampleHomeworkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/homeworks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/homeworks/' + sampleHomeworkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid homeworkId and remove the Homework from the scope', inject(function(Homeworks) {
			// Create new Homework object
			var sampleHomework = new Homeworks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Homeworks array and include the Homework
			scope.homeworks = [sampleHomework];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/homeworks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHomework);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.homeworks.length).toBe(0);
		}));
	});
}());