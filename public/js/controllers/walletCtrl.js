angular.module('walletController', [])

	// inject the Wallet service factory into our controller
	.controller('walletController', ['$scope','$http','Amounts', function($scope, $http, Amounts) {
		$scope.formData = {};
		$scope.loading = true;
		$scope.viewType = "operations";
		$scope.total = 0;
		$scope.currency = {
			options: [
				{ label: '£', value: '£' },
				{ label: '€', value: '€' },
				{ label: '$', value: '$' }
			]
		}
		
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
			
				// Check if the amount (if negative) is greater than the total
				var amount = $scope.formData.amount;
				if (amount < 0 &&
					Math.abs(amount) > $scope.evalTotal) {
					$(".alert.too-much").show().delay(2000).fadeOut();
					return;
				}
			
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
				$(".alert.not-number").show().delay(2000).fadeOut();
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
					$scope.evalTotal = 0;
					$scope.currency.select = getCurrency('£');
				});
		};
		
		// convert total in the current currency
		$scope.convertTotal = function() {
			$scope.evalTotal = $scope.convertAmount($scope.total, $scope.currency.select.value, true);
		};
		
		// convert single amount with the given currency
		// poundsToCurrency = true if amount is in pounds and must be converted in 'currency'.
		// Otherwise, poundsToCurrency = false.
		$scope.convertAmount = function(amount, currency, poundsToCurrency) {
			if (poundsToCurrency)
				return amount/$scope.change[currency];
			else
				return amount*$scope.change[currency];
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