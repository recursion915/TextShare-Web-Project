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
//
//connection.query('CREATE TABLE books (' +
//                 ' username VARCHAR(50),' +
//                 ' bookname VARCHAR(50),' +
//                 ' bookcondition VARCHAR(50),' +
//                 ' ISBN VARCHAR(50),' +
//                 ' price DECIMAL(5,2))', function(err, result){
//    if(err) {
//    console.log(err);
//    }else{
//    console.log("Table books Created");
//}});

//connection.query('ALTER table books add column (photo varchar(50))',
//             function(err,result){
//             
//             if(err){
//                console.log("ERROR:"+err.message);
//             }
//             
//             else{
//                console.log("new column added");
//             }
//             });

module.exports=connection;