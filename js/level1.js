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