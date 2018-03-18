Game.Preloader = function(game) {

	this.preloadBar = null;

};

Game.Preloader.prototype = {

	preload: function() {

		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');

		this.preloadBar.anchor.setTo(0.5, 0.5);

		this.time.advanceTiming = true;

		this.load.setPreloadSprite(this.preloadBar);


		// LOAD ALL ASSETS
		this.load.tilemap('map', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);

		this.load.image('tiles', 'assets/tiles_new.png');

		this.load.image('drag', 'assets/drag.png');

		this.load.image('bird', 'assets/bird.png');

		this.load.image('nut', 'assets/nut.png');

		this.load.image('tilescreen', 'assets/menu_background.png');

		this.load.image('button', 'assets/menu_button.png');

		this.load.spritesheet('player', 'assets/player.png', 24, 26);

		this.load.spritesheet('buttons', 'assets/buttons.png', 193, 71);
	},

	create: function() {
		this.state.start('MainMenu');
	}

};


