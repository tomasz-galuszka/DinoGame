class GameLevel1Builder {

    constructor(_game) {
        this._game = _game;
    }

    constructMap (callbacks) {
        let map = this._game.add.tilemap('map');
        map.addTilesetImage('tileset', 'tiles');
        map.setCollisionBetween(0, 4, true);
        map.setTileIndexCallback(7, callbacks.onCoinCollision, this._game);
        map.setTileIndexCallback(9, callbacks.onSpeedCollision, this._game);
        map.setTileIndexCallback(10, callbacks.onDoorCollitions, this._game);
        map.setTileIndexCallback(11, callbacks.onHeartCollision, this._game);

        return map;
    }

    constructLayer (map) {
        let layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();

        return layer;
    }

    constructPlayer (config) {
        let player = this._game.add.sprite(0, 0, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.animations.add('idle', [0, 1], 1, true);
        player.animations.add('jump', [2], 1, true);
        player.animations.add('run', [3, 4, 5, 6, 7, 8], 7, true);

        this._game.physics.arcade.enable(player);

        player.body.collideWorldsBounds = true;

        this._game.camera.follow(player);

        player.speed = config.playerSpeed;
        player.lifes = config.playerLifes;

        return player;
    }

    constructNuts () {
        let nuts = this._game.add.group();

        nuts.enableBody = true;
        nuts.physicsBodyType = Phaser.Physics.ARCADE;

        nuts.createMultiple(5, 'nut');
        nuts.setAll('anchor.x', 0.5);
        nuts.setAll('anchor.y', 0.5);
        nuts.setAll('scale.x', 0.5);
        nuts.setAll('scale.y', 0.5);
        nuts.setAll('outOfBoundsKill', true);
        nuts.setAll('checkWorldBounds', true);

        return nuts;
    }

    constructLifeBar (player) {
        let lifesText = this._game.add.text(70, 40, 'Lifes: ' + player.lifes, {font: 'bold 16px Arial', fill: '#fff'});
        lifesText.fixedToCamera = true;

        return lifesText;
    }

    constructRespawnPoint (map) {
        let respawn = this._game.add.group();
        
        map.createFromObjects('Object Layer 1', 8, '', 0, true, false, respawn);
        
        return respawn;
    }

    constructTraps (map) {
        let traps = this._game.add.group();

        traps.enableBody = true;

        map.createFromObjects('Traps', 6, 'trap', 0, true, false, traps);

        traps.forEach(function (trap) {
            trap.body.immovable = true;
            trap.scale.x = 0.8;
            trap.scale.y = 0.8;
        });

        return traps;
    }

    constructEnemies (player) {
        let enemy1 = new GameEnemyBird(0, this._game, player.x + 400, player.y - 200);
        let enemy2 = new GameEnemyBird(1, this._game, player.x + 800, player.y - 200);

        return {enemy1, enemy2};
    }
};


class GameLevel1 {

    constructor (game) {
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
        this.playerSpeed = 200;
        this.playerLifes = 3;
        this.extraLifes = 1;
        this.jumpTimer = 0;
        this.shootTimer = 0;
        this.speedTimer = 0;

    }

    create() {
        this.initialiseGame();
    }

    update() {

        this.configureCollisions();

        this.player.body.velocity.x = 0;

        this.configureControlls();

    }

    initialiseGame () {
        this._game.stage.backgroundColor = '#3A5963';
        this._game.physics.arcade.gravity.y = 1400;

        this.controlls = {
            right: this._game.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this._game.input.keyboard.addKey(Phaser.Keyboard.A),
            up: this._game.input.keyboard.addKey(Phaser.Keyboard.W),
            shootUp: this._game.input.keyboard.addKey(Phaser.Keyboard.UP),
            shootRight: this._game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        };

        let levelBuilder = new GameLevel1Builder(this._game);

        this.map = levelBuilder.constructMap({
            onCoinCollision: this.collectCoin.bind(this),
            onSpeedCollision: this.speedPowerUp.bind(this),
            onDoorCollitions: this.finishLevel.bind(this),
            onHeartCollision: this.addLife.bind(this)
        });

        this.layer = levelBuilder.constructLayer(this.map);

        this.player = levelBuilder.constructPlayer({
            playerSpeed: this.playerSpeed,
            playerLifes: this.playerLifes
        });

        this.lifesText = levelBuilder.constructLifeBar(this.player);

        this.respawn = levelBuilder.constructRespawnPoint(this.map);

        this.traps = levelBuilder.constructTraps(this.map);

        this.nuts = levelBuilder.constructNuts();

        this.spawn();

        let enemies = levelBuilder.constructEnemies(this.player);

        this.enemy1 = enemies.enemy1;
        this.enemy2 = enemies.enemy2;
    }

    configureCollisions () {
        this._game.physics.arcade.collide(this.player, this.layer);
        this._game.physics.arcade.collide(this.traps, this.layer);

        this._game.physics.arcade.collide(this.player, this.enemy1.bird, this.spawn.bind(this));
        this._game.physics.arcade.collide(this.player, this.enemy2.bird, this.spawn.bind(this));
        this._game.physics.arcade.collide(this.player, this.traps, this.spawn.bind(this));
    }

    configureControlls () {
        if (this.controlls.right.isDown) {
            this.player.animations.play('run');
            this.player.scale.setTo(1, 1);
            this.player.body.velocity.x += this.player.speed;
        }

        if (this.controlls.left.isDown) {
            this.player.animations.play('run');
            this.player.scale.setTo(-1, 1);
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

        if (Utils.checkOverlap(this._game, this.nuts, this.enemy1.bird)) {
            this.enemy1.bird.kill();
        }

        if (Utils.checkOverlap(this._game, this.nuts, this.enemy2.bird)) {
            this.enemy2.bird.kill();
        }
    }

    spawn () {
        this.player.lifes -= 1;

        this.updateLifeBanner();

        if (this.player.lifes <= 0) {

            Utils.showText(this._game, this.player.x, 'GAME OVER');

            this.player.kill();

            return;
        }

        this.respawn.forEach(function (spawnPoint) {

            this.player.reset(spawnPoint.x, spawnPoint.y);

        }, this);

    }

    collectCoin () {
        this.map.putTile(-1, this.layer.getTileX(this.player.x - 10), this.layer.getTileY(this.player.y));
    }

    shootNut(direction) {
        if (this._game.time.now > this.getShootTimer()) {

            let nut = this.nuts.getFirstExists(false);

            if (nut) {
                nut.reset(this.player.x, this.player.y);

                if (direction === 'up') {
                    nut.body.velocity.y = -600;
                } else if (direction === 'right') {
                    nut.body.velocity.y = -400;
                    nut.body.velocity.x = 300;
                }

                this.setShootTimer(this._game.time.now + 900);
            }
        }
    }

    speedPowerUp() {

        this.map.putTile(-1, this.layer.getTileX(this.player.x + 10), this.layer.getTileY(this.player.y));

        if (this._game.time.now > this.getSpeedTimer()) {

            this.setSpeedTimer(this._game.time.now + 2000);

            this.player.speed += 100;

            this.resetSpeedEvent = this._game.time.events.add(Phaser.Timer.SECOND * 2, function () {

                this.player.speed -= 100;

            }, this);

        } else {
            this._game.time.events.remove(this.resetSpeedEvent);

            this.resetSpeedEvent = this._game.time.events.add(Phaser.Timer.SECOND * 2, function () {

                this.player.speed -= 100;

            }, this);
        }
    }

    addLife(player) {
        let playerX = this.layer.getTileX(player.x + 12);
        let playerY = this.layer.getTileY(player.y);

        this.map.putTile(-1, playerX, playerY);

        if (this.getExtraLifes() > 0) {

            this.player.lifes += 1;

            this.decreaseExtraLifes();
        }

        this.updateLifeBanner();
    }

    finishLevel() {
        Utils.showText(this._game, this.player.x, 'Congratulations !');

        this.player.kill();
    }

    updateLifeBanner() {
        this.lifesText.setText('Lifes: ' + this.player.lifes);
    }

    getExtraLifes() {
        return this.extraLifes;
    }

    decreaseExtraLifes () {
        this.extraLifes -= 1;
    }

    getJumpTimer() {
        return this.jumpTimer;
    }

    setJumpTimer(time) {
        this.jumpTimer = time;
    }

    getShootTimer() {
        return this.shootTimer;
    }

    setShootTimer(time) {
        this.shootTimer = time;
    }

    getSpeedTimer() {
        return this.speedTimer;
    }

    setSpeedTimer(time) {
        this.speedTimer = time;
    }
};