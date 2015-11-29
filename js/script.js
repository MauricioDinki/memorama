/**
* Variables Globales
**/

// Nombre del jugador
var player_name;
// Objeto donde se actualiza el numero de intentos
trys_object = document.getElementById('trys');
// Intentos;
var trys = 0;
// Objeto html donde se actualiza el numero de pares encontrados
counter_object = document.getElementById('counter');
// Contador de pares
var counter = 0;
// Ancho del canvas
var canvas_width = 900;
// Alto del canvas
var canvas_height = 400;
// Contexto del canvas
var ctx;
// Indicador de si es la primera seleccion de carta
var first_coincidence = true;
// Indicador de la primera carta seleccionada, es -1 por estar fuera de rango
var first_card = -1;
// Indicador de la segunda carta
var second_card;
// Color de la parte trasera de las cartas
var back_color = "#314BFF";
// Color del tablero de las cartas
var table_color = "#FF9F59";
// Baraja de cartas
var deck = [];
// Posicion de la primera carta en X
var first_card_x_pos = 30;
// Posicion de la primera carta en Y
var first_card_y_pos = 50;
// Espacion entre las carta
var margin = 30;
// Ancho de la carta
var card_width = 100;
// Alto de la carta
var card_height = 100;
// Indicador se si coincidieron o no las cartas
var equal;
// Variable para ejecutar la funcion de flipback
var time_out;
// Pares de cartas
var pairs = [
  ["img/n1.jpg","img/v1.jpg"],
  ["img/n2.jpg","img/v2.jpg"],
  ["img/n3.jpg","img/v3.jpg"],
  ["img/n4.jpg","img/v4.jpg"],
  ["img/n5.jpg","img/v5.jpg"],
  ["img/fondo.jpg","img/fondo.jpg"],
  ["img/girl.png","img/girl.png"],
  ["img/gambit.jpg","img/gambit.jpg"],
]

/**
* Funciones de la aplicacion
**/

/**
* Con esta funcion se declara un objeto carta para usarse en la aplicacion
* NOTA:Los constructores en js son una funcion y el nombre inicia con mayuscula
**/
function Card (position_x, position_y, card_width, card_height, img, info, is_selected) {
  // Posicion en X
	this.position_x = position_x;
  // Posicion en Y
	this.position_y = position_y;
  // Ancho
	this.card_width = card_width;
  // Alto
	this.card_height = card_height;
  // Informacion
	this.info = info;
  // Imagen
	this.img = img;
  // Funcion que dibuja la parte trasera de la carta
	this.draw = draw_back;
  // Para saber si la carta esta seleccionada
  this.is_selected = is_selected;
}

/**
* Funcion que dibuja la parte posterior de las cartas
**/
function draw_back() {
  // Selecciona el color que va a usar de las variables globales
	ctx.fillStyle = back_color;
  // Dibuja la figura
	ctx.fillRect(
    this.position_x,
    this.position_y,
    this.card_width,
    this.card_height
  );
}

/**
* Esta funcion se encargara de hacer la baraja para el juego
**/
function make_deck () {
  // Primera carta del par
	var first_card;
  // Segunda carta del par
	var second_card;
  // Primera imagen del par de cartas
	var first_image;
  // Segunda imagen del par de cartas
	var second_image;
  // Posicion en X de la primera carta (variables globales)
	var position_x = first_card_x_pos;
  // Posicion en y de la primera carta (variables globales)
	var position_y = first_card_y_pos;
  // Ciclo for que recorre el arreglo de pares de cartas (variables globales)
	for(var i = 0; i < pairs.length; i++) {
    // Creamos una nueva imagen
		first_image = new Image();
    /**
    * Asignamos el nombre de la imagen del arreglo pairs (variables globales)
    * en la posicion [i][0]
    **/
		first_image.src = pairs[i][0];
    // Pasamos los valores correspondientes al objeto carta
		first_card = new Card(
      position_x,
      position_y,
      card_width,
      card_height,
      first_image,
      i,
      false
    );
    // Agregamos el objeto carta al deck de cartas
		deck.push(first_card);

    // El mismo procedimiento para la segunda carta
		second_image = new Image();
		second_image.src = pairs[i][1];
		second_card = new Card(
      position_x,
      /**
      * Para la posicion en Y agregamos el margen (variables globales)
      * para que se vea un espacio entre las cartas
      **/
      position_y + card_height + margin,
      card_width,
      card_height,
      second_image,
      i,
      false
    );
		deck.push(second_card);
    /**
    * Agregamos a la posicion en x su valor actual mas el del margen (variables
    * globales) mas el del ancho de la carta (variables globales) ya que como
    * es canvas debemos sumar posiciones absolutas
    **/
		position_x = position_x + card_width + margin;
    // Dibujamos la parte posterior de las cartas con el metodo del constructor
		first_card.draw();
		second_card.draw();
	}
}

/**
* Funcion que baraja las cartas para que esten en orden aleatoria
**/
function shuffle_cards () {
  // Apuntadores nesesarios para el intercambio de cartas
  var i, j, k;
  var container_info;
  var container_img;
  var deck_lenght = deck.length
  for (j = 0 ;j < 3 * deck_lenght; j++) {
    /**
    * Obtenemos 2 numeros aleatorios que esten en el rango del arreglo deck ya
    * que de ahi obtendremos las cartas a revolver
    **/
    i = Math.floor(Math.random() * deck_lenght);
    k = Math.floor(Math.random() * deck_lenght);
    /**
    * Guardamos la informacion y la imagen de la carta en la posicion [i] por
    * que despues vamos a sustituirla y no queremos perderla
    **/
    container_info = deck[i].info;
    container_img = deck[i].img;
    /**
    * Asignamos la informacion y la imagen de la carta en la posicion [k] a la
    * carta en la posicion [i], para que se revuelvan
    **/
    deck[i].info = deck[k].info;
    deck[i].img = deck[k].img;
    /**
    * Asignamos la informacion de la imagen que estaba inicialmente en [i]
    * a la carta en la posicion [k]
    **/
    deck[k].info = container_info;
    deck[k].img = container_img;
  }
}

/**
* Funcion que elige las cartas y comprueba si son iguales o no
**/
function choose(event) {
  // Posicion en X del mouse
  var mouse_x
  // Posicion en Y del mouse
  var mouse_y
  // Referencias a la primera y segunda carta elegida para formar el par
  var selected_card_1
  var selected_card_2

  // Obtenemos las posiciones X & Y del click y las asignamos a las variables
  mouse_x = event.clientX;
  // Con este cliclo recorremos el arreglo deck para encontrar la carta
  mouse_y = event.clientY;
	for (var i = 0; i < deck.length; i++){
    // Asignamos la carta del deck en la posicion [i] a la variable card
		var card = deck[i];
    // Comprobamos que la carta que seleccionamos no haya desaparecido ya
    if (!card.is_selected)
    // Buscamos la carta por su posicion en el canvas
    if ((mouse_x > card.position_x) &&
        (mouse_x < card.position_x + card.card_width) &&
        (mouse_y > card.position_y) &&
        (mouse_y < card.position_y + card.card_height)) {
          // Comprobamos que no se haya pulsado la misma carta
          if ((first_coincidence) || (i != first_card)) {
            card.is_selected = true
            break;
          }
    }
	}
  // Pulsamos una carta
  if (i < deck.length) {
    // Si es la primera eleccion
    if (first_coincidence) {
      // Asignamos a la primera carta la variable i
      first_card = i;
      // Asignamos false por que ya no es la primera carta seleccionada
			first_coincidence = false;
      // Dibujamos la parte frontal de la carta
			ctx.drawImage(
        card.img,
        card.position_x,
        card.position_y,
        card.card_width,
        card.card_height
      );
      // Si no es la primera eleccion de carta entonces es la segunda
    } else {
      // Asignamos la carta elegida a second_card
      second_card = i;
      // Dibujamos la carta
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
      // La vriable vuelve a ser true para reperit el ciclo
      first_coincidence = true;
      // Volteamos las cartas despues de 1000 ms
			time_out = setTimeout(flipback,1000);
    }
  }
}

/**
* Funcion que voltea o desaparece las cartas
**/
function flipback() {
	var card;
	if (!equal) {
  	deck[first_card].draw();
    deck[first_card].is_selected = false;
  	deck[second_card].draw();
    deck[second_card].is_selected = false;
    trys ++;
    trys_object.innerHTML = trys;
	} else {
    counter ++;
    trys ++;
    counter_object.innerHTML = counter;
    trys_object.innerHTML = trys;
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
	}
  if (counter == pairs.length) {
    console.log("Has ganado");
    document.getElementById('div_game').style.display = "none";
    document.getElementById('div_win').style.display = "block";
    document.getElementById('win_player_name').innerHTML = player_name;
    document.getElementById('win_trys').innerHTML = trys;
  }
}

/**
* Esta funcion se ejecuta el cargar el cuerpo (<body>) de la pagina
**/
function iniciar() {
  // Obtenemos el objeto canvas de la estructura html por medio del atributo id
  canvas = document.getElementById('canvas');
  // Declaramos el contexto del canvas que sera 2d
  ctx = canvas.getContext('2d');
  // Objeto html donde se actualiza el numero de intentos
  trys_object = document.getElementById('trys');
  // Objeto html donde se actualiza el numero de pares encontrados
  counter_object = document.getElementById('counter');
  /**
  * Agrgamos el escuchador de eventos (EventListener) al canvas para procesar
  * el click en cada carta, procesaremos el click en la funcion choose
  **/
  canvas.addEventListener('click', choose, false);
  // Funcion que hace la baraja de cartas
  make_deck();
  // Funcion que revuelve las cartas de manera aleatoria
  shuffle_cards();
  player_name = prompt("Cual es tu nombre");
  if (!player_name) {
    player_name = "San Juan Cholo";
  }
  document.getElementById('player_name').innerHTML = player_name

}

function chooseCard() {
  console.log('Hola');
}
$(function () {
  var $canvas =  $('#game-canvas');
  var ctx = $canvas[0].getContext('2d');
  $canvas.click(chooseCard);

});
