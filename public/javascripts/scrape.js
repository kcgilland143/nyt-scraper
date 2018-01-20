//scrape button click
$('.scrape-button').on('click', scrapeHandler )

function scrapeHandler(event) {
  var pageTitle = $('.page-title').attr("data-title")
  $.ajax({
    method: "POST",
    url: "/scrape",
    data: { pageTitle: pageTitle }
  })
  .done(function( msg ) {
    const len = msg.length
    const articles = $('ul.articles')
    textFlash($('.flashed-message'),"Scraped " + msg.length + " New Articles!", 2000);
    msg.forEach(function (article) {
      articles.prepend(createArticle(article))
    })
  });
}

function createArticle(article) {
  let html = ""
  let articleContainer = $('<li>').attr('class', 'article media').attr('data-id', article._id)
  let container = $('<div>').attr('class', 'media-body')
  let heading = $('<h3>').attr('class','media-heading').text(article.heading)
  let link = $('<a>').attr('href', article.link).attr('target', '_blank')
  link.append(heading)
  let timestamp = moment.unix(article.timestamp).format("ddd, MMM Do YYYY, h:mm:ss a")
  let byline = $('<small>').text(article.byline + ', ' + timestamp)
  let summary = $('<p>').html(article.summary)
  let comments = $('<ul>').attr('class', 'comments list-group')
  let input = $('<input>').attr('type', 'text').attr('class', 'comment-text')
  let button = $('<button>').attr('class','btn btn-primary submit-comment')
    .append('<span class="glyphicon glyphicon-plus">')
  button.on('click', submitComment)
  container
    .append(link)
    .append(summary)
    .append(byline)
    .append(comments)
  articleContainer
    .append(container)
    .append(input)
    .append(button)
  return articleContainer
}

// {{#each articles}}
//   <li class="article" data-id="{{_id}}">
//     <a href="{{link}}"><h3>{{{heading}}}</h3></a>
//     <p>{{{summary}}}</p>
//     <small>{{byline}}, {{time timestamp}}</small>
//     <ul class="comments">
//     {{#each comments}}
//       <div class="comment-wrapper">
//         <li class="comment">{{comment}}&nbsp;</li>
//         <small class="comment-timestamp">{{time timestamp}}</small>
//         <button class="comment-delete">X</button>
//       </div>
//     {{/each}}
//     </ul>
//     <input type="text" class="comment-text"/>
//     <button class="btn btn-primary submit-comment">Add Comment</button>
//   </li>
// {{/each}}

//call scraper on section
//response will be array of new articles
//add new articles to page