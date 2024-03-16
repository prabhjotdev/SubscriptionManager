const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

//Dd create table
// Create Table Subscriptions (
// 	Id int auto_increment primary key,
//     Name VARCHAR(255) NOT NULL,
//     Cost Float CHECK(Cost >=0),
//     BillingPeriod VARCHAR(20) DEFAULT 'Annual' CHECK(BillingPeriod IN ('Annual','Bi-Annual','Monthly','Bi-Weekly','Weekly','Daily')),
// 	NextBillingDate DATE NOT NULL,
//     Status VARCHAR(10) DEFAULT 'Active' CHECK(Status IN ('Active', 'InActive'))
// );

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

// Connect to MySQL
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      throw err;
    }
    console.log('Connected to MySQL');
  
    // db.query("SELECT * FROM Subscriptions", function (err, result, fields) {
    //   if (err) throw err;
    //   console.log(result);
    // });
  });

module.exports = db;