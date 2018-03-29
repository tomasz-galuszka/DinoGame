class GameEnemyBird  {

    constructor(index, game, x, y) {
        this.bird = game.add.sprite(x, y, 'bird');
        this.bird.anchor.setTo(0.5, 0.5);
        this.bird.name = index.toString();

        game.physics.arcade.enable(this.bird, Phaser.Physics.ARCADE);

        this.bird.body.immovabe = true;
        this.bird.body.collideWorldsBounds = true;
        this.bird.body.allowGravity = false;  

        this.birdTween = game.add.tween(this.bird).to({
            y: this.bird.y + 100
        }, 2000, 'Linear', true, 0, 100, true);
    }
};