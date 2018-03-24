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
var enemy2;

Game.Level1 = function(game) {
	this._game = game;

	this.map = null;
	this.layer = null;
};

var player;
var controlls = {};
var playerSpeed = 150;
var jumpTimer = 0;
var button;
var shootTime = 0;
var nuts;
var respawn;
var lifesText;
var gameStateText;
var traps;

var playerXp = 0;
var gameXpSteps = 15;
var playerLevel = 0;
var playerLifes = 3;
var extraLifes = 1;


Game.Level1.prototype =  {

	create: function(_game) {
		_game.stage.backgroundColor = '#3A5963';
		_game.physics.arcade.gravity.y = 1400;

		lifesText = _game.add.text(70, 40, 'Lifes: ' + playerLifes, {font: 'bold 16px Arial', fill: '#fff'});
		lifesText.fixedToCamera = true;

		this.map = _game.add.tilemap('map');
		this.map.addTilesetImage('tileset', 'tiles');
		this.map.setCollisionBetween(0, 4, true);

		this.map.setTileIndexCallback(7, this.collectCoin.bind(this), _game);
		this.map.setTileIndexCallback(9, this.speedPowerUp.bind(this), _game);
		this.map.setTileIndexCallback(10, this.finishLevel.bind(this), _game);
		this.map.setTileIndexCallback(11, this.addLife.bind(this), _game);

		this.layer = this.map.createLayer('Tile Layer 1');
		this.layer.resizeWorld(); 

		player = _game.add.sprite(0, 0, 'player');
		player.anchor.setTo(0.5, 0.5);
		player.animations.add('idle', [0,1], 1, true);
		player.animations.add('jump', [2], 1, true);
		player.animations.add('run', [3,4,5,6,7,8], 7, true);
		
		_game.physics.arcade.enable(player);

		player.body.collideWorldsBounds = true;

		_game.camera.follow(player);

		respawn = _game.add.group();

		this.map.createFromObjects('Object Layer 1', 8, '', 0, true, false, respawn);

		this.spawn();

		traps = _game.add.group();
		traps.enableBody = true;

		this.map.createFromObjects('Traps', 6, 'trap', 0, true, false, traps);

		traps.forEach(function(trap) {
			trap.body.immovable = true;
			trap.scale.x = 0.8;
			trap.scale.y = 0.8;
		}, this._game);

		controlls = {
			right: _game.input.keyboard.addKey(Phaser.Keyboard.D),
			left: _game.input.keyboard.addKey(Phaser.Keyboard.A),
			up: _game.input.keyboard.addKey(Phaser.Keyboard.W),
			shootUp: _game.input.keyboard.addKey(Phaser.Keyboard.UP),
			shootRight: _game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
		};

		enemy1 = new EnemyBird(0, _game, player.x + 400, player.y - 200);
		enemy2 = new EnemyBird(1, _game, player.x + 800, player.y - 200);

		nuts = _game.add.group();

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

	update: function(_game) {
		_game.physics.arcade.collide(player, this.layer);
		_game.physics.arcade.collide(traps, this.layer);

		_game.physics.arcade.collide(player, enemy1.bird, this.spawn.bind(this));
		_game.physics.arcade.collide(player, enemy2.bird, this.spawn.bind(this));
		_game.physics.arcade.collide(player, traps, this.spawn.bind(this));

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

		if (controlls.up.isDown && (player.body.onFloor() || player.body.touching.down) && _game.time.now > jumpTimer) {
			player.animations.play('jump');
			player.body.velocity.y = -650;
			jumpTimer = _game.time.now + 750;
		}

		if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
			player.animations.play('idle');
		}

		if (controlls.shootUp.isDown) {
			this.shootNut('up', _game);
		}

		if (controlls.shootRight.isDown) {
			this.shootNut('right',_game);
		}

		if (checkOverlap(nuts, enemy1.bird)) {
			enemy1.bird.kill();
		}

		if (checkOverlap(nuts, enemy2.bird)) {
			enemy2.bird.kill();
		}

	},

	spawn: function() {
		playerLifes -= 1;
	
		lifesText.setText('Lifes: ' + playerLifes);

		if (playerLifes <= 0) {
			gameStateText = this._game.add.text(player.x,
			   this._game.world.centerY,
			   'GAME OVER',
			   {font: 'bold 16px Arial', fill: '#fff'}
			);
			
			player.kill();
			
			return;
		}

		respawn.forEach(function(spawnPoint) {

			player.reset(spawnPoint.x, spawnPoint.y);

		}, this._game);

	},

	collectCoin: function() {
		this.map.putTile(-1, this.layer.getTileX(player.x - 10), this.layer.getTileY(player.y));

		playerXp += 15;
	},

	shootNut: function(direction) {
		if (this._game.time.now > shootTime) {
			
			var nut = nuts.getFirstExists(false);		

			if (nut) {
				nut.reset(player.x, player.y);

				if (direction === 'up') {
					nut.body.velocity.y = -600;
				}
				else if (direction == 'right') {
					nut.body.velocity.y = -300;
					nut.body.velocity.x = 300;
				}

				shootTime = this._game.time.now + 900;

				playerXp += 15;
			}
		}
	},

	speedPowerUp: function() {
		this.map.putTile(-1, this.layer.getTileX(player.x), this.layer.getTileY(player.y));

		playerSpeed += 30;

		this._game.time.events.add(Phaser.Timer.SECOND * 2, function() {
			playerSpeed -= 30;
		});

	},

	addLife: function(player) {
		var playerX = this.layer.getTileX(player.x + 12);
		var playerY = this.layer.getTileY(player.y)

		this.map.putTile(-1, playerX, playerY);

		if (extraLifes > 0) {
			playerLifes += 1;
			extraLifes -= 1;
		}

		lifesText.setText('Lifes: ' + playerLifes);
	},

	finishLevel: function() {
		gameStateText = this._game.add.text(player.x,
		   this._game.world.centerY,
		   'Congratulations !!',
		   {font: 'bold 16px Arial', fill: '#fff'}
		);

		player.kill();
	}

};

function checkOverlap(spriteA, spriteB) {
	var boundsA = spriteA.getBounds();
	var boundsB = spriteB.getBounds();

	return Phaser.Rectangle.intersects(boundsA, boundsB);
}