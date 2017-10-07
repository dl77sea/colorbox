const express = require('express')
const router = express.Router()
const knex = require('../db')

router.get('/', function (req, res, next) {
  knex('boxes')
    .then(box => res.json(box))
    .catch(err => next(err))
})

module.exports = router
