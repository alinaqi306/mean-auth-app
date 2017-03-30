const express = require('express');
const router = express.Router();
const config = require('../config/database');
const sql = require('mssql');
const moment = require('moment');

router.post('/data', (req, res, next) => {
    var connection = new sql.Connection(config.databaseConfig);
    var sqlReq = new sql.Request(connection);
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var numberOfMonths = req.body.numberOfMonths;
    var query;

    if(fromDate == null && toDate == null){
       
            query = 'select * from Readings where LogDate >= \''+ moment().subtract(numberOfMonths, "months").format("YYYY-MM-DD HH:mm:ss") + '\' order by LogDate';

    }
    else{
        query = 'select * from Readings where LogDate between \''+ moment(fromDate).format("YYYY-MM-DD HH:mm:ss") + '\' and \'' + moment(toDate).add({hours:23, minutes:30}).format("YYYY-MM-DD HH:mm:ss") +'\' order by LogDate';
    }
    connection.connect(function (err) {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            console.log('Connection Success.......');
            console.log(query);
            sqlReq.query(query, (err, recordSet) => {
                if (err) {
                    console.log(err);
                    throw err;

                } else {
                    console.log('Query Success.......');
                     res.send( recordSet );
                    
                    /*for (var i in recordSet) {
                        console.log(recordSet[i].LogDate);
                    }*/
                }
            });
        }
    });
   
});

module.exports = router;