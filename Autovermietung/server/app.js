/* eslint-disable eqeqeq */
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

const db = new DB('autovermietung.db')
const app = express()
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(cookieParser())

// CORS middleware
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080') // website that sends request
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  next()
})

router.post('/register', function (req, res) {
  db.insert([
    req.body.name,
    req.body.vorname,
    req.body.email,
    bcrypt.hashSync(req.body.password, 8),
    req.body.address,
    req.body.telephone,
    0
  ],
  function (err) {
    if (err) return res.status(500).send('There was a problem registering the user.')
    res.status(200).send('User successfully created!\n Please go to the Login-Page and login with your credentials to access your account')
  })
})

router.post('/register-employee', function (req, res) {
  let token = req.cookies.jwt
  let userr = null
  if (token) {
    // verify secret
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.clearCookie('jwt')
        return res.status(401).send('Unauthorized access')
      }
      db.selectById(decoded.id, (err, user) => {
        if (err) {
          res.clearCookie('jwt')
          return res.status(500).send('Error on the server.')
        }
        if (!user) {
          res.clearCookie('jwt')
          return res.status(404).send('Invalid User')
        }
        userr = user
        if (userr.rolle == 2) {
          db.insert([
            req.body.name,
            req.body.vorname,
            req.body.username,
            bcrypt.hashSync(req.body.password, 8),
            'n.a',
            null,
            1
          ],
          function (err) {
            if (err) return res.status(500).send('There was a problem registering the user.')
            res.status(200).send('Employee successfully created!')
          })
        } else {
          return res.status(401).send('Unauthorized access')
        }
      })
    })
  } else {
    return res.status(403).send('Forbidden Access')
  }
})

router.post('/login', (req, res) => {
  db.selectByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(404).send('Credentials invalid')
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.pass)
    if (!passwordIsValid) return res.status(401).send('Credentials invalid')
    let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 3600 // expires in 1 hour
    })
    res.cookie('jwt', token, {
      maxAge: 60 * 60 * 1000, // expires in 1 h
      httpOnly: true,
      secure: false // true in production
    })
    res.status(200).send({auth: true, role: user.rolle})
  })
})

router.post('/reset-userpw', (req, res) => {
  db.selectByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(200).send({success: true})
    let valid = moment.utc().add(24, 'hours') // valid for 1 day
    if (user.rolle == 0) {
      let token = crypto.randomBytes(32).toString('hex')
      db.updateReset([
        bcrypt.hashSync(token, 8),
        moment(valid).format('YYYY-MM-DD HH:mm:ss'),
        user.id
      ],
      function (err) {
        if (err) return res.status(500).send('Error on the server.')
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          port: 587, // tsl port gmail smpt server
          secure: true, // übertragung über ssl/ttl
          auth: {
            user: 'carsharing23@gmail.com',
            pass: 'iwrfbrcwouhgvpdi'
          }
        })
        let mailOptions = {
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
            console.log('Email erfolgreich gesendet')
            res.status(200).send({success: true})
          }
        })
      })
    } else {
      res.status(500).send('Error on the server.')
    }
  })
})

router.post('/confirm-pwreset', (req, res) => {
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

router.put('/employee/:id', (req, res) => {
  let token = req.cookies.jwt
  let userr = null
  if (token) {
    // verify secret
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.clearCookie('jwt')
        return res.status(401).send('Unauthorized access')
      }
      db.selectById(decoded.id, (err, user) => {
        if (err) {
          res.clearCookie('jwt')
          return res.status(500).send('Error on the server.')
        }
        if (!user) {
          res.clearCookie('jwt')
          return res.status(404).send('Invalid User')
        }
        userr = user
        if (req.params.id != null && (userr.rolle == 2 || (userr.rolle == 1 && userr.id == req.params.id))) {
          if (req.body.name != null && req.body.username == null && req.body.password == null) {
            db.updateName(req.body.name, req.params.id, (err) => {
              if (err) return res.status(500).send('Error on the server.')
              return res.status(200).send({name: req.body.name})
            })
          } else if (req.body.name == null && req.body.username != null && req.body.password == null) {
            db.updateMail(req.body.username, req.params.id, (err) => {
              if (err) return res.status(500).send('Error on the server.')
              return res.status(200).send({username: req.body.username})
            })
          } else if (req.body.name == null && req.body.username == null && req.body.password != null) {
            db.updatePass(bcrypt.hashSync(req.body.password, 8), req.params.id, (err) => {
              if (err) return res.status(500).send('Error on the server.')
              return res.status(200).send(null)
            })
          } else { return res.status(400).send('Invalid request') }
        } else if (userr.rolle < 1) {
          return res.status(401).send('Unauthorized access')
        } else {
          return res.status(400).send('Invalid request')
        }
      })
    })
  } else {
    return res.status(405).send('Method not allowed')
  }
})

router.delete('/employee/:id', (req, res) => {
  let token = req.cookies.jwt
  if (token) {
    // verify secret
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.clearCookie('jwt')
        return res.status(401).send('Unauthorized access')
      }
      db.selectById(decoded.id, (err, user) => {
        if (err) {
          res.clearCookie('jwt')
          return res.status(500).send('Error on the server.')
        }
        if (!user) {
          res.clearCookie('jwt')
          return res.status(404).send('Invalid User')
        }
        db.deleteAccount(req.params.id, (err) => {
          if (err) return res.status(500).send('Error on the server.')
          return res.status(200).send(null)
        })
      })
    })
  } else {
    return res.status(405).send('Method not allowed')
  }
})

router.get('/authenticate', (req, res) => {
  let token = req.cookies.jwt
  if (token) {
    // verify secret
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.clearCookie('jwt')
        return res.status(401).send('Unauthorized access')
      }
      db.selectById(decoded.id, (err, user) => {
        if (err) {
          res.clearCookie('jwt')
          return res.status(500).send('Error on the server.')
        }
        if (!user) {
          res.clearCookie('jwt')
          return res.status(404).send('Invalid User')
        }
        return res.status(200).send({auth: true, role: user.rolle})
      })
    })
  } else {
    return res.status(403).send('Forbidden Access')
  }
})

router.get('/testToken', (req, res) => {
  let token = req.cookies.jwt
  let error = false
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        error = true
      } else {
        db.selectById(decoded.id, (err, user) => {
          if (err || !user) {
            error = true
          } else {
            return res.status(200).send({auth: true, role: user.rolle})
          }
        })
      }
    })
  } else {
    return res.status(403).send({auth: null, role: null})
  }
  if (error) {
    res.clearCookie('jwt')
    error = false
    return res.status(403).send({auth: null, role: null})
  }
})

router.get('/employee/:id', (req, res) => {
  let token = req.cookies.jwt
  let userr = null
  if (token) {
    // verify secret
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.clearCookie('jwt')
        return res.status(401).send('Unauthorized access')
      }
      db.selectById(decoded.id, (err, user) => {
        if (err) {
          res.clearCookie('jwt')
          return res.status(500).send('Error on the server.')
        }
        if (!user) {
          res.clearCookie('jwt')
          return res.status(404).send('Invalid User')
        }
        userr = user
        if (req.params.id != null) {
          if (req.params.id == -200) {
            if (userr.rolle == 2) {
              db.getAllEmployees((err, users) => {
                if (err) return res.status(500).send('Error on the server.')
                if (!users) return res.status(404).send('No Employees available')
                return res.status(200).send({employees: users})
              })
            } else {
              return res.status(401).send('Unauthorized access')
            }
          } else {
            db.selectById(req.params.id, (err, user) => {
              if (err) return res.status(500).send('Error on the server.')
              if (!user) return res.status(404).send('Employee not found')
              if (userr.rolle == 2 || (userr.rolle == 1 && userr.id == user.id)) {
                let employee = {id: user.id, name: user.nachname, email: user.user}
                return res.status(200).send({employee: employee})
              } else {
                return res.status(401).send('Unauthorized access')
              }
            })
          }
        } else {
          return res.status(404).send('Requested resource is not available')
        }
      })
    })
  } else {
    return res.status(403).send('Forbidden Access')
  }
})

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

router.get('/rent/autoname', (req, res) => {
  if(req.params.autoname != null){
    db.selectById(req.params.id, (err, user) => {
      if (err) return res.status(500).send('Error on the server.')
      if (!user) return res.status(404).send('Employee not found')
      if (userr.rolle == 2 || (userr.rolle == 1 && userr.id == user.id)) {
        let employee = {id: user.id, name: user.nachname, email: user.user}
        return res.status(200).send({employee: employee})
      } else {
        return res.status(401).send('Unauthorized access')
      }
    })
  }else {
    return res.status(404).send('Requested resource is not available')
  }
})

app.use(router)

let port = process.env.PORT || 3000

// eslint-disable-next-line no-unused-vars
let server = app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
