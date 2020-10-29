/* eslint-disable eqeqeq */
const express = require('express')
const DB = require('./db')
const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const db = new DB('sqlitedb')
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
    req.body.email,
    bcrypt.hashSync(req.body.password, 8),
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
      })
    })
  } else {
    return res.status(403).send('Forbidden Access')
  }
  if (userr.is_admin == 2) {
    db.insert([
      req.body.name,
      req.body.username,
      bcrypt.hashSync(req.body.password, 8),
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

router.post('/login', (req, res) => {
  db.selectByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(404).send('Invalid Login')
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass)
    if (!passwordIsValid) return res.status(401).send('Invalid Login')
    let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 3600 // expires in 1 hour
    })
    res.cookie('jwt', token, {
      maxAge: 60 * 60 * 1000, // expires in 1 h
      httpOnly: true,
      secure: false // true in production
    })
    res.status(200).send({auth: true, role: user.is_admin})
  })
})
//bug
router.post('/update-employee', (req, res) => {
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
        if (req.body.id != null && (userr.is_admin == 2 || (userr.is_admin == 1 && userr.id == req.body.id))) {
          if (req.body.name != null && req.body.email == null && req.body.password == null && req.body.new_password == null) {
            db.updateName(req.body.name, req.body.id, (err) => {
              if (err) return res.status(500).send('Error on the server.')
              return res.status(200).send({name: req.body.name})
            })
          } else if (req.body.name == null && req.body.email != null && req.body.password == null && req.body.new_password == null) {
          } else if (req.body.name == null && req.body.email == null && req.body.password != null && req.body.new_password != null) {
          } else { return res.status(400).send('Invalid request') }
        } else if (userr.is_admin < 1) {
          return res.status(401).send('Unauthorized access')
        } else {
          return res.status(400).send('Invalid request')
        }
      })
    })
  } else {
    return res.status(403).send('Forbidden Access')
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
        return res.status(200).send({auth: true, role: user.is_admin})
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
            return res.status(200).send({auth: true, role: user.is_admin})
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

router.get('/employee/:username', (req, res) => {
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
        if (req.params.username != null) {
          if (req.params.username === 'all') {
            if (userr.is_admin == 2) {
              db.getAllEmployees((err, users) => {
                if (err) return res.status(500).send('Error on the server.')
                if (!users) return res.status(404).send('No Employees available')
                return res.status(200).send({employees: users})
              })
            } else {
              return res.status(401).send('Unauthorized access')
            }
          } else {
            db.selectByEmail(req.params.username, (err, user) => {
              if (err) return res.status(500).send('Error on the server.')
              if (!user) return res.status(404).send('Employee not found')
              if (userr.is_admin == 2 || (userr.is_admin == 1 && userr.id == user.id)) {
                let employee = {id: user.id, name: user.name, email: user.email}
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

app.use(router)

let port = process.env.PORT || 3000

// eslint-disable-next-line no-unused-vars
let server = app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
