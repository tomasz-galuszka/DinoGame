class Utils {

    static checkOverlap(game, spriteA, spriteB) {
        let boundsA = spriteA.getBounds();

        let boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    static showText(game, x, text) {
        game.add.text(
            x,
            game.world.centerY,
            text,
            { font: 'bold 16px Arial', fill: '#fff' }
        );
    }
};
