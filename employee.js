var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EmployeeSchema   = new Schema({
    img: String,
    Name: String,
    Title: String,
	Sex: String,
    StartDate: String,
	OfficePhone: String,
    CellPhone: String,
    SMS: String,
    Email: String,
    Manager: { type: String, ref: 'Employee' }
    }, { collection : 'employees_bk' });

module.exports = mongoose.model('Employee', EmployeeSchema);