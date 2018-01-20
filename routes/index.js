var express = require('express');
var db = require('../database');
var scraper = require('../scraper')
var crypto = require('crypto')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  db.articles.find({}).sort({timestamp:-1}).limit(10, (err, result) => {
    if (err) { return next(err) }
    res.render('index', { title: 'Recent Articles' , articles: result});
  })
});

router.get('/scraped/:section', function(req, res, next) {
  section = req.params.section
  db.articles.find({section: section}).sort({timestamp: -1}).limit(10, (err, result) => {
    if (err) { return next(err) }
    res.render('index', {title: req.params.section, articles: result})
  })
})

router.post('/comments/new', function (req, res, next) {
  var data = req.body
  data.timestamp = Math.floor(Date.now() / 1000).toString()
  db.articles.update({ _id: data.articleId },
  { $push: { comments: { comment: data.comment, timestamp: data.timestamp } } },
  (err, result) => {
    console.log('Comment found:', err, result)
    res.json(data)
  })
})

router.post('/comments/delete', function (req, res, next) {
  var data = req.body
  console.log(data)
  db.articles.update({ _id: data.articleId },
  { $pull: { comments: { comment: data.comment, timestamp: data.timestamp } } },
  (err, result) => {
    console.log('Comment deleted:', err, result)
    res.json(data)
  })
})

router.post('/scrape', function (req, res, next) {
  var pageTitle = req.body.pageTitle
  db.articles.find({section: pageTitle}, {timestamp: 1}).sort({timestamp:-1}).limit(1, (err, time) => {
    if (err) { console.error(err) }
    var newest = 0
    if (time.length) {
      console.log(time)
      var newest = time[0].timestamp
    }
    var section = req.app.locals.sections[pageTitle]
    console.log(newest, section)
    scraper.getArticles(section.link, { limit: 10, newerThan: newest })
    .then((articles) => {
      articles.forEach((article, i) => {
        article.section = section.sanitized_name,
        article._id = crypto.createHmac('sha256', Date.now().toString())
          .update(article.heading)
          .digest('hex');
        db.articles.insert(article)
      })
      return articles
    })
    .then((articles) => res.json(articles))
    .catch((err) => console.error(err))
  })
})

module.exports = router;
