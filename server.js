var express = require('express');
var app = express();
var md5 = require('md5');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:true})
app.use(urlencodedParser);
var mysql = require('mysql');
var con = mysql.createConnection
({
  host:"localhost",
  user:"root",
  password:'',
  database:"project_database"
})
con.connect(function(err)
{
  if(err) throw err;
  console.log("connected! yo db");
});
app.get('/', function(req , res)
{
  console.log("your index page has loaded successfully");
  res.sendFile(__dirname + "/frontend/" +  "index.html");
})
app.get('/teacherlogin', function(req , res)
{
  console.log("your teacher page has loaded successfully");
  res.sendFile(__dirname +"/frontend/" +  "teacher_login.html");
})
app.get('/studentlogin', function(req , res)
{
  console.log("your student page has loaded successfully");
  res.sendFile(__dirname + "/frontend/" +  "login.html");
})
app.get('/newstudent', function(req , res)
{
  console.log("your signup page for student has loaded successfully");
  res.sendFile(__dirname + "/frontend/" +  "signup.html");
})
app.get('/newteacher', function(req , res)
{
  console.log("your signup page for teacher has loaded successfully");
  res.sendFile(__dirname + "/frontend/" +  "teacher_signup.html");
})

app.post('/process_stud' , function(req, res){
//  console.log(md5('alok'));
  //console.log(req);
    var sql = "select * from users where roll_no = ? or email_id=?";
    con.query(sql, [req.body.login_id, req.body.login_id], function(err , result)
    {
      if(err) throw err;

        if(result.length<=0)
        {
          res.end("Please! check your username once");
        }
        else {
            if((result[0].password)==(md5(req.body.password)))
            res.sendFile(__dirname +"/frontend/" + "thanks.html" );
            else {
              res.end("WRONG CREDENTIALS");
                  }
            }
    })
    console.log("your student login page is processing some request");
})

app.post('/process_teach' , function(req, res){
//  console.log(md5('alok'));
  //console.log(req);
    var sql = "select * from users where roll_no = ? or email_id=?";
    con.query(sql, [req.body.emp_id, req.body.emp_id], function(err , result)
    {
      if(err) throw err;

        if(result.length<=0)
        {
          res.end("Please! check your username once");
        }
        else {
            if((result[0].password)==(md5(req.body.password)))
            res.sendFile(__dirname +"/frontend/" + "thanks.html" );
            else {
              res.end("WRONG CREDENTIALS");
                  }
            }
    })
    console.log("your teacher login page is processing some request");
})
app.post('/register_stud', function(req,res)
{
  var sql = "select * from users where roll_no = ? or mobile_number=? ";
  con.query(sql , [req.body.login_id, req.body.login_id], function(err, result){
          if(err) throw err;
          if(result.length>0){
            res.end("roll_no or mobile_no already exists! please check them once");
          }else{
  var sql= "insert into users(first_name, last_name, dob, roll_no, branch_id,email_id, mobile_number, password) values(?,?,?,?,?,?,?,?)";
    con.query(sql, [req.body.first_name, req.body.last_name, req.body.dob, req.body.roll_no, req.body.branch, req.body.email, req.body.mobile, md5(req.body.password)], function(err, result){
      if(err) throw err;
      console.log("user added to db with id " + result.insertId);
      })
      res.sendFile(__dirname + "/frontend/" + "student_details.html" );
}
})
})
app.post('/register_teach', function(req,res)
{
  var sql = "select * from users where roll_no = ? or mobile_number=? ";
  con.query(sql , [req.body.emp_id, req.body.mobile], function(err, result){
          if(err) throw err;
          if(result.length>0){
            res.end("emp_id or mobile_no already exists! please check them once");
          }else{
  var sql= "insert into users(first_name, last_name, dob, roll_no, branch_id,email_id, mobile_number, password) values(?,?,?,?,?,?,?,?)";
    con.query(sql, [req.body.first_name, req.body.last_name, req.body.dob, req.body.roll_no, req.body.department, req.body.email, req.body.mobile, md5(req.body.password)], function(err, result){
      if(err) throw err;
      console.log("user added to db with id " + result.insertId);
      })
      res.sendFile(__dirname + "/frontend/" + "teacher_details.html" );
}
})
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
