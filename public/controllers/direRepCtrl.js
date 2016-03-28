app.controller('direRepCtrl',function($scope, getEmployeeService, $routeParams){
	var reportArr = $routeParams.reportStr.split(",");
	$scope.reports = [];

	function getReports(arr,emplArr){
		for (var i = 0; i < arr.length; i++) {
			angular.forEach(emplArr, function(empl) {
				if(empl._id == arr[i]) {
					$scope.reports.push(empl);
				}
			});
		}
	};

	getEmployeeService.getEmployees()
	.then(function(res){
		getReports(reportArr,res.data);
	},
	function(res) {
		console.log('Error '+res);
	});

	$scope.goToBack = function(){
		window.history.back();
	}

});