const mongoose = require('mongoose');

const SecuritySchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true 
    },
    access:{
        type:String,
        required:true   
    },
    camera:{
        type:String,
        required:true
    }
});

const Security = mongoose.model('Security',SecuritySchema,'security');
module.exports=Security;