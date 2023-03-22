const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  data: {type:String},
  timestamp: { type: Date, default: Date.now },
  value: {type:Number}
});

const SensorData = mongoose.model('SensorDataSchema', SensorDataSchema,'SensorData');
module.exports = SensorData;