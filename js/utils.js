Game.Utils = (function() {

	return {
		checkOverlap: function(game, spriteA, spriteB) {
			var boundsA = spriteA.getBounds();
			
			var boundsB = spriteB.getBounds();

			return Phaser.Rectangle.intersects(boundsA, boundsB);
		},
		showText: function(game, x, text) {
			game.add.text(
				x,
				game.world.centerY,
				text,
				{ font: 'bold 16px Arial', fill: '#fff' }
			);
		}
	}
})();