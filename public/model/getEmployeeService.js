app.service('getEmployeeService',function($http){

    var getEmployees = function(){
            return $http.get('/employees');
        },

        getEmployee = function(id){
            return $http.get('/employees/'+id);
        },

        getReportTo = function(id){
            return $http.get('/reports/'+id);
        },

        newEmployee = function(emplyData) {
            return $http.post("/employees/", emplyData);
        },

        editEmployee = function(id, emplyData) {
            return $http.put("/employees/"+id, emplyData);
        },

        updateManager = function(emplyData) {
            return $http.post("/updateManager/", emplyData);
        },

        deleteEmployee = function(id) {
            return $http.delete("/employees/"+id);
        };

    return {
        "getEmployees"   : getEmployees,
        "getEmployee"    : getEmployee,
        "getReportTo"    : getReportTo,
        "newEmployee"    : newEmployee,
        "editEmployee"   : editEmployee,
        "updateManager"  : updateManager,
        "deleteEmployee" : deleteEmployee
    }
});