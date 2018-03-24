var Game = {};

Game.Boot = function(game) {
	
};

Game.Boot.prototype = {

	init: function() {

		this.input.maxPointers = 1;

		this.stage.disableVisibility = true;
	},

	preload: function() {
		this.load.image('preloadBar', 'assets/preloader.png');
	},

	create: function() {
		this.state.start('Preloader');
	}

};