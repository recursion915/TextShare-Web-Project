var mysql=require('mysql');
var connection=mysql.createConnection({
                                      host    : 'localhost',
                                      user    : 'root',
                                      password: '',
                                      database: 'bookshare'
                                      });
connection.connect(function(err){
                   if(err){
                   console.error('error connecting: ' + err.stack);
                   }
                   else{
                   console.log('database is connecting');
                   }});
module.exports=connection;