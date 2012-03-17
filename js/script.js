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

  if ( user ) {
    getWatched(user);
  }
});

function getWatched(user) {
  var res;

  $('#repos').empty();
  $('#loader').stop(true,false).fadeIn(500);

  $.getJSON('https://api.github.com/users/'+user+'/watched?per_page=200&callback=?', function(d) {
    if ( d.meta.status != 200 ) {
      error();
    }
    
    parse(d.data);
  }).error(error);
}

function parse(d) {
  var repos = $('#repos');
  if ( d.length ) {
    $.each(d, function(i,item) {
      if ( item.fork == false ) {
        $('#repoTemplate').tmpl(item).appendTo(repos);
      }

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

function error() {
  $('#repos').html('<h2>Sorry, no data found.</h2>');
}