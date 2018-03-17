Xpr.games.hopPlatform.objects = function (game) {

	var platforms = null;
	var player = null;
	var stars = null;
	var bombs = null;
	var scoreText = null;


	return {
		createBackground: function() {
			game.add.image(0, 0, Xpr.games.hopPlatform.assets.ASSET_LABELS.SKY).setOrigin(0,0);
		},
		createPlatforms: function() {
			platforms = game.physics.add.staticGroup();
			platforms.create(400, 568, Xpr.games.hopPlatform.assets.ASSET_LABELS.GROUND).setScale(2).refreshBody();
			platforms.create(600, 400, Xpr.games.hopPlatform.assets.ASSET_LABELS.GROUND);
			platforms.create(50, 250, Xpr.games.hopPlatform.assets.ASSET_LABELS.GROUND);
			platforms.create(750, 220, Xpr.games.hopPlatform.assets.ASSET_LABELS.GROUND);
		},
		createPlayer: function() {
			player = game.physics.add.sprite(100, 450, Xpr.games.hopPlatform.assets.ASSET_LABELS.DUDE);
			player.setBounce(0.2);
			player.setCollideWorldBounds(true);
			player.body.setGravityY(100);
		},
		createStars: function(count) {
 			stars = game.physics.add.group({
				key: Xpr.games.hopPlatform.assets.ASSET_LABELS.STAR,
				repeat: count,
				setXY: {
					x: 12,
					y: 0,
					stepX: 70
				}
			})
			stars.children.iterate(function(child) {
				child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
			});
		},
		createBombs: function() {
			bombs = game.physics.add.group();
		},
		createScoreText: function() {
			scoreText = game.add.text(16, 16, Xpr.games.hopPlatform.content.SCORE + 0, {fontSize: '32px', fill: '#000'});
		},
		addBomb: function(x) {
			var x = (player.x < 400) ? Phaser.Math.Between(400, 800):  Phaser.Math.Between(0, 400);
			var bomb = bombs.create(x, 16, Xpr.games.hopPlatform.assets.ASSET_LABELS.BOMB);
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;
		},
		addStar: function() {
			var x = 12 + stars.children.size * 70
			var star = stars.create(x, 0, Xpr.games.hopPlatform.assets.ASSET_LABELS.STAR);
			star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

			stars.children.iterate(function(child) {
				child.enableBody(true, child.x, 0, true, true);
			});
		},

		updateScoreText: function(text) {
			scoreText.setText(text);
		},
		showGameOverText: function() {
			player.anims.play('turn');
			player.setTint(0xff0000);

			game.physics.pause();
			game.add.text(320, 80, Xpr.games.hopPlatform.content.GAME_OVER, {fontSize: '32px', fill: '#ff0000'});
		},
		showWonGameText: function() {
			player.anims.play('turn');
			player.setTint(0x32cd32);

			game.physics.pause();
			game.add.text(20, 80, Xpr.games.hopPlatform.content.GAME_WIN, {fontSize: '32px', fill: '#ff0000'});
		},
		getPlatforms: function() {
			return platforms;
		},
		getPlayer: function() {
			return player;
		},
		getStars: function() {
			return stars;
		},
		getBombs: function() {
			return bombs;
		}
	}
};