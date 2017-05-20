const express = require('express');
const router = express.Router();
const config = require('../config/database');
const sql = require('mssql');
const moment = require('moment');

const Reading = require('../models/readings')
const Accamulation = require('../models/accamulations')

router.post('/data', (req, res, next) => {
    var connection = new sql.Connection(config.databaseConfig);
    var sqlReq = new sql.Request(connection);
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var numberOfMonths = req.body.numberOfMonths;
    var query;

    if(fromDate == null && toDate == null){
       
        query = 'select * from DummyReadings where LogDate >= \''+ moment().subtract(numberOfMonths, "months").format("YYYY-MM-DD HH:mm:ss") + '\' and LogDate <= \''+ moment().format("YYYY-MM-DD HH:mm:ss") + '\'order by LogDate';

    }
    else{
        query = 'select * from DummyReadings where LogDate between \''+ moment(fromDate).format("YYYY-MM-DD HH:mm:ss") + '\' and \'' + moment(toDate).add({hours:23, minutes:30}).format("YYYY-MM-DD HH:mm:ss") +'\' order by LogDate';
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

router.get('/scheduledUpdate', (req, res, next) => {
    var connection = new sql.Connection(config.databaseConfig);
    var sqlReq = new sql.Request(connection);
  
    var query = 'select * from DummyReadings where LogDate >= \''+ moment().subtract(15, "days").format("YYYY-MM-DD HH:mm:ss") + '\' and LogDate <= \''+ moment().format("YYYY-MM-DD HH:mm:ss") + '\' order by LogDate';
            

    
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
                }
            });
        }
    });
   
});

router.get('/accamulatevalue', (req, res, next) => {

    var todayDate = moment().format("YYYY-MM-DD");

    // first find all the readings of today
    Reading.getByLogDate(todayDate, (err, resultdata) => {

        var sum = 0;
        var meterId = 1213; // meterId is hardcoded for now, in future it can be a list of all meterIds or specific id from request 

        if(err) throw err;

       

        if(resultdata){
             //sum all the values  
            resultdata.forEach(function(element) {
            sum = sum + element.Value;
            });

            // get already stored accamulated value for today and specified meterId
            Accamulation.getByMeterIdAndLogDate(meterId,todayDate, (err,record) => {

                if(err) throw err;

                if(record){
                    // if record found for today's date for specified meter
                    var conditions = {
                        MeterId: record.MeterId,
                        LogDate: record.LogDate
                    }

                    // then update that value with new sum and date

                    Accamulation.update(conditions, {AccamulatedValue: sum}, { multi: true }, (err, affectedRows) => {

                        res.json({
                            success:true,
                            sum:sum
                        });
                    } );
                }
                else{
                    // when there is no record found for specified meterId and date
                    var newRecord = new Accamulation({
                        
                        MeterId : meterId,
                        LogDate : moment().format("YYYY-MM-DD HH:mm:ss"),
                        AccamulatedValue : sum

                    }); 

                    // add new record to Accamulations collection
                    Accamulation.addNewRecord(newRecord, (err, data) => {

                        if(err) throw error;

                        res.json({
                            success:true,
                            sum:sum
                        });
                    });
                    
                }
            });
        }
        
    });

});

module.exports = router;