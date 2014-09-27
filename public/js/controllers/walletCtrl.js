angular.module('walletController', [])

	// inject the Wallet service factory into our controller
	.controller('walletController', ['$scope','$http','Amounts', function($scope, $http, Amounts) {
		$scope.formData = {};
		$scope.loading = true;
		$scope.total = 0;

		// GET =====================================================================
		// when landing on the page, get all Amounts and show them
		// use the service to get all the Amounts
		Amounts.get()
			.success(function(data) {
				$scope.amounts = data.amounts;
				$scope.total = data.total;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the amount to the node API
		$scope.createAmount = function() {
			$scope.loading = true;

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.amount != undefined) {

				// call the create function from our service (returns a promise object)
				Amounts.create($scope.formData)

					// if successful creation, call our get function to get all the new amounts
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.amounts = data.amounts; // assign our new list of amounts
						$scope.total = data.total;
					});
			}
		};

		// DELETE ==================================================================
		// delete a amount after checking it
		$scope.deleteAmount = function(id) {
			$scope.loading = true;

			Amounts.delete(id)
				// if successful creation, call our get function to get all the new Amounts
				.success(function(data) {
					$scope.loading = false;
					$scope.amounts = data.amounts; // assign our new list of amounts
					$scope.total = data.total;
				});
		};
		
	}]);