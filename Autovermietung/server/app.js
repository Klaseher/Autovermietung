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
const { time } = require('console')
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
        //sieht hier jede Bestellung (also auch Anfrage von Kunden)
        //bereits als vollständige Bestellung an 
        //--> Auto kann nicht gemietet werden, erst wenn Mitarbeiter Bestellung löschen würde
        db.getAllTimeframes((err, timeframes) => {
          if (err) return res.status(500).send('Error on the server.')
          let orderTime = [] 
          for (timee of timeframes){
            let found = false
            let index = 0
            for(i=0;i<orderTime.length;i++){
              if(orderTime[i].auto == timee.auto_fk){
                index = i
                found = true
                break
              }
            }
            if(!found){
              let length = orderTime.push({auto: timee.auto_fk, times:[]})
              index = length - 1
            }
            found = false
            orderTime[index].times.push({from: timee.startdatum, to: timee.enddatum})
          }
          //werden jetzt alle Autos und die zu ihnen gehörigen Bestellzeiträume zurückgegeben
          console.log(orderTime)
          return res.status(200).send({cars: cars, times: orderTime})
        })
      })
    }
    else{
      db.getCar(req.params.autoname, (err, car) => {
        if (err) return res.status(500).send('Error on the server.')
        if (!car) return res.status(404).send('Car not available')
        //sucht nach allen Bestellzeitraeumen fuer Auto
        db.getCarTimeframes(req.params.autoname, (err, carTimeframes) => {
          if (err) return res.status(500).send('Error on the server.')
          return res.status(200).send({car: car, carTimes: carTimeframes})
        })
      })
    } 
  }else {
    return res.status(404).send('Requested resource is not available')
  }
})

//schaeden auto holen
router.get('/car/:autoname/schaeden', (req, res) => {
  if(req.params.autoname != null){
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
             // nur mitarbeiter darf auf schaeden zugreifen
             if(user.rolle > 0){
               console.log(req.params.autoname)
              db.getOpenCarDamage(req.params.autoname, (err, cardamage) => {
                if (err) return res.status(500).send('Error on the server.')
                console.log(cardamage)
                if (cardamage.length == 0) return res.status(200).send({success: true}) // kein aktiver schaden ist erfolg
                return res.status(200).send({cardamage: cardamage})
              })
             }
            else{
              return res.status(401).send('Unauthorized access')  
            }
           })
         })
     } else {
         return res.status(403).send('Forbidden Access')
       }
   }else{
       return res.status(404).send('Requested resource is not available')
   }  
})

// bestellungen abbrechen 
router.put('/car/:autoname/schaeden/updateStatus', (req, res) => {
  if(req.body.status != null &&  req.body.pos != null){
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
             // nur mitarbeiter
             if(user.rolle > 0){
                db.updatePriority([req.body.status, req.params.autoname, req.body.pos], (err) => {
                  if (err) return res.status(500).send('Error on the server.')
                  return res.status(200).send({success: true})
              })
            }
            else{
              return res.status(401).send('Unauthorized access')  
            }
           })
         })
     } else {
         return res.status(403).send('Forbidden Access')
       }
   }else{
       return res.status(404).send('Requested resource is not available')
   }  
})

//schaeden auto erstellen
router.post('/car/:autoname/schaeden', (req, res) => {
  console.log(req.body)
  if(req.body.beschreibung != null && req.body.prio != null && req.body.typ != null && req.body.kosten != null){
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
             db.getAllCarDamage(req.params.autoname, (err, damage) => {
                if (err) return res.status(500).send('Error on the server.')
              // letzte positionszahl erhalten
                let posMax = 0
                if(damage.length == 1){
                  posMax = damage[0].pos
                }
                else{
                  for(let i=0;i<damage.length-1;i++){
                    if(damage[i].pos > damage[i+1].pos){
                      posMax = damage[i].pos
                    }
                    else{
                      posMax = damage[i+1].pos
                    }
                  }
              }
              // nur mitarbeiter darf schaeden hinzufuegen
              if(user.rolle > 0){
                db.createDamage([
                  req.params.autoname,
                  (posMax+1),
                  req.body.beschreibung,
                  req.body.prio,
                  req.body.typ,
                  req.body.kosten
                ], (err) => {
                  if (err) return res.status(500).send('Error on the server.')
                  return res.status(200).send({success: true, pos: posMax+1})
                })
              }
              else{
                return res.status(401).send('Unauthorized access')  
              }
            })
          })
         })
     } else {
         return res.status(403).send('Forbidden Access')
       }
   }else{
       return res.status(404).send('Requested resource is not available')
   }  
})

router.get('/rent/', (req, res) => {
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
        userr = ({vorname: user.vorname, nachname: user.nachname, user: user.user, adresse: user.adresse, telefon: user.telefon})
        return res.status(200).send({user: userr})
      })
    })
  } else {
    return res.status(403).send('Forbidden Access')
  }
})

// bestellung erstellen
router.post('/rent/', (req, res) => {
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
          // nur kunde darf bestellung erstellen
          if(user.rolle == 0){
            db.getCustomerOrders(user.id, (err, bestellungen) => {
              if (err) return res.status(500).send('Error on the server.')
              // darf nur eine aktive bestellung von kunden vorhanden sein --> aktiv = bestellung, deren status nicht "abgeschlossen" (3) ist
              if (bestellungen.length > 0) return res.status(500).send('You are already having an active order.\nGo into the account tab for more information on your orders')
              timestamp = moment.utc() //erstellzeitraum bestellung, damit mitarbeiter danach filtern kann
              db.createOrder([
                user.id,
                req.body.auto,
                req.body.start,
                req.body.ende,
                0,
                moment(timestamp).format('YYYY/MM/DD'),
              ], (err, value) => {
                if (err || !value) return res.status(500).send('Error on the server.')
                db.addCost([
                  value,
                  0,
                  req.body.kosten,
                  0,
                  'Standardkosten',
                ], (err) => {
                  if (err) return res.status(500).send('Error on the server.')
                  return res.status(200).send({success: true})
                })
              })
            })
        }else{
          return res.status(401).send('Unauthorized access')
        }
      })
    })
  } else {
    return res.status(403).send('Forbidden Access')
  }
})


// bestellungen holen (sowohl kunde als auch mitarbeiter)
router.get('/order/:bnr', (req, res) => {
 if(req.params.bnr != null){
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
            // wenn mind. mitarbeiter
            if (user.rolle > 0){
              if (req.params.bnr == "alle") {
                // alle bestellungen holen
                db.getAllOpenOrders((err, orders) => {
                  console.log(orders)
                  if (err) return res.status(500).send('Error on the server.')
                  if (!orders) return res.status(404).send('No Orders available')
                  return res.status(200).send({orders: orders})
                })
              }
              else{
                // sucht spezifische Bestellung mit bnr
                db.getOrderbyBnr(req.params.bnr, (err, order) => {
                  if (err) return res.status(500).send('Error on the server.')
                  if (!order) return res.status(404).send('Order not available')
                  return res.status(200).send({order: order})
                })
              } 
            } 
            // wenn kunde
            else{
              if (req.params.bnr == "alle") {
                // alle bestellungen holen
                db.getCustomerOrders(user.id, (err, orders) => {
                  if (err) return res.status(500).send('Error on the server.')
                  if (!orders) return res.status(404).send('No Orders available')
                  return res.status(200).send({orders: orders})
                })
              }
              else{
                // sucht spezifische Bestellung mit bnr
                db.getCustomerOrderbyBnr(user.id, req.params.bnr, (err, order) => {
                  if (err) return res.status(500).send('Error on the server.')
                  if (!order) return res.status(404).send('Order not available')
                  return res.status(200).send({order: order})
                })
              } 
            }
          })
        })
    } else {
        return res.status(403).send('Forbidden Access')
      }
  }else{
      return res.status(404).send('Requested resource is not available')
  }  
})

// testen, ob bestellung mit auto u. bnr vorhanden
router.get('/order/:bnr/:autoname', (req, res) => {
 if(req.params.bnr != null){
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
            // wenn mind. mitarbeiter
            if (user.rolle > 0){
              console.log(req.params.bnr, req.params.autoname)
              db.getOrderbyBnrAndCar(req.params.bnr, req.params.autoname, (err, order) => {
                console.log(err)
                console.log(order)
                if (err) return res.status(500).send('Error on the server.')
                if (!order) return res.status(200).send({success: false})
                return res.status(200).send({success: true})
              })
            } 
            else{
              res.status(401).send('Unauthorized access')
            }
          })
        })
    } else {
        return res.status(403).send('Forbidden Access')
      }
  }else{
      return res.status(404).send('Requested resource is not available')
  }  
})

// bestellungen abbrechen 
router.put('/order/:bnr/updateStatus', (req, res) => {
  if(req.params.bnr != null && req.body.status != null){
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
             // kunde darf nur eigene bestellungen bearbeiten
             if(user.rolle = 0){
              db.getCustomerOrderbyBnr(user.id, req.param.bnr, (err, orders) => {
                if (err) return res.status(500).send('Error on the server.')
                if (!orders) return res.status(404).send('No Orders available') // abbruch, wenn fremde bestellung angefragt
                db.updateStatusOrder(req.params.bnr, req.body.status, (err) => {
                  if (err) return res.status(500).send('Error on the server.')
                  return res.status(200).send({success: true})
                })    
              })
             }
            else{
              db.updateStatusOrder(req.params.bnr, req.body.status, (err) => {
                if (err) return res.status(500).send('Error on the server.')
                console.log("jennsgknk")
                return res.status(200).send({success: true})
              })    
            }
           })
         })
     } else {
         return res.status(403).send('Forbidden Access')
       }
   }else{
       return res.status(404).send('Requested resource is not available')
   }  
})

//kosten holen
router.get('/order/:bnr/cost', (req, res) => {
  if(req.params.bnr != null){
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
             db.getOrderCost(req.params.bnr, (err, costs) => {
              if (err || !costs) return res.status(500).send('Error on the server.')
              //Kunde darf nur auf eigene Bestellungen zugreifen
              if(user.rolle == 0 && (user.id != costs[0].user_fk)){
                  res.status(401).send('Unauthorized access')
              }
              return res.status(200).send({costs: costs})
            })    
           })
         })
     } else {
         return res.status(403).send('Forbidden Access')
       }
   }else{
       return res.status(404).send('Requested resource is not available')
   }  
})

//kosten holen
router.post('/order/:bnr/cost', (req, res) => {
  if(req.params.bnr != null && req.body.typ != null && req.body.kosten){
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
             db.getOrderCost(req.params.bnr, (err, costs) => {
              if (err || !costs) return res.status(500).send('Error on the server.')
              //Kunde darf nur auf eigene Bestellungen zugreifen
              if(user.rolle == 0 && (user.id != costs[0].user_fk)){
                  res.status(401).send('Unauthorized access')
              }
              // letzte positionszahl erhalten
              let posMax = 0
              if(costs.length == 1){
                posMax = costs[0].pos
              }
              else{
                for(let i=0;i<costs.length-1;i++){
                  if(costs[i].pos > costs[i+1].pos){
                    posMax = costs[i].pos
                  }
                  else{
                    posMax = costs[i+1].pos
                  }
                }
             }
              db.addOrderCost(
                [req.params.bnr, 
                  (posMax+1), 
                  req.body.kosten,
                  req.body.typ,
                  req.body.beschreibung
                ], (err) => {
                  if (err) return res.status(500).send('Error on the server.')
                  return res.status(200).send({success: true})
              })    
            })    
           })
         })
     } else {
         return res.status(403).send('Forbidden Access')
       }
   }else{
       return res.status(404).send('Requested resource is not available')
   }  
})


app.use(router)

let port = process.env.PORT || 3000

// eslint-disable-next-line no-unused-vars
let server = app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
