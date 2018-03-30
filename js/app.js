import {GameLevel1} from './level1.js';
import {GameMainMenu} from './menu.js';
import {GameBoot} from './boot.js';
import {GamePreloader} from './preloader.js';

window.addEventListener('load', e => {

	const game = new Phaser.Game(800, 600, Phaser.CANVAS, '');
	game.state.add('Boot', new GameBoot());
	game.state.add('Preloader', new GamePreloader());
	game.state.add('MainMenu', new GameMainMenu());
	game.state.add('Level1', new GameLevel1(game));

	game.state.start('Boot');
});