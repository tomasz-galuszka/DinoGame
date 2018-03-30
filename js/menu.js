export class GameMainMenu {

    create (game) {
        this._createButton(game, 'Play', game.world.centerX, game.world.centerY + 32, 300, 100, function () {
            this.state.start('Level1');
        });

        this._createButton(game, 'About', game.world.centerX, game.world.centerY + 192, 300, 100, function () {
            console.log('About');
        });

        let tilescreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, 'tilescreen');
        
        tilescreen.anchor.setTo(0.5, 0.5);
    }

    update () {}

    _createButton (game, text, x, y, w, h, callback) {
        let button = game.add.button(x, y, 'button', callback, this, 2, 1, 0);

        button.anchor.setTo(0.5, 0.5);
        button.width = w;
        button.height = h;

        let txt = game.add.text(button.x, button.y, text, {font: '14px Arial', fill: '#fff', alling: 'center'});
        txt.anchor.setTo(0.5, 0.5);
    }
};