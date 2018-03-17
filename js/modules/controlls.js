Xpr.games.hopPlatform.controlls = function (game) {
	var cursors = game.input.keyboard.createCursorKeys();

	return {
		apply: function(player) {
			if (cursors.left.isDown) {
				player.setVelocityX(-260);
				player.anims.play(Xpr.games.hopPlatform.animations.LEFT, true);
			}
			else if (cursors.right.isDown) {
				player.setVelocityX(260);
				player.anims.play(Xpr.games.hopPlatform.animations.RIGHT, true);
			}
			else {
				player.setVelocityX(0);
				player.anims.play(Xpr.games.hopPlatform.animations.TURN);
			}

			if (cursors.up.isDown && player.body.touching.down) {
				player.setVelocityY(-380);
			}
			else if(cursors.down.isDown && !player.body.touching.down) {
				player.setVelocityY(380);	
			}
		}
	}
};
