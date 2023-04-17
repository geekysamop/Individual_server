const express = require('express');
const mongoose = require('mongoose');

const Light = require('./models/lightschema');
const AC = require('./models/acschema')
const Security = require('./models/securityschema');

const bodyParser = require('body-parser');
const Device = require('./models/devices');
const app = express();

mongoose.connect('mongodb+srv://samarth:Samarth123@cluster0.obcyplu.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(`${__dirname}/public/generated-docs`));

app.get('/docs', (req, res) => {
  res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});


const port = 5000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/**
* @api {get} /api/devices All Devices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json}Devices :
*  [
*  {
*    "_id": "6414b32c11cf504db602811c",
*    "id": "2",
*    "name": "Device 2",
*    "user": "SamarthMistry"
*  },
*  {
*    "_id": "6414b32c11cf504db602811d",
*    "id": "4",
*    "name": "Device 4",
*    "user": "Sam"
*  },
*  {
*    "_id": "6414b32c11cf504db602811e",
*    "id": "5",
*    "name": "Device 5",
*    "user": "SamOP"
*  },
*  {
*    "_id": "6414b32c11cf504db602811f",
*    "id": "3",
*    "name": "Device 3",
*    "user": "SamMistry"
*  },
*  {
*    "_id": "6414b32c11cf504db6028120",
*    "id": "1",
*    "name": "Device 1",
*    "user": "Samarth"
*  },
*  {
*    "_id": "6414bb3371fe734a5739e583",
*    "name": "NewLegion",
*    "user": "NewSam",
*    "__v": 0
*  },
*  {
*    "_id": "6414c3953c0471e2bba31c35",
*    "name": "asd",
*    "user": "asd",
*    "__v": 0
*  }
*]
* @api {get} /api/light All lights An array of all devices
* @apiGroup lights
* @apiSuccessExample {json} Light :
*[
*    {
*        "_id": "6410839220ebbe97e7482cbd",
*        "light": 3,
*        "state": "Off"
*    },
*    {
*        "_id": "6410839220ebbe97e7482cbb",
*        "light": 2,
*        "state": "On"
*    },
*    {
*        "_id": "6410839220ebbe97e7482cbc",
*        "light": 1,
*        "state": "On"
*    }
*]
* @api {get} /api/ac All Ac An array of all devices
* @apiGroup Ac
* @apiSuccessExample {json} Ac:
*[
*    {
*        "_id": "641490384bf3e92d91d1e003",
*        "id": 1,
*        "mode": "Heat",
*        "speed": "High",
*        "state": "On",
*        "temperature": "69"
*    },
*    {
*        "_id": "6414937b6e73980d4afba6fe",
*        "id": 2,
*        "mode": "Cool",
*        "speed": "High",
*        "state": "Off",
*        "temperature": "49"
*    }
*]
* @api {get} /api/security All api An array of all devices
* @apiGroup security
* @apiSuccessExample {json} Security:
*[
*    {
*        "_id": "6414a40e8e28b718ac4c9898",
*        "id": 3,
*        "name": "Saksham",
*        "access": "grant",
*        "camera": "Off"
*    },
*   {
*       "_id": "6414a40e8e28b718ac4c9899",
*        "id": 2,
*        "name": "Shravel",
*        "access": "grant",
*        "camera": "Off"
*    },
*    {
*        "_id": "6414a40e8e28b718ac4c989a",
*        "id": 1,
*        "name": "Samarth",
*        "access": "deny",
*        "camera": "Off"
*    }
*]
* @apiErrorExample {json} Error-Response:
*  {
*    "User does not exist"
*  }
*/


app.get('/api/devices',(req,res)=>{
  Device.find({})
  .then((devices)=>{
    res.json(devices);
  })
  .catch((err)=>{
    console.log('Error getting devices',err);
    res.status(500).send('Error getting devices');
  });
});-

app.get('/api/light', (req, res) => {
  Light.find({})
    .then((lights) => {
      res.json(lights);
    })
    .catch((err) => {
      console.log('Error getting lights', err);
      res.status(500).send('Error getting lights');
    });
});

app.get('/api/ac', (req, res) => {
  AC.find({})
    .then((acs) => {
      res.json(acs);
    })
    .catch((error) => {
      console.log('Error getting Air Conditioners', error);
      res.status(500).send('error getting Air Conditioners');
    })
})

app.get('/api/security', (req, res) => {
  Security.find({})
    .then((sec) => {
      res.json(sec);
    })
    .catch((error) => {
      console.log('Error Getting Security Information', error);
      res.status(500).send('error getting Security Information');
    })
})

app.post('/api/devices', async (req, res) => {
  const { name, user } = req.body;
  
  console.log(name+" added with username "+user)
  const newDevice = new Device({
    name,
    user
  });
  try {
    await newDevice.save();
    res.send('successfully added device and data');
  } catch (err) {
    res.send(err);
  }
});

app.post('/api/light', async (req, res) => {
  const { light, state } = req.body;
  const filter = { light: light };
  const update = { state: state };
  console.log("light " + light + " Updated!")
  console.log(state);
  try {
    const result = await Light.findOneAndUpdate(filter, update).exec();
    const updatedData = await Light.find({});
    res.json(updatedData);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating light state');
  }
});

app.post('/api/ac', async (req, res) => {
  const { id } = req.body;
  const { state, temperature, mode, speed } = req.body;

  const filter = { id: id };
  const update = { id: id, state: state, temperature: temperature, mode: mode, speed: speed };
  console.log("Ac " + id + " Updated! ")
  console.log(state);
  console.log(temperature);
  console.log(mode);
  console.log(speed);
  try {
    const result = await AC.findOneAndUpdate(filter, update).exec();
    const updatedData = await AC.find({});
    res.json(updatedData);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating AC');
  }
});

app.post('/api/security', async (req, res) => {
  const { id, name, access, camera } = req.body;

  const filter = { name: name };
  const update = { access: access, camera: camera };

  console.log("Security updated for " + name);
  console.log(access);
  console.log(camera);

  try {
    const result = await Security.findOneAndUpdate(filter, update).exec();
    const updatedData = await Security.find({});
    res.json(updatedData);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error Updating Security');
  }
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
