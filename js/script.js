/* Author:

*/




$(function() {

  $('form').submit(function() {
    var val = $(this).find('.text').val();
    if ( val.length ) {
      location.hash = '/'+val;
    }

    return false;
  });

  $(window).hashchange();

});

$(window).hashchange(function() {
  var url = $.url(),
      user = url.fsegment(1);

  getWatched(user);
});

function getWatched(user) {
  var res;

  $('#repos').empty();
  $('#loader').stop(true,false).fadeIn(500);

  $.getJSON('https://api.github.com/users/'+user+'/watched', function(d) {
    parse(d);
  }).error(function() {
    $('#repos').html('<h2>Sorry, no data found.</h2>');
  });
}

function parse(d) {
  var repos = $('#repos');
  if ( d.length ) {
    $.each(d, function(i,item) {
      $('#repoTemplate').tmpl(item).appendTo(repos);

      if ( i == (d.length - 1) ) {
        $('#loader').stop(true,false).hide(0, function() {
          iso();
        });
      }
    });
  }
}

function iso() {
  var repos = $('#repos');

  log('isotope!');

  if ( repos.hasClass('isotope') ) {
    $(repos).isotope('destroy');
  }
  
  $(repos).isotope({
    // options
    itemSelector : '.repo',
    layoutMode : 'masonry'
  });
}