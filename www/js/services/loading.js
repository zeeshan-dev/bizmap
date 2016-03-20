app.service('Loading', ['$ionicLoading', function($ionicLoading) {

	/**
	 * Constructor, with class name
	 */
	function Loading () {
		
	}

	Loading.prototype.show = function () {
		
		$ionicLoading.show({
	      template: '<ion-spinner icon="android"></ion-spinner>',
	      noBackdrop: true
    	});
	}

	Loading.prototype.hide = function () {
		$ionicLoading.hide();
	}

	return new Loading();

}]);