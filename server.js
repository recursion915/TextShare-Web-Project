
var express = require('express');
var app = express();
var db=require('./db');
var fs = require('fs');
var multer  = require('multer');
//var app=express();
var upload = multer({ dest: './uploads/'});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.use(express.static('public_files'));
//the files are uploaded at file directory uploads
app.use(multer({ dest: './uploads/',
               rename: function (fieldname, filename) {
               return filename+Date.now();
               },
               onFileUploadStart: function (file) {
               console.log(file.originalname + ' is starting ...');
               },
               onFileUploadComplete: function (file) {
               console.log(file.fieldname + ' uploaded to  ' + file.path)
               }
               }));

//now is able to handle exception
app.post('/api/photo',function(req,res){
         upload(req,res,function(err) {
                if(err) {
                return res.end("Error uploading file.");
                }
                res.end("File is uploaded");
                });
         });



//app.get('/',function(req,res){
//        res.sendfile("index.html");
//        });


app.post('/users',function(req,res){
    var postBody=req.body;
    var myUsername=postBody.username;
//         console.log(myUsername);
    if(!myUsername){
        res.send('ERROR');
        return;
    }
    
    function getQuery(username, callback){
    db.query('SELECT username FROM users WHERE username=?', username,function(err,results,rows){
                                    if(err){
                                    callback(err,null);}
                                    else{
                                    callback(null,results[0]);}
             });
         }

    var existUsername=getQuery(myUsername,function(err,data){
                if(err){
                    throw err;}
           
                else{
//                console.log(data.username);
                if(!data){
                        var user={username:postBody.username,password:postBody.password,firstname:postBody.firstname,lastname:postBody.lastname,address:postBody.address,university:postBody.university};
                        var query=db.query('INSERT INTO users SET ?', user, function(err,res){
                                if(err){throw err;}
                                console.log('Last insert ID:',res.insertId);
                        });
                        res.send('OK');
                        return;
                               }
                else{
                               res.send('EXIST');
                return;}

                }
        });
    });

app.post('/users2/',function(req,res){
         var postBody=req.body;
         var nameToLookup=postBody.username;
         var passwordToCheck=postBody.password;
          console.log(nameToLookup);
         console.log(passwordToCheck);
        
//    if(!nameToLookup){
//         res.send('ERROR');
//         send empty json object
//         res.send('{}')
//         return;
//    }
    
//         function getQuery(nameToLookup,callback){
         db.query('SELECT * FROM users WHERE username=?', nameToLookup,function(err,rows){
                  if(err){
                      throw err;
                  }
                  else{
                        var jsonObject=rows[0];
                  //check whether the username exists
                        if(jsonObject==null){
                  
                  res.send('{}');
                        }
                  //username exists
                        else{
                  
                        console.log(jsonObject);
                        console.log('password entered is '+passwordToCheck+'orignial password is '+jsonObject.password);
                            if(passwordToCheck===jsonObject.password)
                            {
                                res.send(jsonObject);
                            }
                            else
                            {
                            console.log('wrong password');
                  //send empty json object if the password is wrong
                            res.send('{}');
                            }
                  }
                  }
            });

   });

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Server started at http://localhost:%s/', port);
});