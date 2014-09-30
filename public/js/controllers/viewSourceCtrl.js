angular.module('viewSourceController', [])

	// simple view source controller
	.controller('viewSourceController', ['$scope', function($scope) {
			var content = $('body');
			$('div.view-source-view .html').text("" + content.html());		
	}]);