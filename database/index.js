const mongo = require('mongojs')
const scraper = require('../scraper')

const db = mongo(process.env.PROD_MONGO, ['sections', 'articles'])

module.exports = db

db.sections.find({}, (err, sel) => {
  if (!sel.length) {
    scraper.getSections()
    .then((sections) => {
      const sectionNames = Object.keys(sections)
      sectionNames.forEach(key => {
        db.sections.insert(sections[key])
        // db.createCollection(key, (err, res) => console.log(err, res))
        scraper.getArticles(sections[key].link, { limit: 10 })
        .then((articles) => {
          articles.forEach(article => db[key].insert(article))
        })
      })
    })
  }
})
