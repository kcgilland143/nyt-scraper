var express = require('express');
var db = require('../database')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/scraped/:section', function(req, res, next) {
  section = req.params.section
  db[section].find({}).limit(10, (err, result) => {
    if (err) { return next(err) }
    res.render('index', {title: req.params.section, articles: result})
  })
})

module.exports = router;
