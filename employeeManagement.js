var express    = require('express'); 

var path = require('path');

       // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '/www')));

// 2nd part -- connect database and add data table
var User  = require('./app/models/user');

var mongoose   = require('mongoose');

var uri = 'mongodb://<dbuser>:<dbpassword>@ds149049.mlab.com:49049/<dbname>'; // standard MongoDB URI
mongoose.Promise = global.Promise
mongoose.connect(uri);
var db = mongoose.connection;

// Error handler
db.on('error', function (err) {
  console.log(err);
});


//mongoose.connect('mongodb://ds149049.mlab.com:49049/wangleidb',
//				  {user: 'wanglei85119', pass: '123456'});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.use('/api', router);
var idCount = 9;

router.route('/users')
    //create new employee
	.post(function(req, res) {
		var temp = new User;		

		temp.id = ++idCount;
		temp.lName = req.body.lName;
		temp.fName = req.body.fName;
		temp.title = req.body.title;
		temp.sex = req.body.sex;
		temp.age = req.body.age;

		temp.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
	})

    //get all employees
	.get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

router.route('/users/:id')
    //get the employee having ID = id
	.get(function(req, res) {
		User.findOne({"id":req.params.id}, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

    //update the employee information 
	.put(function(req, res) {
		User.findOne({"id":req.params.id}, function(err, user) {
            if (err)
                res.send(err);
			
			user.lName = req.body.lName;
			user.fName = req.body.fName;
			user.title = req.body.title;
			user.sex = req.body.sex;
			user.age = req.body.age;
				

			user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });
		})

	})

    //delete the employee of id
	.delete(function(req, res) {
		User.findOne({"id":req.params.id}, function(err, user) {

            if (err)
                res.send(err);

            // delete the user
            user.remove(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User deleted!' });
            });

        });

	})

app.listen(80);
console.log('Magic happens on port ' + 80);

