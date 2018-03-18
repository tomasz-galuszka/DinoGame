EnemyBird = function(index, game, x, y) {

	this.bird = game.add.sprite(x, y, 'bird');
	this.bird.anchor.setTo(0.5, 0.5);
	this.bird.name = index.toString();

	game.physics.arcade.enable(this.bird, Phaser.Physics.ARCADE);
	this.bird.body.immovabe = true;
	this.bird.body.collideWorldsBounds = true;
	this.bird.body.allowGravity = false;  

	this.birdTween = game.add.tween(this.bird).to({
		y: this.bird.y + 100
	}, 2000, 'Linear', true, 0, 100, true);

};

var enemy1; 

Game.Level1 = function(game) {
};

var map = null;
var layer;
var player;
var controlls = {};
var playerSpeed = 250;
var jumpTimer = 0;
var button;
var drag;
var shootTime = 0;
var nuts;
var respawn;

var playerXp = 0;
var gameXpSteps = 15;
var playerLevel = 0;


Game.Level1.prototype =  {

	create: function(game) {
		this.stage.backgroundColor = '#3A5963';

		this.physics.arcade.gravity.y = 1400;

		respawn = game.add.group();

		map = this.add.tilemap('map');
		map.addTilesetImage('tileset', 'tiles');
		map.setCollisionBetween(0, 3);
		map.setTileIndexCallback(5, this.spawn, this);
		map.setTileIndexCallback(6, this.collectCoin, this);

		layer = map.createLayer('TileLayer1');
		layer.resizeWorld(); 

		player = this.add.sprite(0, 0, 'player');
		player.anchor.setTo(0.5, 0.5);
		player.animations.add('idle', [0,1], 1, true);
		player.animations.add('jump', [2], 1, true);
		player.animations.add('run', [3,4,5,6,7,8], 7, true);
		
		this.physics.arcade.enable(player);

		player.body.collideWorldsBounds = true;

		this.camera.follow(player);

		map.createFromObjects('Object Layer 1', 8, '', 0, true, false, respawn);
		this.spawn();


		controlls = {
			right: this.input.keyboard.addKey(Phaser.Keyboard.D),
			left: this.input.keyboard.addKey(Phaser.Keyboard.A),
			up: this.input.keyboard.addKey(Phaser.Keyboard.W),
			shoot: this.input.keyboard.addKey(Phaser.Keyboard.UP)
		};

		button = this.add.button(this.world.centerX - 95, this.world.centerY + 200, 'buttons', function() {
			
			console.log('Pressed');

		}, this, 2, 1, 0);
		button.fixedToCamera = true;

		drag = this.add.sprite(player.x, player.y, 'drag');
		drag.anchor.setTo(0.5, 0.5);
		drag.inputEnabled = true;
		drag.input.enableDrag(true);

		enemy1 = new EnemyBird(0, game, player.x + 400, player.y - 200);

		nuts = game.add.group();

		nuts.enableBody = true;
		nuts.physicsBodyType = Phaser.Physics.ARCADE;
		nuts.createMultiple(5, 'nut');

		nuts.setAll('anchor.x', 0.5);
		nuts.setAll('anchor.y', 0.5);

		nuts.setAll('scale.x', 0.5);
		nuts.setAll('scale.y', 0.5);

		nuts.setAll('outOfBoundsKill', true);
		nuts.setAll('checkWorldBounds', true);

	},

	update: function() {
		this.physics.arcade.collide(player, layer);
		this.physics.arcade.collide(player, enemy1.bird, this.resetPlayer);

		player.body.velocity.x = 0;
		playerLevel = Math.log(playerXp, gameXpSteps);
		
		if (controlls.right.isDown) {
			player.animations.play('run');
			player.scale.setTo(1, 1);
			player.body.velocity.x += playerSpeed;
		}
		
		if (controlls.left.isDown) {
			player.animations.play('run');
			player.scale.setTo(-1,1);
			player.body.velocity.x -= playerSpeed;
		}

		if (controlls.up.isDown && (player.body.onFloor() || player.body.touching.down) && this.time.now > jumpTimer) {
			player.animations.play('jump');
			player.body.velocity.y = -600;
			jumpTimer = this.time.now + 750;
		}

		if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
			player.animations.play('idle');
		}

		if (controlls.shoot.isDown) {
			this.shootNut();
		}

		if (checkOverlap(nuts, enemy1.bird)) {
			enemy1.bird.kill();
		}

	},

	resetPlayer: function() {
		player.reset(100, 560);
	},

	spawn: function() {

		respawn.forEach(function(spawnPoint) {

			player.reset(spawnPoint.x, spawnPoint.y);

		}, this);

	},

	collectCoin: function() {
		map.putTile(-1, layer.getTileX(player.x), layer.getTileY(player.y));

		playerXp += 15;
	},

	shootNut: function() {
		if (this.time.now > shootTime) {
			
			var nut = nuts.getFirstExists(false);		

			if (nut) {
				nut.reset(player.x, player.y);
				nut.body.velocity.y = -600;

				shootTime = this.time.now + 900;

				playerXp += 15;
			}
		}
	}

};

function checkOverlap(spriteA, spriteB) {
	var boundsA = spriteA.getBounds();
	var boundsB = spriteB.getBounds();

	return Phaser.Rectangle.intersects(boundsA, boundsB);
}