class GameBoot {

    init () {
        this.input.maxPointers = 1;
        this.stage.disableVisibility = true;
    }

    preload () {
        this.load.image('preloadBar', 'assets/preloader.png');
    }

    create () {
        this.state.start('Preloader');
    }
};