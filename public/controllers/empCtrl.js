app.controller('empCtrl',function($scope, getEmployeeService, filterFilter){
	var employeesData = [],
		counter = 0;
	$scope.employees = [];

	getEmployeeService.getEmployees()
	.then(function(res){
		employeesData = res.data;
		$scope.loadMore();
	}, function(res) {
		console.log('Error '+ res);
	});

    $scope.loadMore = function() {
        if(counter > employeesData.length) { return;}
        for (var i = counter; i<counter+3 && i<employeesData.length; i++) {
            $scope.employees.push(employeesData[i]);
        }
        counter += 3; 
    };

    $scope.$watch('filed', function() {  
        $scope.employees = filterFilter(employeesData, {'Name' : $scope.filed }); }
    );
});