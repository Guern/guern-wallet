angular.module('walletController', [])

	// inject the Wallet service factory into our controller
	.controller('walletController', ['$scope','$http','Amounts', function($scope, $http, Amounts) {
		$scope.formData = {};
		$scope.loading = true;
		$scope.total = 0;
		$scope.currency = {
			options: [
				{ label: '£', value: '£' },
				{ label: '€', value: '€' },
				{ label: '$', value: '$' }
			]
		}
		//$scope.currency.select = $scope.currency.options[0];

		// GET =====================================================================
		// when landing on the page, get all Amounts and show them
		// use the service to get all the Amounts
		Amounts.get()
			.success(function(data) {
				$scope.amounts = data.amounts;
				$scope.total = data.total;
				$scope.currency.select = getCurrency(data.currency);
				$scope.change = data.change;
				$scope.convertTotal();
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the amount to the node API
		$scope.createAmount = function() {
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.amount != undefined &&
				!isNaN($scope.formData.amount)) {
			
				// TODO: if it is not a number return
			
				$scope.loading = true;
				$scope.formData.currency = $scope.currency.select.value;
				$scope.formData.date = new Date().toLocaleDateString();
				
				// call the create function from our service (returns a promise object)
				Amounts.create($scope.formData)

					// if successful creation, call our get function to get all the new amounts
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.amounts = data.amounts; // assign our new list of amounts
						$scope.total = data.total;
						$scope.change = data.change;
						$scope.convertTotal();
					});
			} else {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$(".alert").show().delay(1500).fadeOut();
			}
		};

		// DELETE ==================================================================
		// delete all amounts
		$scope.resetWallet = function(id) {
			$scope.loading = true;

			Amounts.delete()
				// if successful creation, call our get function to get all the new Amounts
				.success(function(data) {
					$scope.loading = false;
					$scope.amounts = {}; // assign our new list of amounts
					$scope.total = 0;
					$scope.currency.select = getCurrency('£');
				});
		};
		
		// calculate total in the current currency
		$scope.convertTotal = function() {
			$scope.evalTotal = $scope.total/$scope.change[$scope.currency.select.value];
		};
		
		// get the currency object in select format
		function getCurrency(c) {
			var opts = $scope.currency.options;
			
			for (var i = 0; i < opts.length; i ++) {
				if (opts[i].label.indexOf(c) == 0)
					return opts[i];
			}
			
			return opts[0];
		}
		
	}]);