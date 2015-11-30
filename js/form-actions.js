$(function() {

  var $form = $('.container').find('form');
  var settings = {}

  if (localStorage.settings) {
    initial = JSON.parse(localStorage.settings)
    $('form').find('#user-name').val(initial.name)
    $('form').find('#check-timer').prop('checked', initial.show_timer);
    $('form').find('#check-attempts').prop('checked', initial.show_attempts);
    $('form').find('#check-hits').prop('checked', initial.show_hits);
    $('form').find('#card-color').val(initial.color)
    $('form').find('#image-check').prop('checked', initial.use_image);
    $('form').find('#link-image').val(initial.image)
  }

  /**
  * Submit Form
  **/

  $form.submit(function(event) {
    event.preventDefault();
    var name = $(this).find('#user-name').val();
    var show_timer = $(this).find('#check-timer').is(':checked');
    var show_attempts = $(this).find('#check-attempts').is(':checked');
    var show_hits = $(this).find('#check-hits').is(':checked');
    var color = $(this).find('#card-color').val();
    var use_image = $(this).find('#image-check').is(':checked');
    var image = $(this).find('#link-image').val();

    game_settings = {
      "name": name,
      "show_timer": show_timer,
      "show_attempts": show_attempts,
      "show_hits": show_hits,
      "color": color,
      "use_image": use_image,
      "image": image
    }

    localStorage.settings = JSON.stringify(game_settings);

  });
});
