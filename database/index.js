const mongo = require('mongojs')
const scraper = require('../scraper')

const db = mongo('mydb', ['sections', 'articles'])

module.exports = db

db.sections.find({}, (err, sel) => {
  console.log(sel)
  if (!sel.length) {
    scraper.getSections()
    .then((sections) => {
      console.log(sections)
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
  db.getCollectionNames(console.log)
})
