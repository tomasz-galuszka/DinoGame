Xpr.games.hopPlatform.assets = (function () {
	var ASSET_LABELS = {
		SKY: 'sky',
		GROUND: 'ground',
		STAR: 'star',
		BOMB: 'bomb',
		DUDE: 'dude'
	};
	return {
		ASSET_LABELS: ASSET_LABELS,
		load: function(game) {
			game.load.image(ASSET_LABELS.SKY, 'assets/sky.png');
			game.load.image(ASSET_LABELS.GROUND, 'assets/platform.png');
			game.load.image(ASSET_LABELS.STAR, 'assets/star.png');
			game.load.image(ASSET_LABELS.BOMB, 'assets/bomb.png');
			game.load.spritesheet(ASSET_LABELS.DUDE, 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
		}
	}
})();