const mongoose = require('mongoose');

const AccamulationSchema = mongoose.Schema({

    MeterId: {
        type: Number
    },
    LogDate: {
        type: String,
        required: true
    },
    AccamulatedValue: {
        type: Number,
        required: true
    }
});

const Accamulation = module.exports = mongoose.model('Accamulation', AccamulationSchema);

module.exports.getByMeterIdAndLogDate = function(meterId, dateString, callback){
    
    var date = new RegExp('.*'+dateString+'.*');
    const query = {
                    MeterId: meterId,
                    LogDate: date
                  };
    Accamulation.findOne(query,callback);
}

module.exports.addNewRecord = function(newRecord, callback){

    newRecord.save(callback);
}
