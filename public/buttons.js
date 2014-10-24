var game = new Phaser.Game(800, 600, Phaser.AUTO, 'buttons', { preload: preload, create: create, update:update });

function preload() {
  game.load.spritesheet('button', '/assets/buttons/button_sprite_sheet.png', 193, 71);
  game.load.image('background','/assets/misc/starfield.jpg');
}

var background;

function create() {

  game.stage.backgroundColor = '#ff0000';

  //new TileSprite(game, x, y, width, height, key, frame)
  background = game.add.tileSprite(0, 0, 800, 600, 'background');

  //new Button(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
  button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, null, 2, 1, 0);

  button.onInputOver.add(over, this);
  button.onInputOut.add(out, this);

  var button2 = game.add.button(570, 200, 'button', createButton, this, 2, 1, 0);
  button2.name = 'rotated button';
  button2.angle = 32;
  button2.scale.setTo(0.3, 0.3);
  button2.anchor.setTo(0.5, 0.5);
}

function over() {
  console.log('button over');
}

function out() {
  console.log('button out');
}

function actionOnClick (button) {
  console.log('click this ', this);
  console.log('click button ', button);
  background.visible =! background.visible;
}

function createButton(button){
  console.log('2 click this ', this);
  console.log('2 click button ', button);
  var b1 = game.add.button(0,0, 'button');
  b1.setFrames(2,1,0);
}

function update(){
  for(var i = 0; i < game.world.children.length; i++){
    if(game.world.children[i].name && game.world.children[i].name == 'rotated button'){
      game.world.children[i].angle -= 3;
    }
  }
}
