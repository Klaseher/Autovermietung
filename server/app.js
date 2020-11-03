// Beinhaltet all die Logik des Nodejs Express-Servers,
// d.h. Anfragen Client annehmen, bearbeiten, Daten zurücksetzen

//benötigte Dependencies
const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const file = "" //Pfad zu Datenbank
const db = new DB(file)
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Hier werden routes definiert






//Server starten
app.use(router)

let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});
