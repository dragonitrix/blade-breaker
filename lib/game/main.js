ig.module(
	'game.main'
)
	.requires(
		'impact.game',
		'impact.font',
		'impact.input',
		'plugins.tween',
		'game.entities.test-entities',
		'game.entities.pointer',
		'impact.sound',
		'game.entities.sword'
	)
	.defines(function () {

		scale = 2;


		MyGame = ig.Game.extend({

			// Load a font
			font: new ig.Font('media/04b03.font.png'),
			sound_click: new ig.Sound('media/audio/click.ogg'),
			bgm: new ig.Sound('media/audio/bgm.ogg', false),
			pointer: null,

			scale: scale,


			isClicked: false,

			init: function () {

				// Initialize your game here; bind keys etc.

				ig.input.initMouse();
				ig.input.bind(ig.KEY.MOUSE1, 'click');

				this.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);

				//ig.game.spawnEntity(EntityTestEntities, 0, 0);

				ig.music.add(this.bgm);
				//ig.music.volume = 0.5;


				//setTimeout(() => {
				//	ig.music.play();
				//}, 5000);

				console.log(ig.game);

				var ctx = ig.system.context;
				ctx.scale(this.scale, this.scale);

				this.sword = ig.game.spawnEntity(EntitySword, (ig.system.width / 6)*1, (ig.system.height / 3)*2);

			},

			update: function () {
				// Update all entities and backgroundMaps
				this.parent();

				//console.log(ig.input.mouse);

				/*
								if (ig.game.pointer.isFirstPressed) {
									console.log("click");
				
									//ig.music.play();
									this.sound_click.play();
				
									this.sword.swing();
				
								}
				*/

				if (ig.game.pointer.isPressed) {
					this.sword.hold();
					this.isClicked = true;
				}

				if (ig.game.pointer.isReleased && this.isClicked) {
					this.isClicked = false;
					this.sword.release();
				}


				// Add your own, additional update code here
			},

			draw: function () {
				// Draw all entities and backgroundMaps
				this.parent();


				//// Add your own drawing code here
				var x = ig.system.width / 2,
					y = ig.system.height / 2;

				//this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
				//this.font.draw( 'This is pure impact engine.', x, y+10, ig.Font.ALIGN.CENTER );
				//this.font.draw( 'Test upload to site by : Korrakot Intanon', x, y+20, ig.Font.ALIGN.CENTER );

			},

			// Precise method, which guarantees v = v1 when t = 1.
			lerp: function (v0, v1, t) {
				return (1 - t) * v0 + t * v1;
			}
		});


		// Start the Game with 60fps, a resolution of 320x240, scaled
		// up by a factor of 2
		ig.main('#canvas', MyGame, 60, 320, 240, scale);

	});
