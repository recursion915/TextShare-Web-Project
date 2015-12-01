
var express = require('express');
var app = express();
var db=require('./db');
var fs = require('fs');
var multer  = require('multer');
var app=express();
var upload = multer({ dest: './uploads/'});
var ImageName;
var nodemailer=require('nodemailer');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.use(express.static('public_files'));
app.use(express.static('uploads'));
//the files are uploaded at file directory uploads
app.use(multer({ dest: './uploads/',
               rename: function (fieldname, filename) {
               var newname =filename+Date.now();
           

               return newname;
               },
               onFileUploadStart: function (file) {
//               console.log(file.originalname + ' is starting ...');
               },
               onFileUploadComplete: function (file) {
               console.log(file.name+" is uploaded successful");
               ImageName=file.name;
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

//get book photos
app.get('/getImages/',function(req,res){
//        var imageName=req.params[0];
//        console.log("ImageName :"+ImageName);
        var data;
        data=ImageName;
        
        res.send(data);
        
        
        
        
        
        
        });




app.get('/',function(req,res){
        res.sendfile("index.html");
        });


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

//get personal book records
app.get('/bookedit/*',function(req,res){
        var nameToLookup=req.params[0];
//        console.log(nameToLookup);
        var query=db.query('SELECT * FROM books WHERE username=?', nameToLookup,function(err,rows){
            if(err)throw err;
            res.send(rows);
            return;
            });
        });
//post book records
app.post('/bookcreate',function(req,res){
         var postBody=req.body;
         var myUsername=postBody.username;
         if(!myUsername){
         res.send('ERROR');
         return;}
         console.log(ImageName);
         var book={username:postBody.username,bookname:postBody.bookname,ISBN:postBody.ISBN,price:postBody.bookprice,bookcondition:postBody.bookcondition,photo:ImageName};
         console.log(book)
         var query=db.query('INSERT INTO books SET ?', book, function(err,res){
                            if(err){throw err;}
                            });
                            res.send('OK');
         return;});
//get book search results
app.get('/booksearch/*',function(req,res){
        var itemToLookup=req.params[0];
        if(isNaN(parseInt(itemToLookup))){
            //title
        var query=db.query('SELECT * FROM books INNER JOIN users ON books.username=users.username WHERE bookname=?', itemToLookup,function(err,rows){
                           if(err)throw err;
                           res.send(rows);
                           return;});
        }else{
            //ISBN
        var query=db.query('SELECT * FROM books INNER JOIN users ON books.username=users.username WHERE ISBN=?', itemToLookup,function(err,rows){
                            if(err)throw err;
                            res.send(rows);
                            return;});
                           
        }
        });

app.post('/users2/',function(req,res){
         var postBody=req.body;
         var nameToLookup=postBody.username;
         var passwordToCheck=postBody.password;
         console.log(nameToLookup);
         console.log(passwordToCheck);

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

app.post('/buyerconfirmation/',function(req,res){
         console.log('haha');
         var postBody=req.body;
         var buyername=postBody.buyername;
         var ownername=postBody.ownername;
         var bookname=postBody.bookname;
         var bookcondition=postBody.bookcondition;
         var price=postBody.price;
         var ISBN=postBody.ISBN;
         var photo=postBody.photo;
         console.log(buyername);
         console.log(ownername);
         console.log(bookname);
         
         function getQuery(username, callback){
         db.query('SELECT * FROM users WHERE username=?', buyername,function(err,results,rows){
                  if(err){
                  callback(err,null);}
                  else{
                  callback(null,results[0]);}
                  });
         }

         getQuery(buyername,function(err,data){
                  if(err){throw err;}
                  else{
                  
                          console.log(data.username);
                          var html = '';
                          html+="<h>Hello,<br />";
                          html+="<h><br />";
                          html+="<h>Buyer Info:<br />";
                          var buyer = ['username: '+data.username,'firstname: ' +data.firstname, 'lastname: '+data.lastname, 'address: '+data.address, 'university: '+data.university];
                          for(var i=0; i<buyer.length;i++){
                              html+="<b>"+buyer[i]+"<br />";
                          }
                          html+="<h>Requested Book Info:<br />";
                          var bookrequested = ['bookname: '+bookname,'bookcondition: '+bookcondition,'price: '+price,'ISBN: '+ISBN];
                          for(var i=0; i<bookrequested.length;i++){
                              html+="<b>"+bookrequested[i]+"<br />";
                          }
                          //create reusable transporter object using SMTP transport
                          var transporter = nodemailer.createTransport({
                                                                        service: 'Gmail',
                                                                        auth: {
                                                                        user: 'booksharewebservice@gmail.com',
                                                                        pass: 'recursion915'
                                                                        }
                                                                        });
                          //send email with transporter
                           var mail={
                           to: ownername,
                           subject: 'Book Rental Request',
                           html: html
                           };
                  
                           transporter.sendMail(mail, function(err, info){
                                                if (err) {
                                                console.log(err);
                                                
                                                }
                                                res.send('OK');
                                                return;
                                                console.log('Message sent: ' + info.response);
                                                });
                  }
                  }
                           
                  );
         });


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Server started at http://localhost:%s/', port);
});