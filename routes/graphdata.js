const express = require('express');
const router = express.Router();
const config = require('../config/database');
const sql = require('mssql');

router.get('/data', (req, res, next) => {
    var connection = new sql.Connection(config.databaseConfig);
    var req = new sql.Request(connection);
    connection.connect(function (err) {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            console.log('Success.......');
            req.query('select * from Readings order by LogDate', (err, recordSet) => {
                if (err) {
                    console.log(err);
                    throw err;

                } else {
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