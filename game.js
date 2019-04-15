const Phaser = require('phaser');
const fs = require('fs');
const {
    parse,
    stringify
} = require('flatted/cjs');
//const newf = require('./new.js');

//console.log(newf);

var config = {

    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {

            gravity: {
                y: 300
            },
            debug: false

        }
    },
    scene: {

        preload: preload,
        create: create,
        update: update

    }

};

//var game = new Phaser.Game(1366, 772, Phaser.AUTO, '', { preload: preload, create: create });
var game = new Phaser.Game(config);

var interval = setInterval(() => {

    if (game.canvas.style != undefined) {
        game.canvas.style.margin = '-8px';
        game.canvas.style.cssText = style = "width: 1366px; height: 768px; margin: -8px;";
        clearInterval(interval);
    }

    console.log(game.canvas);

}, 700);

var boo = true;

// function data() {

//     return 21;

// }

function preload() {

    // loadData('sky').then(res => {

    //     this.load.image('sky', res);

    // });
    // loadData('star').then(res => {

    //     this.load.image('star', res);
    // });
    // loadData('platform').then(res => {

    //     this.load.image('platform', res);
    // });
    // loadData('bomb').then(res => {

    //     this.load.image('bomb', res);
    // });
    // loadData('dude').then(res => {

    //     this.load.spritesheet('dude', res, {
    //         frameWidth: 32,
    //         frameHeight: 48
    //     });
    // });
    this.load.image('sky', './assets/sky.png');
    this.load.image('platform', './assets/platform.png');
    this.load.image('star', './assets/star.png');
    this.load.image('bomb', './assets/bomb.png');
    this.load.spritesheet('dude', './assets/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });

}
var get;

var sky;
var star;
var platforms;
var player;
var key;
var cursor;
var score = 0;
var text;
var scoretext;

function create() {

    // fs.writeFile('./new.js',stringify(this), (err) => {
    //     if (err) throw err;
    //     console.log('The file has been saved!');
    //     console.log(stringify(this));
    //   });
    //JSON.parse('./new.js');
    sky = this.add.image(670, 390, 'sky');
    //star = this.add.image(400, 300, 'star');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'platform').setScale(4.5).refreshBody();
    platforms.create(600, 400, 'platform');
    platforms.create(50, 250, 'platform');
    platforms.create(750, 220, 'platform');
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
    this.input.keyboard.addKeys('W,S,A,D');
    cursor = this.input.keyboard.createCursorKeys();
    key = this.input.keyboard.keys;
    text = this.add.text(16, 16, 'fps:0', {
        fontSize: '22px',
        fill: '#000'
    });
    scoretext = this.add.text(16, 35, 'score:0', {
        fontSize: '22px',
        fill: '#000'
    });
    //this.add.grid(64,64,128,128,32,32);

    this.anims.create({

        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1

    });
    this.anims.create({

        key: 'turn',
        frames: [{
            key: 'dude',
            frame: player.anims.currentFrame
        }],
        frameRate: 20

    });
    this.anims.create({

        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1

    });

    player.body.setGravityY(260);

    star = this.physics.add.group({

        key: 'star',
        repeat: 11,
        setXY: {
            x: 12,
            y: 0,
            stepX: 70
        }

    });

    star.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.physics.add.collider(star, platforms);
    this.physics.add.overlap(player, star, collectStar, null, this);

    function collectStar(player, star) {

        star.disableBody(true, true);
        score += 10;
        scoretext.setText('score:' + score);

    }

    //get = this.add;

}

// loadData('sky').then(res => {

// sky.texture.key = 'sky';
// sky.frame.source.image.src = res;
// console.log(sky);

// });

var ongrv;
var frame;

function update() {

    // loadData('sky').then(res => {
    //     this.sky.texture.key =

    // console.log(cursor.left.isDown);
    ongrv = player.body.touching.down;
    frame = player.anims.animationManager.anims.entries;
    text.setText('fps:' + this.physics.world.fps);
    //text.x = player.x;
    //text.y = player.y + 20;
    //debugger;
    //debugger;
    if (key[65].isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (key[68].isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        // if(player.anims.currentFrame != undefined) {
        // frame.turn.frames[0].textureFrame = player.anims.currentFrame.index;
        // console.log(player.anims.currentFrame.index);
        // debugger;
        // }
        player.anims.stop();
    } // || key[68].isDown || key[65].isDown

    if (cursor.space.isDown && ongrv) {
        player.setVelocityY(-420);

    }

}