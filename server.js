
var express = require('express');
var app = express();
var db=require('./db');
var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public_files'));

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
//          console.log(nameToLookup);
//         console.log(passwordToCheck);
        
//    if(!nameToLookup){
//         res.send('ERROR');
//         send empty json object
//         res.send('{}')
//         return;
//    }
    
//         function getQuery(nameToLookup,callback){
         db.query('SELECT * FROM users WHERE username=?', nameToLookup,function(err,rows){
                  if(err)throw err;
                  else{
                  var jsonObject=rows[0];
                  console.log(jsonObject);
                  console.log('password entered is '+passwordToCheck+'orignial password is '+jsonObject.password);
                  if(passwordToCheck===jsonObject.password)
                  {
                  res.send(jsonObject);
                  }
                  else
                  {
                  //send empty json object if the password is wrong
                  res.send('{}');
                  }
                  }
            });

   });

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Server started at http://localhost:%s/', port);
});