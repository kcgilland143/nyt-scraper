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
    alert( "Scraped " + msg.length + " New Articles!" );
    for (let i = msg.length-1; i >= 0; i--) {
      // console.log(msg[i])
      articles.prepend(createArticle(msg[i]))
    }
  });
}

function createArticle(article) {
  let html = ""
  let articleContainer = $('<li>').attr('class', 'article').attr('data-id', article._id)
  let heading = $('<h3>').text(article.heading)
  let link = $('<a>').attr('href', article.link).attr('target', '_blank')
  link.append(heading)
  let timestamp = moment.unix(article.timestamp).format("ddd, MMM Do YYYY, h:mm:ss a")
  let byline = $('<small>').text(article.byline + ', ' + timestamp)
  let summary = $('<p>').html(article.summary)
  let comments = $('<ul>').attr('class', 'comments')
  let input = $('<input>').attr('type', 'text').attr('class', 'comment-text')
  let button = $('<button>').attr('class','btn btn-primary submit-comment').text('Add Comment')
  button.on('click', submitComment)
  articleContainer
    .append(link)
    .append(summary)
    .append(byline)
    .append(comments)
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