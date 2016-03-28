app.controller('newCtrl', function($scope, getEmployeeService, $location, Upload) {
    var date = new Date();

    $scope.act = 'Create';
    $scope.incomplete = false; 
    $scope.img = '';
    $scope.Name = '';
    $scope.Title = '';
    $scope.Sex = 'Male';
    $scope.StartDate = new Date();
    $scope.OfficePhone = '';
    $scope.CellPhone = '';
    $scope.SMS = '';
    $scope.Email = '';
    $scope.Manager = null;
    
    getEmployeeService.getEmployees()
    .then(function(res){
      $scope.candManagers = [];
      angular.forEach(res.data, function(emp){
            this.push({ID:emp._id, Name:emp.Name});
          }, $scope.candManagers);
      }, function(res) {
      console.log('Error '+ res);
    });

    $scope.$watch('Name',function() {$scope.test();});
    $scope.$watch('Title',function() {$scope.test();});
    $scope.$watch('Sex', function() {$scope.test();});
    $scope.$watch('StartDate', function() {$scope.test();});
    $scope.$watch('OfficePhone',function() {$scope.test();});
    $scope.$watch('CellPhone', function() {$scope.test();});
    $scope.$watch('SMS', function() {$scope.test();});
    $scope.$watch('Email', function() {$scope.test();});

    $scope.test = function() {
          $scope.incomplete = false; 
          if (!$scope.Name.length || !$scope.Title.length || 
          $scope.StartDate==null || $scope.StartDate=="" ||
          !$scope.OfficePhone.length || !$scope.CellPhone.length ||
          !$scope.SMS.length || !$scope.Email.length) {
             $scope.incomplete = true;
          }
    };

    /* date picker functions group */
    $scope.open = function() {
      $scope.popup.opened = true;
    };

    $scope.popup = {
      opened: false
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2030, 1, 1),
      startingDay: 1
    };
    /* end date picker functions group */
    
        /* picture upload functions group */
    $scope.upload = function (file, emplyData) {
        Upload.upload({
            url: '/photo', 
            data: {photo : file} 
        }).then(function (res) { 
            if(res.data.error_code === 0){ 
                getEmployeeService.newEmployee(emplyData).then(function() {
                  $location.path("/");
                }); 
                console.log(res.config.data.photo.name + ' uploaded successfully.');
            } else {
                console.log('Photo upload Error occured!');
            }
        }, function (res) { 
            console.log('Photo upload Error status: ' + res.status);
        });
    };
    /* end picture upload functions group */

    $scope.saveUser = function(){
        var emplyData = {'img':$scope.img,
                         'Name':$scope.Name,
                         'Title':$scope.Title,
                         'Sex':$scope.Sex,
                         'StartDate':$scope.StartDate,
                         'OfficePhone':$scope.OfficePhone,
                         'CellPhone':$scope.CellPhone,
                         'SMS':$scope.SMS,
                         'Email':$scope.Email,
                         'Manager':$scope.Manager};
        if($scope.photo) { 
            $scope.upload($scope.photo, emplyData);
        } else {
            getEmployeeService.newEmployee(emplyData).then(function() {
                $location.path("/");
            }); 
          }
    };

    $scope.cancel = function() {
      $location.path("/");
    };
    
});