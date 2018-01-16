$('.article button.submit-comment').on('click', function(e) {
  var article = $(this).parent()
  var articleId = article.attr('data-id')
  var comment = article.find('input.comment-text').val()
  var pageTitle = $('.page-title').attr('data-title')
  if (comment) { comment = comment.trim() }
  console.log(articleId, comment)
  $.ajax({
    method: "POST",
    url: "/comments",
    data: { articleId: articleId, comment: comment, pageTitle: pageTitle }
  })
  .done(function( msg ) {
    alert( "New comment: " + JSON.stringify(msg) );
    //update article with new comment, will need moment.js
  });
})