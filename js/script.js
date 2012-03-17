/* Author: Josh Ellington

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
    $('form .text').val(user);
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

  if ( repos.hasClass('isotope') ) {
    $(repos).isotope('destroy');
  }
  
  $(repos).isotope({
    itemSelector : '.repo',
    layoutMode : 'masonry'
  });
}

function error() {
  $('#loader').hide(0, function() {
    $('#repos').html('<h2>Sorry, no data found for that user. Please try again.</h2>');
  });
}

