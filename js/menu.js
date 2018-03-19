Game.MainMenu = function(game) {};

var tilescreen;

Game.MainMenu.prototype = {

	create: function(game) {
		this.createButton(game, 'Play', game.world.centerX, game.world.centerY + 32, 300, 100,
			function() {
				this.state.start('Level1');
			}
		);

		this.createButton(game, 'About', game.world.centerX, game.world.centerY + 192, 300, 100,
			function() {
				console.log('About');
			}
		);

		tilescreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, 'tilescreen');
		tilescreen.anchor.setTo(0.5, 0.5);

	},

	update: function(game) {


	},

	createButton: function(game, text, x, y, w, h, callback) {
		var button = game.add.button(x, y, 'button', callback, this, 2, 1, 0);
		
		button.anchor.setTo(0.5, 0.5);
		button.width = w;
		button.height = h;

		var txt = game.add.text(button.x, button.y, text,{
			 font: '14px Arial',
			 fill: '#fff',
			 alling: 'center' 
		});
		txt.anchor.setTo(0.5, 0.5);

	}

};