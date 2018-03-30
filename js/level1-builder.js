import { GameEnemyBird } from "./enemies.js";

export class GameLevel1Builder {

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
