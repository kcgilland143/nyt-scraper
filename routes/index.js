var express = require('express');
var db = require('../database');
var scraper = require('../scraper')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/scraped/:section', function(req, res, next) {
  section = req.params.section
  db[section].find({}).sort({timestamp: -1}).limit(10, (err, result) => {
    if (err) { return next(err) }
    res.render('index', {title: req.params.section, articles: result})
  })
})

router.post('/comments', function (req, res, next) {
  var data = req.body
  data.timestamp = Date.now()
  console.log(data)
  db[data.pageTitle].update({ _id: db.ObjectId(data.articleId) },
  { $push: { comments: { comment: data.comment, timestamp: data.timestamp } } },
  (err, result) => {
    console.log('Comment found:', err, result)
    res.json(data)
  })
})

router.post('/scrape', function (req, res, next) {
  var pageTitle = req.body.pageTitle
  db[pageTitle].find({}, {timestamp: 1}).sort({timestamp:-1}).limit(1, (err, time) => {
    var newest = time[0].timestamp
    var section = req.app.locals.sections.find((section) => section.name === pageTitle)
    console.log(newest, section)
    scraper.getArticles(section.link, { limit: 10, newerThan: newest })
    .then((articles) => {
      articles.forEach((article) => {
        db[pageTitle].insert(article)
      })
      return articles
    })
    .then((articles) => res.json(articles))
    .catch((err) => console.error(err))
  })
})

module.exports = router;
