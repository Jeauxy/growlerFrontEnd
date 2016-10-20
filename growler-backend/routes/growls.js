var express = require('express');
var router = express.Router();
var Growl = require('../models/growl')
const _ = require('lodash');

router.use(function (req, res, next) {
  req.body = _.pick(req.body, ['text'])
  next()
})

router.get('/', function(req, res, next) {
  Growl.find({}, function (err, growls) {
    if (err) {
      res.status(500).send()
    } else {
      res.json(growls)
    }
  })
});

router.post('/', function (req, res, next) {
  const growl = new Growl(req.body)
  growl.save(function (err) {
    if (err) {
      res.status(500).send()
    } else {
      res.json(growl)
    }
  })
})

router.delete('/:growlId', function (req, res, next) {
 Growl.findById(req.params.growlId).remove(function (err) {
   if (err) {
     res.status(500).send()
   } else {
     res.status(204).send()
   }
 })
})

module.exports = router;
