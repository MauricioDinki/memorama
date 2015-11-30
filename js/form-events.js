$(function() {
  var $image_check = $('.container').find('#image-check');
  var $color_input = $('.container').find('#card-color');
  var $web_image = $('.container').find('#web-image');
  var $card_confh = $('.container').find('#card-confh');
  var $card_config = $('.container').find('#card-config');
  var $game_confh = $('.container').find('#game-confh');
  var $game_config = $('.container').find('#game-config');

  $image_check.click(function(event) {
    if ($image_check.is(':checked')) {
      $color_input.attr({'disabled': true,});
      $web_image.attr({'disabled': false,});
    } else {
      $color_input.attr({'disabled': false,});
      $web_image.attr({'disabled': true,});
    }
  });
  $card_confh.click(function(event) {
    $card_config.toggle(300);
  });
  $game_confh.click(function(event) {
    $game_config.toggle(300);
  });

});
