const mongoose = require('mongoose');

const lightSchema = new mongoose.Schema({
  light: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: true
  }
});

const Light = mongoose.model('Light', lightSchema,'lights');

module.exports = Light;
