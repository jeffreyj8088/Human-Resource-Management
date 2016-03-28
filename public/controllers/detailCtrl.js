app.controller('detailCtrl',function($scope, getEmployeeService, $routeParams, $location){

	var locate = $routeParams.loc,
		empID = $routeParams.empID;

	getEmployeeService.getEmployee(empID)
		.then(function(res){
			$scope.employee = res.data;
		}, function(res) {
			console.log('Error - get Employee. '+res);
		});

	$scope.editEmply = function(id) {
		isEdit = true;
		$location.path("/edit/"+id);
	};

	$scope.delEmply = function(id) {
		var mid = $scope.employee.Manager._id || null,
			emplyData = {
						'Manager'  : mid,
						'reportTo' : $scope.employee.reportTo
					};
		getEmployeeService.updateManager(emplyData).then(function() {
			getEmployeeService.deleteEmployee(id).then(function() {
	            $location.path("/");
	        }); 
		});
		
	};

	$scope.goToBack = function(){
		if(locate == '0'){
			window.history.back();
		} else {
			$location.path("/");
		}
	}
});
