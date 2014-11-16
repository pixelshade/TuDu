'use strict';

// Homeworks controller

var homeworksApp = angular.module('homeworks');





homeworksApp.controller('HomeworksListController', ['$scope', '$stateParams', '$location', 'Authentication', 'Homeworks',
    function($scope, $stateParams, $location, Authentication, Homeworks){

    // Find a list of Homeworks
    $scope.find = function() {
        $scope.homeworks = Homeworks.query();
        var millisNow = new Date().getTime();

        $scope.homeworks.$promise.then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    var deadMs = new Date(data[i].deadline).getTime();
                    var crMs =  new Date(data[i].created).getTime();
                    data[i].percentage = deadMs - crMs === 0 ? 0 : millisNow / (deadMs - crMs);
                    data[i].daysLeft = Math.round((new Date(data[i].deadline).getTime() - millisNow) / (24*1000*60*60));
                }
            });

    };

}]);



homeworksApp.controller('HomeworksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Homeworks', 'Courses',
	function($scope, $stateParams, $location, Authentication, Homeworks, Courses) {
        $scope.authentication = Authentication;


        $scope.courses = Courses.query();



		// Create new Homework
		$scope.create = function() {
			// Create new Homework object
			var homework = new Homeworks ({
				name: this.name,
                description: this.description,
                url: this.url,
                deadline: this.deadline,
                course : this.course
			});

			// Redirect after save
			homework.$save(function(response) {
				$location.path('homeworks/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.description = '';
                $scope.url = '';
                $scope.deadline = '';
//                $scope.course = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Homework
		$scope.remove = function(homework) {
			if ( homework ) { 
				homework.$remove();

				for (var i in $scope.homeworks) {
					if ($scope.homeworks [i] === homework) {
						$scope.homeworks.splice(i, 1);
					}
				}
			} else {
				$scope.homework.$remove(function() {
					$location.path('homeworks');
				});
			}
		};

		// Update existing Homework
		$scope.update = function() {
			var homework = $scope.homework;

			homework.$update(function() {
				$location.path('homeworks/' + homework._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Homework
		$scope.findOne = function() {
			$scope.homework = Homeworks.get({ 
				homeworkId: $stateParams.homeworkId
			});
		};
	}
]);


homeworksApp.controller('DatepickerCtrl', function ($scope) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
});