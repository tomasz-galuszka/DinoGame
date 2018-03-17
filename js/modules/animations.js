Xpr.games.hopPlatform.animations = (function () {
	var labels = {
		left: 'left',
		right: 'right',
		turn: 'turn'
	};

	return {
		LEFT: labels.left,
		RIGHT: labels.right,
		TURN: labels.turn,

		create: function(game) {
			game.anims.create({
				key: labels.left,
				frames: game.anims.generateFrameNumbers(Xpr.games.hopPlatform.assets.ASSET_LABELS.DUDE, {
					start: 0,
					end: 3
				}),
				frameRate: 10,
				repeat: -1
			});
			game.anims.create({
				key: labels.right,
				frames: game.anims.generateFrameNumbers(Xpr.games.hopPlatform.assets.ASSET_LABELS.DUDE, {
					start: 5,
					end: 8
				}),
				frameRate: 10,
				repeat: -1
			});
			game.anims.create({
				key: labels.turn,
				frames: [{
					key: Xpr.games.hopPlatform.assets.ASSET_LABELS.DUDE,
					frame: 4
				}],
				frameRate: 20
			});
		}
	}
})();