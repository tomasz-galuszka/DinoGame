Game.Level1 = function(game) {

	this._game = game;
	this.controlls = null;

	// game objects 
	this.map = null;
	this.player = null;
	this.nuts = null;
	this.lifesText = null;
	this.respawn = null;
	this.traps = null;
	this.enemy1 = null;
	this.enemy2 = null;

	// settings
	var playerSpeed = 200;
	var playerLifes = 3;
	var extraLifes = 1;
	var jumpTimer = 0;
	var shootTimer = 0;
	var speedTimer = 0;

	// constructor functions
	var constructMap = function() {
		var map = this._game.add.tilemap('map');
		map.addTilesetImage('tileset', 'tiles');
		map.setCollisionBetween(0, 4, true);
		map.setTileIndexCallback(7, this.collectCoin.bind(this), this._game);
		map.setTileIndexCallback(9, this.speedPowerUp.bind(this), this._game);
		map.setTileIndexCallback(10, this.finishLevel.bind(this), this._game);
		map.setTileIndexCallback(11, this.addLife.bind(this), this._game);

		this.map = map;
	};

	var constructLayer = function() {
		var layer = this.map.createLayer('Tile Layer 1');
		layer.resizeWorld(); 

		this.layer = layer;
	};

	var constructPlayer = function() {
		var player = this._game.add.sprite(0, 0, 'player');
		player.anchor.setTo(0.5, 0.5);
		player.animations.add('idle', [0,1], 1, true);
		player.animations.add('jump', [2], 1, true);
		player.animations.add('run', [3,4,5,6,7,8], 7, true);
		
		this._game.physics.arcade.enable(player);

		player.body.collideWorldsBounds = true;

		this._game.camera.follow(player);

		this.player = player;
		this.player.speed = playerSpeed;
		this.player.lifes = playerLifes;
	};

	var constructNuts = function() {
		var nuts = this._game.add.group();

		nuts.enableBody = true;
		nuts.physicsBodyType = Phaser.Physics.ARCADE;

		nuts.createMultiple(5, 'nut');
		nuts.setAll('anchor.x', 0.5);
		nuts.setAll('anchor.y', 0.5);
		nuts.setAll('scale.x', 0.5);
		nuts.setAll('scale.y', 0.5);
		nuts.setAll('outOfBoundsKill', true);
		nuts.setAll('checkWorldBounds', true);

		this.nuts = nuts;
	};

	var constructLifeBar = function() {
		var lifesText = this._game.add.text(70, 40, 'Lifes: ' + this.player.lifes, {font: 'bold 16px Arial', fill: '#fff'});
		lifesText.fixedToCamera = true;

		this.lifesText = lifesText;
		console.log('x');
	};

	var constructRespawnPoint = function() {

		this.respawn = this._game.add.group();

		this.map.createFromObjects('Object Layer 1', 8, '', 0, true, false, this.respawn);
	};

	var constructTraps = function() {

		var traps = this._game.add.group();

		traps.enableBody = true;

		this.map.createFromObjects('Traps', 6, 'trap', 0, true, false, traps);

		traps.forEach(function(trap) {
			trap.body.immovable = true;
			trap.scale.x = 0.8;
			trap.scale.y = 0.8;
		});

		this.traps = traps;
	};

	var constructEnemies = function() {
		this.enemy1 = new Game.EnemyBird(0, this._game, this.player.x + 400, this.player.y - 200);
		this.enemy2 = new Game.EnemyBird(1, this._game, this.player.x + 800, this.player.y - 200);
	};


	this.initialiseGame = function() {

		this._game.stage.backgroundColor = '#3A5963';
		this._game.physics.arcade.gravity.y = 1400;

		this.controlls = {
			right: this._game.input.keyboard.addKey(Phaser.Keyboard.D),
			left: this._game.input.keyboard.addKey(Phaser.Keyboard.A),
			up: this._game.input.keyboard.addKey(Phaser.Keyboard.W),
			shootUp: this._game.input.keyboard.addKey(Phaser.Keyboard.UP),
			shootRight: this._game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
		}

		constructMap.call(this);

		constructLayer.call(this);

		constructPlayer.call(this);

		constructLifeBar.call(this);

		constructRespawnPoint.call(this);

		constructTraps.call(this);

		constructNuts.call(this);

		this.spawn.call(this);

		constructEnemies.call(this);
	},

	this.configureCollisions =  function() {
		this._game.physics.arcade.collide(this.player, this.layer);
		this._game.physics.arcade.collide(this.traps, this.layer);

		this._game.physics.arcade.collide(this.player, this.enemy1.bird, this.spawn.bind(this));
		this._game.physics.arcade.collide(this.player, this.enemy2.bird, this.spawn.bind(this));
		this._game.physics.arcade.collide(this.player, this.traps, this.spawn.bind(this));
	},

	this.configureControlls = function() {
		if (this.controlls.right.isDown) {
			this.player.animations.play('run');
			this.player.scale.setTo(1, 1);
			this.player.body.velocity.x += this.player.speed;
		}
		
		if (this.controlls.left.isDown) {
			this.player.animations.play('run');
			this.player.scale.setTo(-1,1);
			this.player.body.velocity.x -= this.player.speed;
		}

		if (this.controlls.up.isDown && (this.player.body.onFloor() || this.player.body.touching.down) && this._game.time.now > this.getJumpTimer()) {
			this.player.animations.play('jump');
			this.player.body.velocity.y = -650;
			this.setJumpTimer(this._game.time.now + 750);
		}

		if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
			this.player.animations.play('idle');
		}

		if (this.controlls.shootUp.isDown) {
			this.shootNut('up', this._game);
		}

		if (this.controlls.shootRight.isDown) {
			this.shootNut('right', this._game);
		}

		if (Game.Utils.checkOverlap(this._game, this.nuts, this.enemy1.bird)) {
			this.enemy1.bird.kill();
		}

		if (Game.Utils.checkOverlap(this._game, this.nuts, this.enemy2.bird)) {
			this.enemy2.bird.kill();
		}
	},

	this.updateLifeBanner = function() {
		this.lifesText.setText('Lifes: ' + this.player.lifes);
	},

	this.getExtraLifes = function() {
		return extraLifes;
	},

	this.decreaseExtraLifes = function() {
		extraLifes -= 1;
	},

	this.getJumpTimer = function() {
		return jumpTimer;
	},

	this.setJumpTimer = function(time) {
		jumpTimer = time;
	},

	this.getShootTimer = function() {
		return shootTimer;
	},

	this.setShootTimer = function(time) {
		shootTimer = time;
	},

	this.getSpeedTimer = function() {
		return speedTimer;
	},

	this.setSpeedTimer = function(time) {
		speedTimer = time;
	}

};

Game.Level1.prototype =  {

	create: function(_game) {
		this.initialiseGame();
	},

	update: function(_game) {

		this.configureCollisions();

		this.player.body.velocity.x = 0;

		this.configureControlls();

	},

	spawn: function() {
		this.player.lifes -= 1;

		this.updateLifeBanner();

		if (this.player.lifes <= 0) {

			Game.Utils.showText(this._game, this.player.x, 'GAME OVER');
			
			this.player.kill();
			
			return;
		}

		this.respawn.forEach(function(spawnPoint) {

			this.player.reset(spawnPoint.x, spawnPoint.y);

		}, this);

	},

	collectCoin: function() {
		this.map.putTile(-1, this.layer.getTileX(this.player.x - 10), this.layer.getTileY(this.player.y));
	},

	shootNut: function(direction) {
		if (this._game.time.now > this.getShootTimer()) {
			
			var nut = this.nuts.getFirstExists(false);		

			if (nut) {
				nut.reset(this.player.x, this.player.y);

				if (direction === 'up') {
					nut.body.velocity.y = -600;
				}
				else if (direction == 'right') {
					nut.body.velocity.y = -400;
					nut.body.velocity.x = 300;
				}

				this.setShootTimer(this._game.time.now + 900);
			}
		}
	},

	speedPowerUp: function() {
		
		this.map.putTile(-1, this.layer.getTileX(this.player.x + 10), this.layer.getTileY(this.player.y));

		if (this._game.time.now > this.getSpeedTimer()) {

			this.setSpeedTimer(this._game.time.now + 2000);

			this.player.speed += 100;

			this.resetSpeedEvent = this._game.time.events.add(Phaser.Timer.SECOND * 2, function() {

				this.player.speed -= 100;

			}, this);

		} else {
			this._game.time.events.remove(this.resetSpeedEvent);

			this.resetSpeedEvent = this._game.time.events.add(Phaser.Timer.SECOND * 2, function() {

				this.player.speed -= 100;

			}, this);
		}
	},

	addLife: function(player) {
		var playerX = this.layer.getTileX(player.x + 12);
		var playerY = this.layer.getTileY(player.y)

		this.map.putTile(-1, playerX, playerY);

		if (this.getExtraLifes() > 0) {
			
			this.player.lifes += 1;
			
			this.decreaseExtraLifes();
		}

		this.updateLifeBanner();
	},

	finishLevel: function() {
		Game.Utils.showText(this._game, this.player.x, 'Congratulations !');

		this.player.kill();
	}

};