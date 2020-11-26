//Backend
//Express-Server, der Anfragen von Frontend an jeweiligen Endpunkten übernimmt
const express = require('express')
const DB = require('./db')
const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const moment = require('moment')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
moment().format()

const db = new DB('autovermietung.db') //DB wird geöffnet --> siehe db.js
const app = express()
const router = express.Router()

//Mailoptionen für Senden Email von Gmail-Account
let transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587, // tsl port gmail smpt server
  secure: true, // übertragung über ssl/ttl
  auth: {
    user: 'carsharing23@gmail.com',
    pass: 'iwrfbrcwouhgvpdi'
  }
})
let mailOptions;


router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(cookieParser())

// CORS middleware
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080') // webseite, die requests sendet
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  next()
})

//Registrieren Kunden durch Hinzufügen Daten in Datenbank 
router.post('/register', function (req, res) {
  db.insert([
    req.body.name,
    req.body.vorname,
    req.body.email,
    bcrypt.hashSync(req.body.password, 8),
    req.body.address,
    req.body.telephone,
    0,
    0
  ],
  function (err) {
    if (err) return res.status(500).send('There was a problem registering the user.')
    db.selectByEmail(req.body.email, (err, user) => {
        if (err || !user) return res.status(500).send('Error on the server.')
        if (!user) return res.status(404).send('Credentials invalid')
        let valid = moment.utc().add(24, 'hours') // valid for 1 day
        //Erstellen sicheres Token und Speichern in DB
        let token = crypto.randomBytes(32).toString('hex')
        db.updateReset([
          bcrypt.hashSync(token, 8),
          moment(valid).format('YYYY-MM-DD HH:mm:ss'),
          user.id
        ],
        function (err) {
          if (err) return res.status(500).send('Error on the server.')
          mailOptions = {
            from: '"Autovermietung" <service@autovermietung.de>',
            to: user.user,
            subject: 'Verifizieren Sie Ihren Account',
            html: '<h4><b>Account verifizieren</b></h4>' +
            'Hallo Herr/Frau ' + user.nachname + ',' +
            '<p>Um Ihren Account zu verifizeren, drücken Sie auf diesen Link:</p>' +
            '<a href=' + 'http://localhost:3000/verify-account/' + user.id + '/' + token + '>Account verifizeren</a>' +
            '<p>Dieser Link ist für 24h gültig</p>' +
            '<br><br>' +
            '<p>--Ihr Autovermietung-Team</p>'
          }
          transporter.sendMail(mailOptions, function (error, info) { // sending mail to user where he can verify account. User id and the token are sent as params in a link
            if (error) {
              res.status(500).send('Error on the server.')
            } else {
              console.log('Verifizierungs-Email erfolgreich gesendet')
              res.status(200).send('User successfully created!\nPlease verify your account first by clicking on the link sent to the provided email')
            }
          })
        })
    })
  })
})

//Mitarbeiter registrieren
router.post('/register-employee', function (req, res) {
  let token = req.cookies.jwt
  let userr = null
  //Da nur Admin dies tun darf, wird hier verifizert, ob Anfragender Adminrechte hat
  confirmToken(token,res, function(ausgabe){
    if(ausgabe.role != -1) {
        userr = ausgabe.user
        //Wenn Anfragender Adminrechte hat, dann wird Mitarbeiter erstellt, sonst Fehler
        if (userr.rolle == 2) {
          db.insert([
            req.body.name,
            req.body.vorname,
            req.body.username,
            bcrypt.hashSync(req.body.password, 8),
            'n.a',
            null,
            1,
            1
          ],
          function (err) {
            if (err) return res.status(500).send('There was a problem registering the user.')
            res.status(200).send('Employee successfully created!')
          })
        } else {
          return res.status(401).send('Unauthorized access')
        }
    } else {
    if(ausgabe.auth == 403) return ausgabe.res.status(ausgabe.auth).send('Forbidden Access')
    else if(ausgabe.auth == 401) return ausgabe.res.status(ausgabe.auth).send('Unauthorized access')
    else if(ausgabe.auth == 404) return ausgabe.res.status(ausgabe.auth).send('Requested resource is not available')
    else if(ausgabe.auth == 500) return ausgabe.res.status(ausgabe.auth).send('Error on the server.')
    }
  })
})

//Loginprozess
router.post('/login', (req, res) => {
  //wird geschaut, ob gesendetr Username/Email und PW mit gespeicherten Daten übereinstimmen
  db.selectByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(404).send('Credentials invalid')
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.pass)
    if (!passwordIsValid) return res.status(401).send('Credentials invalid')
    //Wenn Account verifiziert wurde
    if(user.aktiviert == 1){
      //Erstellen JWT-Token und Speichern in Cookie, sodass Kunde diesen immer automatisch mitsendet
      let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 3600 // expires in 1 hour
      })
      res.cookie('jwt', token, {
        maxAge: 60 * 60 * 1000, // expires in 1 h
        httpOnly: true, //not accesible via javscript by clinet
        secure: false // true in production --> only https
      })
      //zurücksenden Erfolg der Authentifizierung + Rolle, die in Browser temporär gespeichert werden
      res.status(200).send({auth: true, role: user.rolle})
    }
    //Wenn nicht verifiziert
    else if(user.aktiviert == 0){
      let valid = moment.utc().add(24, 'hours') // valid for 1 day
      //Erstellen sicheres Token und Speichern in DB
      let token = crypto.randomBytes(32).toString('hex')
      db.updateReset([
        bcrypt.hashSync(token, 8),
        moment(valid).format('YYYY-MM-DD HH:mm:ss'),
        user.id
      ],
      function (err) {
          if (err) return res.status(500).send('Error on the server.')
          mailOptions = {
          from: '"Autovermietung" <service@autovermietung.de>',
          to: user.user,
          subject: 'Verifizieren Sie Ihren Account',
          html: '<h4><b>Account verifizieren</b></h4>' +
          'Hallo Herr/Frau ' + user.nachname + ',' +
          '<p>Um Ihren Account zu verifizeren, drücken Sie auf diesen Link:</p>' +
          '<a href=' + 'http://localhost:3000/verify-account/' + user.id + '/' + token + '>Account verifizeren</a>' +
          '<p>Dieser Link ist für 24h gültig</p>' +
          '<br><br>' +
          '<p>--Ihr Autovermietung-Team</p>'
        }
        transporter.sendMail(mailOptions, function (error, info) { // sending mail to user where he can verify account. User id and the token are sent as params in a link
          if (error) {
            res.status(500).send('Error on the server.')
          } else {
            console.log('Verifizierungs-Email erfolgreich gesendet')
            res.status(420).send('We\'ve sent a verification email. Please verify your account first before logging in again')
          }
        })
      })
    }
    else{
      res.status(500).send('Error on the server.')
    }
  })
})

//Anfrage Kunde, um Passwort ändern zu können
router.post('/reset-userpw', (req, res) => {
  //Test, ob Email vorhanden ist
  db.selectByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(200).send({success: true})
    let valid = moment.utc().add(24, 'hours') // valid for 1 day
    //Wenn Rücksetz-Anfrage von Passwort und nur wenn Account bereits verifizert ist und nur durch Kunden nutzbar
    if (user.rolle == 0 && user.aktiviert == 1) {
      //Erstellen sicheres Token und Speichern in DB
      let token = crypto.randomBytes(32).toString('hex')
      db.updateReset([
        bcrypt.hashSync(token, 8),
        moment(valid).format('YYYY-MM-DD HH:mm:ss'),
        user.id
      ],
      function (err) {
        if (err) return res.status(500).send('Error on the server.')
        //Senden Email an Kunden mit enthaltenen Token und Link auf Website zum Zurücksetzen PW
        //Mail-Inhalt
        mailOptions = {
          from: '"Autovermietung" <service@autovermietung.de>',
          to: user.user,
          subject: 'Setzen Sie Ihr Account-Passwort zurück',
          html: '<h4><b>Passwort zurücksetzen</b></h4>' +
        '<p>Um Ihr Passwort zurückzusetzen, drücken Sie auf diesen Link:</p>' +
        '<a href=' + 'http://localhost:8080/reset/' + user.id + '/' + token + '>Setzen Sie Ihr Passwort zurück</a>' +
        '<p>Dieser Link ist für 24h gültig</p>' +
        '<br><br>' +
        '<p>--Ihr Autovermietung-Team</p>'
        }
        transporter.sendMail(mailOptions, function (error, info) { // sending mail to user where he can reset password. User id and the token are sent as params in a link
          if (error) {
            res.status(500).send('Error on the server.')
          } else {
            console.log('Rücksetz-Email erfolgreich gesendet')
            res.status(200).send({success: true})
          }
        })
      })
    } else {
      res.status(420).send('The account is either not available or not verified. Please check your emails for a verification link')
    }
  })
})

//Passwort ändern von Kunden
router.post('/confirm-pwreset', (req, res) => {
  //Wenn Link gültig, d.h. ID Kunde + Token, dann wird PW von Kunde in DB geändert
  db.selectById(req.body.id, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user || (user.ablaufdatum == null && user.resetToken == null)) return res.status(404).send('Invalid or expired reset link')
    let tokenIsValid = bcrypt.compareSync(req.body.token, user.resetToken)
    if (!tokenIsValid) return res.status(401).send('Invalid or expired reset link')
    let currentTime = moment.utc()
    let currentTimeFormated = moment(currentTime).format('YYYY-MM-DD HH:mm:ss')
    let isafter = moment(currentTimeFormated).isAfter(user.ablaufdatum)
    db.updateReset([
      null,
      null,
      req.body.id
    ], (err) => {
      if (err) return res.status(500).send('Error on the server.')
      if (isafter) return res.status(401).send('Invalid or expired reset link')
      db.updatePass(bcrypt.hashSync(req.body.password, 8), req.body.id, (err) => {
        if (err) return res.status(500).send('Error on the server.')
        return res.status(200).send({success: true})
      })
    })
  })
})

router.get('/verify-account/:id/:token', (req, res) => {
  //Wenn Link gültig, d.h. ID Kunde + Token, dann wird Account verifiziert
  db.selectById(req.params.id, (err, user) => {
    if (err) return res.status(500).end('<h1>Error on the server.</h1>')
    if (!user || (user.ablaufdatum == null && user.resetToken == null)) return res.status(404).end('<h1>Invalid or expired reset link</h1>')
    let tokenIsValid = bcrypt.compareSync(req.params.token, user.resetToken)
    if (!tokenIsValid) return res.status(401).end('<h1>Invalid or expired reset link</h1>')
    let currentTime = moment.utc()
    let currentTimeFormated = moment(currentTime).format('YYYY-MM-DD HH:mm:ss')
    let isafter = moment(currentTimeFormated).isAfter(user.ablaufdatum)
    db.updateReset([
      null,
      null,
      req.params.id
    ], (err) => {
      if (err) return res.status(500).end('<h1>Error on the server.</h1>')
      if (isafter) return res.status(401).end('<h1>Invalid or expired reset link</h1>')
      db.verifyUser(req.params.id, (err) => {
        if (err) return res.status(500).end('<h1>Error on the server.</h1>')
        res.status(200).end("<h1>Der Account wurde erfolgreich verifiziert</h1>" + '<p> <a href=' + 'http://localhost:8080/login>Zum Login</a></p>')
      })
    })
  })
})

//Mitarbeiter-Daten aktualisieren/ändern durch Admin
router.put('/employee/:id', (req, res) => {
  let token = req.cookies.jwt
  let userr = null
  //Wenn Person keine Adminrechte oder Person nicht der Mitarbeiter ist,
  //von dem die Daten geändert werden sollen (also falsche ID), dann Fehler
  confirmToken(token,res, function(ausgabe){
    if(ausgabe.role != -1) {
          userr = ausgabe.user
          if (req.params.id != null && (userr.rolle == 2 || (userr.rolle == 1 && userr.id == req.params.id))) {
            if (req.body.name != null && req.body.username == null && req.body.password == null) {
              db.updateName(req.body.name, req.params.id, (err) => {
                if (err) return ausgabe.res.status(500).send('Error on the server.')
                return ausgabe.res.status(200).send({name: req.body.name})
              })
            } else if (req.body.name == null && req.body.username != null && req.body.password == null) {
              db.updateMail(req.body.username, req.params.id, (err) => {
                if (err) return ausgabe.res.status(500).send('Error on the server.')
                return ausgabe.res.status(200).send({username: req.body.username})
              })
            } else if (req.body.name == null && req.body.username == null && req.body.password != null) {
              db.updatePass(bcrypt.hashSync(req.body.password, 8), req.params.id, (err) => {
                if (err) return ausgabe.res.status(500).send('Error on the server.')
                return ausgabe.res.status(200).send(null)
              })
            } else { return ausgabe.res.status(400).send('Invalid request') }
          } else if (userr.rolle < 1) {
            return ausgabe.res.status(401).send('Unauthorized access')
          } else {
            return ausgabe.res.status(400).send('Invalid request')
          }
    } else {
      if(ausgabe.auth == 403) return ausgabe.res.status(ausgabe.auth).send('Forbidden Access')
      else if(ausgabe.auth == 401) return ausgabe.res.status(ausgabe.auth).send('Unauthorized access')
      else if(ausgabe.auth == 404) return ausgabe.res.status(ausgabe.auth).send('Requested resource is not available')
      else if(ausgabe.auth == 500) return ausgabe.res.status(ausgabe.auth).send('Error on the server.')
    }
  })
})

//Mitarbeiter aus DB löschen
router.delete('/employee/:id', (req, res) => {
  let token = req.cookies.jwt
  //Wenn keine Adminrechte, dann Fehler
  confirmToken(token,res, function(ausgabe){
    if(ausgabe.role != -1) {
          db.deleteAccount(req.params.id, (err) => {
            if (err) return ausgabe.res.status(500).send('Error on the server.')
            return ausgabe.res.status(200).send(null)
          })
    } else {
      if(ausgabe.auth == 403) return ausgabe.res.status(ausgabe.auth).send('Forbidden Access')
      else if(ausgabe.auth == 401) return ausgabe.res.status(ausgabe.auth).send('Unauthorized access')
      else if(ausgabe.auth == 404) return ausgabe.res.status(ausgabe.auth).send('Requested resource is not available')
      else if(ausgabe.auth == 500) return ausgabe.res.status(ausgabe.auth).send('Error on the server.')
    }
  })  
})

//Test der Zugriffsrechte Person durch Auswertung JWT in Cookie
router.get('/authenticate', (req, res) => {
  let token = req.cookies.jwt
  //Wenn Token vorhanden, Verifizerung, ob Token gültig
  confirmToken(token,res, function(ausgabe){
    if(ausgabe.role != -1) {
          return ausgabe.res.status(200).send({auth: true, role: ausgabe.role})
    } else {
      if(ausgabe.auth == 403) return ausgabe.res.status(ausgabe.auth).send('Forbidden Access')
      else if(ausgabe.auth == 401) return ausgabe.res.status(ausgabe.auth).send('Unauthorized access')
      else if(ausgabe.auth == 404) return ausgabe.res.status(ausgabe.auth).send('Requested resource is not available')
      else if(ausgabe.auth == 500) return ausgabe.res.status(ausgabe.auth).send('Error on the server.')
    }
  })
})


//Mitarbeiter holen
router.get('/employee/:id', (req, res) => {
  let token = req.cookies.jwt
  let userr = null
  confirmToken(token,res, function(ausgabe){
    if(ausgabe.role != -1) {
          userr = ausgabe.user
          if (req.params.id != null) {
            //Wenn Paramter -200, dann alle Mitarbeiter holen
            if (req.params.id == -200) {
              //Nur Admin darf das
              if (userr.rolle == 2) {
                db.getAllEmployees((err, users) => {
                  if (err) return ausgabe.res.status(500).send('Error on the server.')
                  if (!users) return ausgabe.res.status(404).send('No Employees available')
                  return ausgabe.res.status(200).send({employees: users})
                })
              } else {
                return ausgabe.res.status(401).send('Unauthorized access')
              }
            } else {
              //Wenn andere ID, dann Mitarbeiter holen und testen, ob
              //Adminrechte oder ID der des anfragenden Mitarbeiters entspricht
              db.selectById(req.params.id, (err, user) => {
                if (err) return ausgabe.res.status(500).send('Error on the server.')
                if (!user) return ausgabe.res.status(404).send('Employee not found')
                if (userr.rolle == 2 || (userr.rolle == 1 && userr.id == user.id)) {
                  let employee = {id: user.id, name: user.nachname, email: user.user}
                  return ausgabe.res.status(200).send({employee: employee})
                } else {
                  return ausgabe.res.status(401).send('Unauthorized access')
                }
              })
            }
          } else {
            return ausgabe.res.status(404).send('Requested resource is not available')
          }
    } else {
      if(ausgabe.auth == 403) return ausgabe.res.status(ausgabe.auth).send('Forbidden Access')
      else if(ausgabe.auth == 401) return ausgabe.res.status(ausgabe.auth).send('Unauthorized access')
      else if(ausgabe.auth == 404) return ausgabe.res.status(ausgabe.auth).send('Requested resource is not available')
      else if(ausgabe.auth == 500) return ausgabe.res.status(ausgabe.auth).send('Error on the server.')
    }
  })
})

//Auto(s) holen
router.get('/car/:autoname', (req, res) => {
  if(req.params.autoname != null){
    if (req.params.autoname == "alle") {
      db.getAllCars((err, cars) => {
        if (err) return res.status(500).send('Error on the server.')
        if (!cars) return res.status(404).send('No Cars available')
        console.log(cars)
        return res.status(200).send({cars: cars})
      })
    }
    else{
      db.getCar(req.params.autoname, (err, car) => {
        if (err) return res.status(500).send('Error on the server.')
        if (!car) return res.status(404).send('Car not available')
        return res.status(200).send({car: car})
      })
    } 
  }else {
    return res.status(404).send('Requested resource is not available')
  }
})

//Wenn Token vorhanden, Verifizerung, ob Token gültig
//Danach werden entschlüsselte Daten aus Token geholt, um Person in DB zu suchen
//Wird Zugriffsrecht Person zurückgegeben, sonst Fehler
function confirmToken (token, res, callback)
{
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.clearCookie('jwt')
        callback({auth: 401, role: -1, res: res})
        return
      }
      //Aus Token Infos über Person (ID) lesen und diese aus DB holen
      db.selectById(decoded.id, (err, user) => {
        if (err) {
          res.clearCookie('jwt')
          callback({auth: 500, role: -1, res: res})
          return
        }
        //Wenn Nutzer vorhanden ist, dann Rücksenden der Zugrissrechte (Rolle)
        //sonst Fehler
        if (!user) {
          res.clearCookie('jwt')
          callback({auth: 404, role: -1, res: res})
          return
        } 
        callback({auth: true, role: user.rolle, user: user, res: res})
      })
    })
  } else {
    callback({auth: 403, role: -1, res: res})
  }
}

app.use(router)

let port = process.env.PORT || 3000

// eslint-disable-next-line no-unused-vars
let server = app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
