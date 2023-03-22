const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// const SerialPort = require('serialport');
// const Readline = require('@serialport/parser-readline');
const SensorData = require('./models/arduinodata');
const Light = require('./models/lightschema');

const app = express();

mongoose.connect('mongodb+srv://samarth:Samarth123@cluster0.obcyplu.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// const Ardport = new SerialPort('COM14', { baudRate: 9600 });
// const parser = new Readline();

// Ardport.pipe(parser);


const port = 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on('connect', () => {
    console.log('mqtt connected');
    client.subscribe('/SamsensorDatas');
});

// Ardport.on("open", () => {
//     console.log('serial port is now open');
// });

app.get('/api/sensorData', (req, res) => {
    SensorData.find({})
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('Error getting Sensor Data', error);
            res.status(500).send('Error getting sensor data');
        })
});

var value =1;
state = '';

// parser.on('data', (data) => {
//     console.log('Arduino is Saying: ' + data);
//     if(data=='Motion detected\r'){
//         value=1;
//         state='On';
//     }
//     else{
//         value=0;
//         state='Off';
//     }
//     const filter = { light: 1 };
//     const update = { state: state };
//     const sensordata = new SensorData({ data,value })
//     const result =  Light.findOneAndUpdate(filter, update).exec();
    
//     console.log(sensordata)
//     const topic = '/sensorData';
//     const message = JSON.stringify({ sensordata });
//     client.publish(topic, message, () => {
//         console.log('published new message');
//       });
//     sensordata.save();
// })

client.on('message', (topic, message) => {
    if (topic === '/SamsensorDatas') {
        console.log('Received data:', message.toString());
        var data = message.toString();
        if(data=='Motion detected'){
            value=1;
            state='On';
        }
        else{
            value=0;
            state='Off';
        }
        const filter = { light: 1 };
        const update = { state: state };
        const sensordata = new SensorData({ data,value })
        const result =  Light.findOneAndUpdate(filter, update).exec();
        
        console.log(sensordata)
        sensordata.save();
    }

});    

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
