app.controller('editCtrl', function($scope, getEmployeeService, $routeParams, $location, Upload) {
    var empID = $routeParams.empID;

    $scope.act = 'Edit';
    $scope.incomplete = false; 
    $scope.img = '';
    $scope.Name = '';
    $scope.Title = '';
    $scope.Sex = 'Male';
    $scope.StartDate = null;
    $scope.OfficePhone = '';
    $scope.CellPhone = '';
    $scope.SMS = '';
    $scope.Email = '';
    $scope.Manager = null;
    
    getEmployeeService.getEmployee(empID)
    .then(function(res){
      $scope.img = res.data.img;
      $scope.Name = res.data.Name;
      $scope.Title = res.data.Title;
      $scope.Sex = res.data.Sex;
      $scope.StartDate = new Date(res.data.StartDate);
      $scope.OfficePhone = res.data.OfficePhone;
      $scope.CellPhone = res.data.CellPhone;
      $scope.SMS = res.data.SMS;
      $scope.Email = res.data.Email;
      $scope.Manager = null;
      if(res.data.Manager) { $scope.Manager = res.data.Manager._id; }
    }, function(res) {
      console.log('Error - get Employee. '+res);
    });

    getEmployeeService.getEmployees()
    .then(function(res){
      $scope.candManagers = [];
      angular.forEach(res.data, function(emp){
          if(emp._id !== empID) {
            this.push({ID:emp._id, Name:emp.Name});
          }
        }, $scope.candManagers);

      getCandMangers(res.data);
      }, function(res) {
        console.log('Error '+ res);
    });

    var getCandMangers = function(emplyData) {
      var id, que = getEmplyReportTo(emplyData, empID);
      while(que.length > 0){
        id = que.shift(0);
        removeFromCand(id);
        angular.forEach(getEmplyReportTo(emplyData,id), function(eid) {
          que.push(eid);
        });
      }
    }; 

    var getEmplyReportTo = function(emplyData, ID) {
      for(var i=0;i<emplyData.length;i++){
        if(emplyData[i]._id == ID)
          return emplyData[i].reportTo;
      }
    }

    var removeFromCand = function(id) {
      for(var i=0;i<$scope.candManagers.length;i++){
        if(id == $scope.candManagers[i].ID) {
          $scope.candManagers.splice(i,1);
        }
      }
    };


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
                getEmployeeService.editEmployee(empID, emplyData).then(function() {
                  $location.path("/detail/"+empID+"/1");
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
          getEmployeeService.editEmployee(empID, emplyData).then(function() {
              $location.path("/detail/"+empID+"/1");
          }); 
        }
    };

    $scope.cancel = function() {
      $location.path("/detail/"+empID+"/1");
    };
});    