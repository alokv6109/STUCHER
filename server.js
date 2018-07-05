var express = require('express');
var path = require('path')
var app = express();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser);
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

// var htmlPath = path.join("F:/intern-project/frontend/" + 'assets');
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

app.post('/process_stud', function (req, res) {

  var sql = "select * from users where roll_no = ? or email_id=?";
  con.query(sql, [req.body.login_id, req.body.login_id], function (err, result) {
    if (err) throw err;
    if (result.length <= 0) {
      res.end("Please! check your username once");
    }
    else {
      if ((result[0].password) == (md5(req.body.password))) {
        var date = new Date();
        console.log(date);

        jwt.sign({ date }, 'i_am_alok', function (err, token)//token assigned in this line
        {
          token1= token;
          // res.json(
          //   {
          //     token
          //   });
          console.log(token);
          req.header['x-access-token']=token;
          con.query("update users set  login_token=?  where email_id=?", [token1,result[0].email_id],function( err, result)
          {
            if(err) throw err;
            //console.log(token1 +"this oi tsdfdv");
          })
        });

        setTimeout(function(){
          console.log("token1",token1);
        }, 3000);
        res.sendFile(path.resolve('../frontend/assets/html/student_details.html'));
      }
      else {
        res.end("WRONG CREDENTIALS");
      }
    }
  })
  console.log("your student login page is processing some request");
})

// app.get('/process_stud',function(req,res){
//   console.log(req.body);
//   var q="select * from users where roll_no=?";
//   con.query(q,[req.body.login_id],function(err,result){
//     if(err) throw err
//     console.log("Hello ")
//
//     console.log(result[0])
//     res.send(result[0])
//   })
// });


app.post('/process_teach', function (req, res) {
  //  console.log(md5('alok'));
  //console.log(req);
  var sql = "select * from users where roll_no = ? or email_id=?";
  con.query(sql, [req.body.emp_id, req.body.emp_id], function (err, result) {
    if (err) throw err;

    if (result.length <= 0) {
      res.end("Please! check your username once");
    }
    else {
      if ((result[0].password) == (md5(req.body.password))) {
        var date = new Date();
        console.log(date);
        jwt.sign({ date }, 'i_am_alok', function (err, token)//token assigned in this line
        {
          token1=token;
          // res.json(
          //   {
          //     token
          //   });
          req.header['x-access-token']=token;
          console.log(token);
          con.query("update users set  login_token=?  where email_id=?", [token1,result[0].email_id],function( err, result)
          {
            if(err) throw err;
            //console.log(token1 +"this oi tsdfdv");
          })
        });

        setTimeout(function(){
          console.log("token1",token1);
        }, 3000);
        res.sendFile(path.resolve('../frontend/assets/html/teacher_details.html'));
      }  else {
        res.end("WRONG CREDENTIALS");
      }
    }
  })
  console.log("your teacher login page is processing some request");
})
app.post('/register_stud', function (req, res) {
  var sql = "select * from users where roll_no = ? or mobile_number=? ";
  con.query(sql, [req.body.login_id, req.body.login_id], function (err, result) {
    if (err) throw err;
    if (result.length > 0) {
      res.end("roll_no or mobile_no already exists! please check them once");
    } else {
      var data = new Date(); // without jquery remove this $.now()
      console.log(data)// Thu Jun 23 2016 15:48:24 GMT+0530 (IST)

      var sql = "insert into users(first_name, last_name, dob, roll_no, branch_id,email_id, mobile_number, password, created_at, modified_at, image) values(?,?,?,?,?,?,?,?,?,?,?)";
      con.query(sql, [req.body.first_name, req.body.last_name, req.body.dob, req.body.roll_no, req.body.branch, req.body.email, req.body.mobile, md5(req.body.password), data, data, req.body.pic], function (err, result) {
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
      var data = new Date(); // without jquery remove this $.now()
      console.log(data)// Thu Jun 23 2016 15:48:24 GMT+0530 (IST)

      var sql = "insert into users(first_name, last_name, dob, roll_no, branch_id,email_id, mobile_number, password, created_at,modified_at, image) values(?,?,?,?,?,?,?,?,?,?,?)";
      con.query(sql, [req.body.first_name, req.body.last_name, req.body.dob, req.body.emp_id, req.body.department, req.body.email, req.body.mobile, md5(req.body.password), data, data, req.body.pic], function (err, result) {
        if (err) throw err;
        console.log("user added to db with id " + result.insertId);
      })
      res.sendFile(path.resolve('../frontend/assets/html/teacher_details.html'));
    }
  })
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
