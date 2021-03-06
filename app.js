const express = require('express');
const path = require('path'); // not added in dependencies because its amongst core modules of node
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

// sql server 

//const sql = require('mssql');

const app = express();
// App port
const port = 3000;

// incliding users.js file
const users = require('./routes/users');
const config = require('./config/database');
const graphdata = require('./routes/graphdata');

require('./config/passport')(passport);
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log('connected to datanase: ' + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('database error: ' + err);
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use('/users', users);
app.use('/graphdata', graphdata);
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
