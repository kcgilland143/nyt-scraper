const request = require('request-promise')
const cheerio = require('cheerio')
const moment = require('moment')
const sanitize = require('./sanitize')

//init -- get all possible sections and articles from main page
//scrapeNYTPage -- get all articles from particular section
//olderThan, newerThan, limit

const scraper = {
  url: "https://www.nytimes.com",
  sanitize: sanitize,
  loadData: function loadData (url) {
    return request(url)
      .then((html) => cheerio.load(html))
  },
  getSections: function getSections () {
    return this.loadData(this.url)
      .then(($) => {
        return scrapeSections($)
      })
  },
  getArticles: function getArticles (url, options) {
    return this.loadData(url)
      .then(($) => {
         return this.limit(scrapePage($), options)
      })
  },
  limit: function limit(articles, options) {
    var res = articles.sort((article1, article2) => {
      return article1.timestamp - article2.timestamp
    })
    if (options.olderThan) {
      res = res.filter((article) => {
        return article.timestamp < options.olderThan
      })
    }
    if (options.newerThan) {
      res = res.filter((article) => {
        return article.timestamp > options.newerThan
      })
    }
    if (options.limit) {
      res = res.slice(0, options.limit)
    }
    return res
  },
}

module.exports = scraper

if (require.main === module) {
  var res = {}
  scraper.getSections()
  .then((sections) => {
    res = sections
    var articles = Object.keys(sections).map((section) => {
      return scraper.getArticles(sections[section].link)
        // .then((articles) => results[section] = articles)
    })
    return Promise.all(articles)
  })
  .then(articles => {
    var articleCount = articles.reduce((sum, arr) => sum + arr.length, 0)
    Object.keys(res).forEach((section, i) => {
      res[section].articles = articles[i]
    })
    console.log('articles scraped:', articleCount)
    return res
  })
  .then((result) => {
    Object.keys(result).forEach((section) => {
      result[section].articles = scraper.limit(result[section].articles, {
        limit: 10 
      })
    })
    console.log(result)
  })
  .catch(err => console.error(err))
}

function scrapeNYT() {
  var sections;
  request('https://www.nytimes.com')
  .then((html) => {
    var $ = cheerio.load(html)
    sections = scrapeSections($)
    var articles = scrapeNYTpage($)
    console.log(sections, articles)
  })
  .catch(console.error)
}

function scrapeSections($) {
  var results = {}

  $('ul.mini-navigation-menu').find('li a').each((i, element) => {
    var name = scraper.sanitize($(element).text())
    if (!results[name]) {
      results[name] = { link: $(element).attr('href') }
    }
  })
  return results
}

function scrapePage($) {
  var results = []

  $('article.story').each((i, element) => {
    let heading = 
      $(element).find('.headline') ||
      $(element).find('.story-heading')
    let link = 
      heading.find('a').attr('href') ||
      $(element).find('.story-link').attr('href')
    let byline = 
      $(element).find('.byline') ||
      $(element).find('.author')
    let timestamp = 
      byline.find('time.timestamp').attr('data-utc-timestamp') ||
      $(element).find('.dateline').attr('datetime') ||
      $(element).find('time').attr('datetime')
    let summary = $(element).find('.summary').html()
    if (timestamp) {
      if (timestamp.includes('-')) { timestamp = moment(timestamp).unix() }
      timestamp = parseInt(timestamp)
      if (heading && summary && link && byline) {
        results.push({
          heading: heading.text().trim(),
          link: link,
          byline: byline.text().trim(),
          timestamp: timestamp,
          summary: summary.trim()
        }) 
      }
    }
  })
  return results
}