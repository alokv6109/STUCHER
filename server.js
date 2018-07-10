var express = require('express');
var path = require('path')
var app = express();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var multer = require('multer')
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
  }));
  app.use(bodyParser.json());
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, 'F:/intern-project/backend/db_profile_image')
	},
	filename: function(req, file, callback) {
		callback(null, '-' + Date.now() + path.extname(file.originalname))
	}
})
var mysql = require('mysql');
var token1;
var con = mysql.createConnection
({
	host: "localhost",
	user: "root",
	password: "",
	database: "project_database"
})
con.connect(function (err) {
	if (err) throw err;
	console.log("connected! yo db");
});

app.use(express.static('../frontend/assets'));

app.get('/', function (req, res) {
	console.log("your index page has loaded successfully");
	res.sendFile(path.resolve('../frontend/index.html'));
})
app.get('/teacherlogin', function (req, res) {
	console.log("your teacher page has loaded successfully");
	res.sendFile(path.resolve('../frontend/assets/html/teacher_login.html'));
})
app.get('/studentlogin', function (req, res) {
	console.log("your student page has loaded successfully");
	res.sendFile(path.resolve('../frontend/assets/html/student_login.html'));
})
app.get('/newstudent', function (req, res) {
	console.log("your signup page for student has loaded successfully");
	res.sendFile(path.resolve('../frontend/assets/html/student_signup.html'));
})
app.get('/newteacher', function (req, res) {
	console.log("your signup page for teacher has loaded successfully");
	res.sendFile(path.resolve('../frontend/assets/html/teacher_signup.html'));
})
app.get('/student_details',function(req,res){
	console.log("your student details page has loaded successfully");
	res.sendFile(path.resolve('../frontend/assets/html/student_details.html'));
})
app.get('/teacher_details',function(req,res){
	console.log("your teacher details page has loaded successfully");
	res.sendFile(path.resolve('../frontend/assets/html/teacher_details.html'));
})
app.get("/forgot_password", function (req, res) {
	console.log("your forgotpassword page has loaded successfully");
	res.sendFile(path.resolve('../frontend/assets/html/forgot_password.html'));
})
app.post('/process_stud', function (req, res) {
	console.log("the request is ",req.body.login_id);
	var sql = "select * from users where roll_no = ? or email_id=?";
	con.query(sql, [req.body.login_id, req.body.login_id], function (err, result) {
		if (err) throw err;
		if (result.length <= 0) {
			res.end("Please! check your username once");
		}
		if(result.length==1){
		if(result[0].role_id=='1'){
			if ((result[0].password) == (md5(req.body.password))) {

				var date = new Date();
				console.log(date);
				var token1;
				jwt.sign({ date }, 'i_am_alok', function (err, token)//token assigned in this line
				{
					token1= token;
					console.log(token);
					req.header['x-access-token']=token;
					con.query("update users set  login_token=?  where email_id=?", [token,result[0].email_id],function( err, result1)
					{
						if(err) throw err;
						var data = {token :token1,
							 id: result[0].id ,
							  status:"success"};
							  console.log(data)
							res.send( data);
					})

				});

				}  else {
				res.end("WRONG CREDENTIALS");
			}}else{res.end("WRONG CREDENTIALS")}

		}
	})

	console.log("your student login page is processing some request");
	// res.end("WRONG CREDENTIALS");
})
app.post('/student_details',function(req,res){
	console.log('the get request is ',req.body)
	var sq="select *from users where login_token=?";
	con.query(sq, [req.body.token], function (err, result) {
		if (err) throw err;
		console.log(result)
		res.send(result[0])
		})
})

app.post('/teacher_details',function(req,res){
	console.log('the get request is ',req.body)
	var sq="select *from users where login_token=?";
	con.query(sq, [req.body.token], function (err, result) {
		if (err) throw err;
		console.log(result)
		res.send(result[0])
		})
})

app.post('/process_teach', function (req, res) {
	var sql = "select * from users where roll_no = ? or email_id=?";
	con.query(sql, [req.body.emp_id, req.body.emp_id], function (err, result) {
		if (err) throw err;

		if (result.length <= 0 ) {
			res.end("Please! check your username once");
		}

		if(result.length==1){
		if(result[0].role_id=='2'){
			if ((result[0].password) == (md5(req.body.password))){

				var date = new Date();
				console.log(date);
				var token1;
				jwt.sign({ date }, 'i_am_alok', function (err, token)//token assigned in this line
				{
					token1=token;
					req.header['x-access-token']=token;
					con.query("update users set  login_token=?  where email_id=?", [token1,result[0].email_id],function( err, result1)
					{
						if(err) throw err;
						var data = {token :token1,
							 id: result[0].id ,
							  status:"success"};
							res.send( data);
					})
				});
			}  else {
				res.end("WRONG CREDENTIALS");
			}}else{res.end("WRONG CREDENTIALS")}
		}
	})
	console.log("your teacher login page is processing some request");
})
app.post('/register_stud', function (req, res) {
	var sql = "select * from users where roll_no = ? or mobile_number=? ";
	con.query(sql, [req.body.roll_no, req.body.mobile], function (err, result){
		//console.log("the length is    ",result.length);
		if (err) throw err;
		if (result.length > 0) {
			res.end("roll_no or mobile_no already exists! please check them once");
		} else {
			//var upload = multer({storage: storage,}).single('userFile');
			var data = new Date(); // without jquery remove this $.now()
			//console.log(data)// Thu Jun 23 2016 15:48:24 GMT+0530 (IST)

			var sql = "insert into users(first_name, last_name, dob, roll_no, branch_id,email_id, mobile_number, password, created_at, modified_at,image,role_id) values(?,?,?,?,?,?,?,?,?,?,?,?)";
			con.query(sql, [req.body.first_name, req.body.last_name, req.body.dob, req.body.roll_no, req.body.branch, req.body.email, req.body.mobile, md5(req.body.password), data, data, req.body.pc,'1'], function (err, result) {
				if (err) throw err;
				console.log("user added to db with id " + result.insertId);
			})
			res.sendFile(path.resolve('../frontend/assets/html/student_details.html'));
		}
	})
})
app.post('/register_teach', function (req, res) {
	var sql = "select * from users where roll_no = ? or mobile_number=? ";
	con.query(sql, [req.body.emp_id, req.body.mobile], function (err, result) {
		if (err) throw err;
		if (result.length > 0) {
			res.end("emp_id or mobile_no already exists! please check them once");
		} else {
			var data = new Date();
			console.log(data)// Thu Jun 23 2016 15:48:24 GMT+0530 (IST)

			var sql = "insert into users(first_name, last_name, dob, roll_no, branch_id,email_id, mobile_number, password, created_at,modified_at,image,role_id) values(?,?,?,?,?,?,?,?,?,?,?,?)";
			con.query(sql, [req.body.first_name, req.body.last_name, req.body.dob, req.body.emp_id, req.body.department, req.body.email, req.body.mobile, md5(req.body.password), data, data,req.body.pc,'2'], function (err, result) {
				if (err) throw err;
				console.log("user added to db with id " + result.insertId);
			})
			res.sendFile(path.resolve('../frontend/assets/html/teacher_details.html'));
		}
	})
})
app.post('/forgot_password', function(req, res){
  var sql= "select * from users where email_id=?"
   con.query(sql, [req.body.email], function(err, result)
 {
    if(err) throw err;
		if(result.length<=0)
		{	console.log("email did not match");
			res.end("oops!!your email id did not match")
		}else {
    var sql1= "update users set password=? where email_id=?";
      con.query(sql1,[md5(req.body.password),req.body.email],function(err,result1){
        if(err)
				 throw err;
          else{res.end("your password has been changed successfully");
				}
      })

      }})
			console.log("your forgot password page has loaded successfully");
  })
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})
