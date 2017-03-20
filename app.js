const express = require('express');
const path = require('path'); // not added in dependencies because its amongst core modules of node
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

// sql server 

const sql = require('mssql');

const app = express();
// App port
const port = 3000;

// incliding users.js file
const users = require('./routes/users');
const config = require('./config/database');

require('./config/passport')(passport);
/*mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log('connected to datanase: ' + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('database error: ' + err);
});
*/
var connection = new sql.Connection(config.databaseConfig);
var req = new sql.Request(connection);
connection.connect(function (err) {
  if(err){
    console.log(err);
  }
  else{
    console.log('Success.......');
    req.query('select * from Readings', (err, recordSet) => {
      if(err){
        console.log(err);

      }else{
        console.log(recordSet);
      }
    });
  }
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use('/users', users);
app.use(passport.initialize());
app.use(passport.session());

// Index route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// redirect not already specified urls to index.html
app.get('*', (req, res) => {
  res.join(__dirname, 'public/index.html');
});
app.listen(port, () => {
  console.log('server started at port '+ port);
});
