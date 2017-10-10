const express = require('express')
const jwt = require('jsonwebtoken');
const router = express.Router()
const knex = require('../db')
const bcrypt = require('bcrypt-as-promised');

//sign in user
router.post('/signin', function(req, res, next) {
  console.log("status: ", req.status)

  knex('users')
    .where('email', req.body.email)
    .then(function(user) {
      //if email existed in db
      if (user.length !== 0) {

        bcrypt.compare(req.body.password, user[0].hashed_password)
          .then(function() {
            // verified email to hashed password so:
            console.log("ok email")

            // issue this user a JWT
            const claim = {
              id: user[0].id
            };
            const token = jwt.sign(claim, process.env.JWT_KEY, { //???
              expiresIn: '7 days'
            });

            // add a cookie to the response
            res.cookie('token', token, {
              httpOnly: true,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
            });

            // remove hashed password before we send back the response.
            delete user[0].hashed_password;

            res.send(user); //auto sets to 200
          })
          .catch(function() {
            console.log("bad password")
            // bad password
            res.status(401);
            next(res)
          });
      } else {
        console.log("email does not exist")
        //bad email
        res.status(401);
        throw new Error()
      }
    })
    .catch(function(result) {
      next(result) //this will look for server middleware with four params (req, res, err, next)
    })
})

//sign up user
router.post('/signup', function(req, res, next) {
  console.log("status: ", req.status)

  knex('users')
    .where('email', req.body.email)
    .then(function(user) {
      //if email does not exist in db
      if (user.length === 0) {
        //generate password hash for this user
        bcrypt.hash(req.body.password, 12)
          .then(function(retHashed_password) {
            knex('users')
              .insert({
                email: req.body.email,
                hashed_password: retHashed_password,
              })
              .then(function() {
                res.send({
                  user: req.body.email,
                  id: user.id
                })
              })
          })
          .catch(function(err) {
            next(err);
          })
      } else {
        console.log("email already exists")
        //bad email
        res.status(401);
        throw new Error()
      }
    })
    .catch(function(err) {
      next(err)
    })
});


module.exports = router

/*

*/
