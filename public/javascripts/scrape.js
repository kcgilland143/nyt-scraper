//scrape button click
$('.scrape-button').on('click', function (e) {
  var pageTitle = $('.page-title').attr("data-title")
  $.ajax({
    method: "POST",
    url: "/scrape",
    data: { pageTitle: pageTitle }
  })
  .done(function( msg ) {
    alert( "Scraped " + msg.length + " New Articles!" );
    console.log(msg)
  });
})
//call scraper on section
//response will be array of new articles
//add new articles to page