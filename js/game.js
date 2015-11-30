/**
* Global vars
**/

var player_name = 'Gamer';
var name_box = $('#app-game').find('#name-box');
var show_attempts = true;
var attempt_box = $('#app-game').find('#attempt-box');
var attempts = 0;
var show_hits =  true
var hit_box = $('#app-game').find('#hit-box');
var hits = 0;
var show_timer = true;
var btn_start = $('#app-game').find('#btn-start');
var btn_restart = $('#app-game').find('#btn-restart');
var canvas_width = 900;
var canvas_height = 400;
var ctx;
var use_image = false;
var card_back = "#000";
var table_color = "#fff";
var deck = [];
var first_card_x_pos = 30;
var first_card_y_pos = 50;
first_coincidence = true;
first_card = -1;
var margin = 33;
var card_width = 100;
var card_height = 150;
var equal;
var time_out;
var pairs = [
  ["../img/n1.jpg","../img/v1.jpg"],
  ["../img/n2.jpg","../img/v2.jpg"],
  ["../img/n1.jpg","../img/v1.jpg"],
  ["../img/n2.jpg","../img/v2.jpg"],
  ["../img/n3.jpg","../img/v3.jpg"],
  ["../img/n4.jpg","../img/v4.jpg"],
  ["../img/n5.jpg","../img/v5.jpg"],
  ["../img/fondo.jpg","../img/fondo.jpg"],
  ["../img/girl.png","../img/girl.png"],
  ["../img/gambit.jpg","../img/gambit.jpg"],
]
if (localStorage.settings) {
  var settings = JSON.parse(localStorage.settings)
  player_name = settings.name;
  if (settings.use_image) {
    use_image = true;
    var image = new Image(card_width, card_height);
    image.src = settings.image;
    card_back = image;
  } else {
    card_back = settings.color;
  }
  show_hits = settings.show_hits;
  show_attempts = settings.show_attempts;
  show_timer = settings.show_timer;
}

function Card (position_x, position_y, card_width, card_height, img, info, is_selected, is_loked) {
	this.position_x = position_x;
	this.position_y = position_y;
	this.card_width = card_width;
	this.card_height = card_height;
	this.info = info;
	this.img = img;
	this.draw = draw_back;
  this.is_selected = is_selected;
  this.is_loked = is_loked;
}

function draw_back() {
  if (use_image) {
    ctx.drawImage(
      card_back,
      this.position_x,
      this.position_y,
      card_width,
      card_height
    );
  } else {
    ctx.fillStyle = card_back;
  	ctx.fillRect(
      this.position_x,
      this.position_y,
      card_width,
      card_height
    );
  }
}

function make_deck () {
	var first_card;
	var second_card;
	var first_image;
	var second_image;
	var position_x = first_card_x_pos;
	var position_y = first_card_y_pos;
	for(var i = 0; i < pairs.length; i++) {
		first_image = new Image();
		first_image.src = pairs[i][0];
		first_card = new Card(
      position_x,
      position_y,
      card_width,
      card_height,
      first_image,
      i,
      false,
      false
    );

		deck.push(first_card);

		second_image = new Image();
		second_image.src = pairs[i][1];
		second_card = new Card(
      position_x,
      position_y + card_height + margin,
      card_width,
      card_height,
      second_image,
      i,
      false,
      false
    );
		deck.push(second_card);

		position_x = position_x + card_width + margin;

		first_card.draw();
		second_card.draw();
	}
}

function shuffle_cards () {
  var i, j, k;
  var container_info;
  var container_img;
  var deck_lenght = deck.length
  for (j = 0 ;j < 3 * deck_lenght; j++) {
    i = Math.floor(Math.random() * deck_lenght);
    k = Math.floor(Math.random() * deck_lenght);
    container_info = deck[i].info;
    container_img = deck[i].img;
    deck[i].info = deck[k].info;
    deck[i].img = deck[k].img;
    deck[k].info = container_info;
    deck[k].img = container_img;
  }
}

function choose(event) {
  var mouse_x;
  var mouse_y;
  var selected_card_1;
  var selected_card_2;

  mouse_x = event.clientX;
  mouse_y = event.clientY;
	for (var i = 0; i < deck.length; i++){
		var card = deck[i];
    if (!card.is_selected)
    if ((mouse_x > card.position_x) && (mouse_x < card.position_x + card.card_width) && (mouse_y > card.position_y) && (mouse_y < card.position_y + card.card_height)) {
      if ((first_coincidence) || (i != first_card)) {
            card.is_selected = true
            break;
          }
    }
	}
  if (i < deck.length) {
    if (first_coincidence) {
      first_card = i;
			first_coincidence = false;
			ctx.drawImage(
        card.img,
        card.position_x,
        card.position_y,
        card.card_width,
        card.card_height
      );
    } else {
      second_card = i;
      ctx.drawImage(
        card.img,
        card.position_x,
        card.position_y,
        card.card_width,
        card.card_height
      );

      if (card.info ==deck[first_card].info) {
        equal = true;

      } else {
        equal = false
      }
      first_coincidence = true;
			time_out = setTimeout(flipback,700);
    }
  }
}

function flipback() {
	var card;
	if (!equal) {
    for (var i = 0; i < deck.length; i++) {
      if (!deck[i].is_loked) {
        deck[i].draw()
        deck[i].is_selected = false;
      }
    }
    attempts ++;
    attempt_box.html(attempts);
	} else {
    attempts ++;
    attempt_box.html(attempts);
    hits++;
    hit_box.html(hits);
	  ctx.fillStyle = table_color;
    ctx.fillRect(
      deck[first_card].position_x,
      deck[first_card].position_y,
      deck[first_card].card_width,
      deck[first_card].card_height
    );
    ctx.fillRect(
      deck[second_card].position_x,
      deck[second_card].position_y,
      deck[second_card].card_width,
      deck[second_card].card_height
    );
    deck[first_card].is_loked = true;
    deck[second_card].is_loked = true;
	}
  // if (counter == pairs.length) {
  //   console.log("Has ganado");
  //   document.getElementById('div_game').style.display = "none";
  //   document.getElementById('div_win').style.display = "block";
  //   document.getElementById('win_player_name').innerHTML = player_name;
  //   document.getElementById('win_trys').innerHTML = trys;
  // }
}

function cronometer() {
  initial = new Date()
  begin = setInterval(time, 10);
}

function time() {
  actual = new Date()
  cro = actual - initial
  cr = new Date()
  cr.setTime(cro)
  cs = cr.getMilliseconds()
  cs = cs / 10;
  cs = Math.round(cs)
  sg = cr.getSeconds();
  mn = cr.getMinutes();
  ho = cr.getHours()-1;
  if (cs < 10) {cs = "0" + cs;}
  if (sg < 10) {sg = "0" + sg;}
  if (mn < 10) {mn = "0" + mn;}
  $('#app-game').find('#clock').html(mn+" : "+sg+" : "+cs)
}

$( window ).load(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  make_deck();
  shuffle_cards();
  name_box.html(player_name);
});

btn_start.click(function(event) {
  canvas.addEventListener('click', choose, false);
  cronometer()
});
