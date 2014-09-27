angular.module('walletService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Amounts', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/amounts');
			},
			create : function(data) {
				return $http.post('/api/amounts', data);
			},
			delete : function() {
				return $http.delete('/api/amounts/');
			}
		}
	}]);