const mongoose = require('mongoose');
const config = require('../config/database');

const ReadingSchema = mongoose.Schema({
  MeterId:{
    type: Number
  },
  LogDate:{
    type: String,
    required: true
  },
  Value:{
    type: Number,
    required: true
  },
  Cost:{
    type: Number,
    required: true
  },
  Co2:{
    type: Number,
    required: true
  },
  Estimated:{
    type: Number,
    required: true
  }
}
);

const Reading = module.exports = mongoose.model('Reading', ReadingSchema);

module.exports.getByLogDate = function(dateString, callback){

    var date = new RegExp('.*'+dateString+'.*');
    const query = {LogDate: date};
    Reading.find(query, callback);
}