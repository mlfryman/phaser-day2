//- new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'sounds', { preload: preload, create: create });

/* Load assets in memory: fill the preloader with as many assets as your game requires
 * @param: is the unique string to identify the image later in our code
 * @param: is the URL of the image (relative)
 */
function preload(){
  game.load.image('bobafett', '/assets/pics/acryl_bobablast.png');
  game.load.image('backscroll', '/assets/pics/backscroll.png');
  game.load.atlasJSONHash('bot', '/assets/sprites/running_bot.png', '/assets/sprites/running_bot.json');

  game.load.audio('tommy', ['assets/audio/tommy_in_goa.mp3']);
  game.load.audio('shot', ['assets/audio/SoundEffects/shot2.wav']);
}

var s1, s2, music, sound;

/* Creates a simple sprite that is using our loaded image and displays it on-screen */
function create(){

  music = game.add.audio('tommy');
  music.play();

  sound = game.add.audio('shot', 2, true);
  sound.play('', 0, 1, true);

  //- display the image sprite & render it at specified coordinates
  s1 = game.add.sprite(0, 0, 'backscroll');
  s1.scale.setTo(4)
  game.physics.enable(s1, Phaser.Physics.ARCADE);


  s2 = game.add.sprite(600, 0, 'bobafett');
  s2.scale.setTo(1)
  game.physics.enable(s2, Phaser.Physics.ARCADE);
  var bobaTween = game.add.tween(s2);
  bobaTween.to({ x: 0 }, 6000);
  bobaTween.start();

//  This sprite is using a texture atlas for all of its animation data
  var bot = game.add.sprite(600, 450, 'bot');
  bot.animations.add('run');
  bot.animations.play('run', 20, true);

  var botTween = game.add.tween(bot);
  botTween.to({ x: 0 }, 2000);
  botTween.start();


}
