$('button.submit-comment').on('click', submitComment)

$('button.comment-delete').on('click', deleteComment)

function deleteComment(e) {
  var commentWrapper = $(this).parent()
  var timestamp = commentWrapper.find('.comment-timestamp').text()
  timestamp = moment(timestamp, "ddd, MMM Do YYYY, h:mm:ss a").unix()
  var article = commentWrapper.parent().parent().parent()
  var articleId = article.attr('data-id')
  console.log(article.html(), articleId)
  var pageTitle = $('.page-title').attr('data-title')
  var comment = commentWrapper.find('.comment').text()
  if (comment) { comment = comment.trim() }
  $.ajax({
    method: "POST",
    url: "/comments/delete",
    data: { articleId: articleId, comment: comment, pageTitle: pageTitle, timestamp: timestamp }
  })
  .done(function( msg ) {
    console.log( "Deleted comment: " + JSON.stringify(msg) );
    commentWrapper.remove()
    //update article with new comment, will need moment.js
  });
}

function submitComment(e) {
  var article = $(this).parent()
  var articleId = article.attr('data-id')
  var inputField = article.find('input.comment-text')
  var comment = inputField.val()
  var pageTitle = $('.page-title').attr('data-title')
  if (comment) { comment = comment.trim() }
  $.ajax({
    method: "POST",
    url: "/comments/new",
    data: { articleId: articleId, comment: comment, pageTitle: pageTitle }
  })
  .done(function( msg ) {
    console.log( "New comment: " + JSON.stringify(msg) );
    article.find('ul.comments').append(newComment(msg))
    //update article with new comment, will need moment.js
    inputField.val('')
  });
}

function newComment(comment) {
  // <div class="comment-wrapper">
  //   <li class="comment">here is a comment&nbsp;</li>
  //   <small class="comment-timestamp">Fri, Jan 19th 2018, 7:03:03 pm</small>
  //   <button class="comment-delete">X</button>
  // </div>
  let wrapper = $('<li class="comment list-group-item clearfix">')
    .text(comment.comment)
  let timestamp = $('<small class="comment-timestamp pull-right">').text(
    moment.unix(comment.timestamp).format("ddd, MMM Do YYYY, h:mm:ss a")
    ).append('&nbsp;')
  let delButton = $('<button class="comment-delete btn btn-danger pull-right">')
  .append($('<span class="glyphicon glyphicon-trash">'))
  delButton.on('click', deleteComment)
  wrapper
    .append(delButton)
    .append(timestamp)
  return wrapper
}