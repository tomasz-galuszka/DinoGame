Xpr.games.hopPlatform.main = function(gameConfig) {
	var objects;
	var controlls;

	var maxStars = gameConfig.maxStars;
	var initStars = gameConfig.initStars - 1;

	var score = 0;
	var currentStars = gameConfig.initStars;


	var preload = function() {
		Xpr.games.hopPlatform.assets.load(this);

		objects = Xpr.games.hopPlatform.objects(this);
		controlls = Xpr.games.hopPlatform.controlls(this);
	};

	var create = function() {
		Xpr.games.hopPlatform.animations.create(this);

		objects.createBackground();
		objects.createScoreText();
		objects.createPlatforms();
		objects.createPlayer();
		objects.createBombs();
		objects.createStars(initStars);

		this.physics.add.collider(objects.getStars(), objects.getPlatforms());
		this.physics.add.collider(objects.getPlayer(), objects.getPlatforms());

		this.physics.add.overlap(objects.getPlayer(), objects.getStars(), collectStar, null, this);
		this.physics.add.collider(objects.getPlayer(), objects.getBombs(), objects.showGameOverText, null, this);
	};

	var update = function() {
		controlls.apply(objects.getPlayer());
	};

	var collectStar = function(player, star) {
		star.disableBody(true, true);

		updateScore();
		objects.updateScoreText(Xpr.games.hopPlatform.content.SCORE + score);

		if (objects.getStars().countActive(true) === 0) {
			if (currentStars >= maxStars) {
				objects.showWonGameText();
			} else {
				objects.addStar();
				objects.addBomb();
				currentStars += 1;
			}
		}
	};

	var updateScore = function() {
		score +=10;
	};

	return {
		start: function() {
			new Phaser.Game({
				type: Phaser.AUTO,
				width: 800,
				height: 600,
				physics: {
					default: 'arcade',
					arcade: {
						gravity: {
							y: 300
						},
						debug:false
					}
				},
				scene: {
					preload: preload,
					create :create,
					update: update
				}
			});
		}
	}
};