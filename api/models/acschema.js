const mongoose = require('mongoose');

const acSchema = new mongoose.Schema({
    id:{
        type : Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    temperature: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    speed: {
        type: String,
        required: true
    }
});

const AC = mongoose.model('AC',acSchema,'airconditioners');
module.exports = AC;