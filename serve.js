var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var Employee = require("./employee");
var photoName = '';

var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:admin@jello.modulusmongo.net:27017/jaDun4ow');

var router = express.Router();     

app.use(function(req, res, next) { 
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 var storage = multer.diskStorage({ 
        destination: function (req, file, cb) {
            cb(null, './public/imgs/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            photoName = file.fieldname+'-'+datetimestamp+'.'+file.originalname.split('.').pop();
            cb(null, photoName);
        }
    });

var upload = multer({ 
                    storage: storage
                }).single('photo');

/* function of respond to all requests */
app.get('/', function (req, res) {
    res.render('index');
});

app.post('/photo', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            res.json({error_code:0,err_desc:null});
        });
    });

router.route('/employees')
    .get(function(req, res) {
        Employee.find().lean().exec(function(err, employees) {
            if (err) { res.send(err); }
            Employee.aggregate([{
                $group: {
                    _id: '$Manager', 
                    reportTo: {$push: "$_id"}
                }
            }], function (err, result) {
                if (err) { res.send(err); } 
                else { 
                    for(var i=0;i<employees.length;i++){
                        employees[i].reportTo = [];
                        for(var j=0;j<result.length;j++){
                            if(result[j]._id == employees[i]._id){
                                employees[i].reportTo = result[j].reportTo.slice(0);
                                result.splice(j,1);
                            }
                        }
                    }
                    res.json(employees);
                }
            });
        });
    })
    .post(function(req, res) {
        var employee = new Employee(); 

        if(photoName) {
            employee.img = 'imgs/' + photoName; 
        } else { employee.img = null; }
        
        employee.Name = req.body.Name;
        employee.Title = req.body.Title;
        employee.Sex = req.body.Sex;
        employee.StartDate = req.body.StartDate;
        employee.OfficePhone = req.body.OfficePhone;
        employee.CellPhone = req.body.CellPhone;
        employee.SMS = req.body.SMS;
        employee.Email = req.body.Email;
        employee.Manager = req.body.Manager || null;

        employee.save(function(err) {
            if (err) { res.send(err); }
            photoName = '';
            res.json({ message: 'employee created.'});
        });
    });


router.route('/employees/:id')
    .get(function(req, res) {
        Employee.find({$or:[{_id:req.params.id},
            {Manager:req.params.id}]})
            .populate('Manager','Name').lean().exec(function(err, employees) {
            if (err) { res.send(err); }
            var result = {}, 
                reportTo = [];

            employees.forEach(function(emp){
                if(emp._id == req.params.id){ result = emp; }
                else { reportTo.push(emp._id); }
            })
            result.reportTo = reportTo;
            res.json(result);
        });
    })
    .put(function(req, res) {
        Employee.findById(req.params.id, function(err, employee) {
            if (err) { res.send(err); }

            if(photoName) {
                employee.img = 'imgs/' + photoName; 
            } else { employee.img = null; }

            employee.Name = req.body.Name || employee.Name;
            employee.Title = req.body.Title || employee.Title;
            employee.Sex = req.body.Sex || employee.Sex;
            employee.StartDate = req.body.StartDate || employee.StartDate;
            employee.OfficePhone = req.body.OfficePhone || employee.OfficePhone;
            employee.CellPhone = req.body.CellPhone || employee.CellPhone;
            employee.SMS = req.body.SMS || employee.SMS;
            employee.Email = req.body.Email || employee.Email;
            employee.Manager = req.body.Manager || employee.Manager;
            employee.DirectReport = req.body.DirectReport || employee.DirectReport;

            employee.save(function(err) {
                if (err) { res.send(err); }      
                photoName = '';
                res.json({ message: 'employee updated.' });
            });
        });
        
    })
    .delete(function(req, res) {
        Employee.remove({ _id: req.params.id}, function(err, employee) {
            if (err) { res.send(err); }
            res.json({ message: 'Successfully deleted.' });
        }); 
    });

router.route('/reports/:id')
    .get(function(req, res) {
        Employee.find({Manager:req.params.id}, function(err, employee) {
            if (err) { res.send(err); }
            res.json(employee);
        });
    });

router.route('/updateManager')
    .post(function(req, res) {
        var manager = req.body.Manager,
            reportTo = req.body.reportTo.map(mongoose.Types.ObjectId);
        Employee.update({_id : {"$in" : reportTo}}, {Manager:manager}, {multi: true}, 
            function(err, num) {
                if (err) { res.send(err); }
                res.json({ message: 'Update manager successfully.' });
            }
        );
    });

app.use('/', router);

app.use(function(req, res){
	res.send('404 page not found.');
});

app.listen(5000, function() {
	console.log('server port 5000 started.');
});