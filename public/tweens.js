//- new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'tweens', { preload: preload, create: create, update:update});

// PRELOAD
function preload(){
  game.load.image('bobafett', '/assets/pics/bobafett.png');
  game.load.image('backscroll', '/assets/pics/backscroll.png');
  game.load.atlasJSONHash('bot', '/assets/sprites/running_bot.png', '/assets/sprites/running_bot.json');
  game.load.image('wasp', 'assets/sprites/wasp.png');
  game.load.image('flame', 'assets/particles/muzzleflash3.png');
  game.load.image('bullet', 'assets/sprites/red_ball.png');

  game.load.audio('tommy', ['assets/audio/tommy_in_goa.mp3']);
  game.load.audio('shoot', ['assets/audio/SoundEffects/shot1.wav']);

}

var land,
    boba,
    music,
    gun,
    bugs,
    data,
    index = 0,
    pos = [],
    emitter,
    fireRate = 100,
    nextFire = 0;

// CREATE
function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // new Sound(game, key, volume, loop)
  music = game.add.audio('tommy');
  music.play();
  gun = game.add.audio('shoot', 0.5, true);

  land = game.add.sprite(0, 0, 'backscroll');
  land.scale.setTo(4)
  game.physics.enable(land, Phaser.Physics.ARCADE);

// BOBA FETT
  boba = game.add.sprite(600, 0, 'bobafett');
  boba.scale.setTo(1)
  game.physics.enable(boba, Phaser.Physics.ARCADE);
  //  Here we'll chain 2 different tweens together and play through them all in a loop
  var bobaTween = game.add.tween(boba).to({ x: 0 }, 8000, Phaser.Easing.Linear.None)
  .to({ x: 600 }, 8000, Phaser.Easing.Linear.None)
  .loop()
  .start();

// BOT
  var bot = game.add.sprite(600, 450, 'bot');
  bot.animations.add('run');
  bot.animations.play('run', 10, true);
  //  Enables all kind of input actions on this image (click, etc)
  bot.inputEnabled = true;
  bot.events.onInputDown.add(listener, this);

  var botTween = game.add.tween(bot).to({ x: 100 }, 2000, Phaser.Easing.Linear.None)
  .to({ x: 700 }, 2000, Phaser.Easing.Linear.None)
  .loop()
  .start();

// BUGS
  var bugTweenData = { x: 0, y: 0 };
  //  Here we'll tween the values held in the tweenData object to x: 500, y: 300
  bugTween = game.make.tween(bugTweenData).to( { x: 100, y: 300 }, 2000, Phaser.Easing.Sinusoidal.InOut);

  //  Set the tween to yoyo so it loops smoothly
  bugTween.yoyo(true);

  //  We have 3 interpolation methods available: linearInterpolation (the default), bezierInterpolation and catmullRomInterpolation.
  // tween.interpolation(game.math.bezierInterpolation);
  bugTween.interpolation(game.math.catmullRomInterpolation);

  //  Generates the tween data at a rate of 60 frames per second.
  //  This is useful if you've got a lot of objects all using the same tween, just at different coordinates.
  //  It saves having to calculate the same tween across the properties of all objects involved in the motion.
  //  Instead you can pre-calculate it in advance and trade that in for a bit of memory to store it in an array.
  data = bugTween.generateData(60);

  //  Now create some sprites to shown the tween data in action
  bugs = game.add.group();

  pos.push(new Phaser.Point(32, 0));
  pos.push(new Phaser.Point(300, 100));
  pos.push(new Phaser.Point(600, 70));

  bugs.create(pos[0].x, pos[0].y, 'wasp');
  bugs.create(pos[1].x, pos[1].y, 'wasp');
  bugs.create(pos[2].x, pos[2].y, 'wasp');

  emitter = game.add.emitter(0, 0, 100);
  emitter.makeParticles('flame');
  emitter.gravity = 200;
  game.input.onDown.add(particleBurst, this);

  // BULLETS
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

  bullets.createMultiple(50, 'bullet');
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);

}

// UPDATE
function update(){

    //  A simple data playback.

    //  Each element of the array contains an object that includes whatever properties were tweened
    //  In this case the x and y properties

    //  Because the tween data is pre-generated we can apply it however we want:
    //  Directly, by adding to the coordinates
    bugs.getAt(0).x = pos[0].x + data[index].x;
    bugs.getAt(0).y = pos[0].y + data[index].y;

    //  Half one of the values
    bugs.getAt(1).x = pos[1].x + (data[index].x / 2);
    bugs.getAt(1).y = pos[1].y + data[index].y;

    //  Inverse one of the values
    bugs.getAt(2).x = pos[2].x - data[index].x;
    bugs.getAt(2).y = pos[2].y + data[index].y;

    //  You can do all kinds of effects by modifying the tween data,
    //  without having loads of active tweens running.

    //  This just advances the tween data index
    //  It's crude and doesn't take target device speed into account at all, but works as an example
    index++;

    if (index === data.length)
    {
        index = 0;
    }
}

// RENDER
// function render(){
//   game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
//   game.debug.spriteInfo(sprite, 32, 450);
// }

// HELPER FUNCTIONS
function listener(){
  // .play(marker, position, volume, loop, forceRestart) → {Phaser.Sound}
  gun.play('', 0, 0.5, false);

}

function particleBurst(pointer){
  //  Position the emitter where the mouse/touch event was
  emitter.x = pointer.x;
  emitter.y = pointer.y;

  //  The first parameter sets the effect to "explode" which means all particles are emitted at once
  //  The second gives each particle a 2000ms lifespan
  //  The third is ignored when using burst/explode mode
  //  The final parameter (10) is how many particles will be emitted in this single burst
  emitter.start(true, 2000, null, 3);

}


function fire(){
  if (game.time.now > nextFire && bullets.countDead() > 0)
  {
      nextFire = game.time.now + fireRate;

      var bullet = bullets.getFirstDead();

      bullet.reset(sprite.x - 8, sprite.y - 8);

      game.physics.arcade.moveToPointer(bullet, 300);
  }
}
