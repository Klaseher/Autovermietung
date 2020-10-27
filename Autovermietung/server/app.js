const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { error } = require('shelljs');


const db = new DB("sqlitedb");
const app = express();
const router = express.Router();


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cookieParser());

//CORS middleware 
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); //website that sends request
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });

router.post('/register', function(req, res) {
    db.insert([
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8),
        0
    ],
    function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        db.selectByEmail(req.body.email, (err,user) => {
            if (err) return res.status(500).send("There was a problem getting user")
            res.status(200).send({ auth: true});
        });
    });
});

router.post('/register-employee', function(req, res) {
    db.insert([
        null,
        req.body.username,
        bcrypt.hashSync(req.body.password, 8),
        1
    ],
    function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        db.selectByEmail(req.body.email, (err,user) => {
            if (err) return res.status(500).send("There was a problem getting user")
            res.status(200).send({auth: true});
        });
    });
});

router.post('/login', (req, res) => {
    db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('Invalid Login');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send("Invalid Login");
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 3600 // expires in 1 hour
        });
        res.cookie('jwt', token, {
            maxAge: 6*1000*60,
            httpOnly: true,
            secure: false //true in production
        });
        res.status(200).send({ auth: true, role: user.is_admin});
    })
})

router.get('/authenticate', (req, res) => {
    let token = req.cookies.jwt
    if (token) {
        // verify secret
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).send("Unauthorized access");
            }
            db.selectById(decoded.id, (err, user) => {
                if (err) return res.status(500).send('Error on the server.');
                if (!user) return res.status(404).send('Invalid User');   
                return res.status(200).send({ auth: true, role: user.is_admin});
            })
        })
    }
    else{
        return res.status(403).send("Forbidden Access")
    } 
})

router.get('/testToken', (req, res) => {
    let token = req.cookies.jwt
    let error = false;
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                error = true
            }
            else{
            db.selectById(decoded.id, (err, user) => {
                if (err || !user){
                    error = true
                } 
                else{
                    return res.status(200).send({ auth: true, role: user.is_admin});
                }
            })
         }
      })
    }
    else{
        return res.status(403).send({ auth: null, role: null});
    } 
    if(error){
        error = false
        return res.status(403).send({ auth: null, role: null});
    }
})

app.use(router)

let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});