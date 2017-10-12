const express = require('express')
const router = express.Router()
const knex = require('../db')

router.get('/', function(req, res, next) {
  knex('boxes')
    .then(function(boxes) {
      console.log("boxes: ", boxes)
      return res.json(boxes)
    })
    .catch(function(err) {
      return err;
    })
})

//box object will come here as part of request (body)
router.post('/', function(req, res, next) {
  console.log(req.body)
  knex('boxes')
    .insert(req.body)
    .then(function(response) {
      console.log('insert success')
    })
    .catch(function(err) {
      console.log('insert fail')
      return err;
    })
})

module.exports = router
