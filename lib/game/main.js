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
		'game.entities.sword',
		'game.entities.shout',
		'game.entities.bg',
		'game.entities.top',

		'game.entities.intro'
	)
	.defines(function () {

		scale = 2;


		MyGame = ig.Game.extend({

			slashDirs: {
				"UP": 0,
				"DOWN": 1
			},
			// Load a font
			font: new ig.Font('media/04b03.font.png'),
			sound_click: new ig.Sound('media/audio/click.ogg'),
			bgm: new ig.Sound('media/audio/bgm.ogg', false),



			pointer: null,

			scale: scale,

			swords: [],

			isClicked: false,

			play: false,

			recentSwing: 0,


			init: function () {

				// Initialize your game here; bind keys etc.

				ig.input.initMouse();
				ig.input.bind(ig.KEY.MOUSE1, 'click');


				ig.input.bind(ig.KEY.SPACE, 'space');
				ig.input.bind(ig.KEY.W, 's0_up');

				ig.input.bind(ig.KEY.S, 's0_down');

				ig.input.bind(ig.KEY.O, 's1_up');

				ig.input.bind(ig.KEY.L, 's1_down');

				this.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);

				//ig.game.spawnEntity(EntityTestEntities, 0, 0);

				ig.music.add(this.bgm);
				//ig.music.volume = 0.5;


				//setTimeout(() => {
				//	ig.music.play();
				//}, 5000);


				var ctx = ig.system.context;
				ctx.scale(this.scale, this.scale);

				this.bg = ig.game.spawnEntity(EntityBg,0,0);

				this.top = ig.game.spawnEntity(EntityTop,0,0);

				this.shout = ig.game.spawnEntity(EntityShout, 0, 0);

				this.swords.push(ig.game.spawnEntity(EntitySword, 0, 0, { player: 0 }));
				this.swords.push(ig.game.spawnEntity(EntitySword, 0, 0, { player: 1 }));

				//this.shout.countdown();

				this.intro = ig.game.spawnEntity(EntityIntro,0,0);

				ig.game.sortEntitiesDeferred();

			},

			inputcheck: function (param) {
				if (this.intro.isClosed) {
					if (ig.game.pointer.isFirstPressed || ig.input.pressed('space')) {
						this.intro.moveOut();
					}
				}
				if (!this.play) return;



				if (ig.ua.mobile) {


					if (ig.game.pointer.isFirstPressed) {
						if (ig.game.pointer.pos.x <= ig.system.width / 2) {
							if (ig.game.pointer.pos.y <= ig.system.height / 2) {
								if (this.swords[0].slashDir == this.slashDirs.DOWN) this.swords[0].switchDir();
							} else {
								if (this.swords[0].slashDir == this.slashDirs.UP) this.swords[0].switchDir();
							}
						} else {
							if (ig.game.pointer.pos.y <= ig.system.height / 2) {
								if (this.swords[1].slashDir == this.slashDirs.DOWN) this.swords[1].switchDir();
							} else {
								if (this.swords[1].slashDir == this.slashDirs.UP) this.swords[1].switchDir();
							}

						}
					}
					if (ig.game.pointer.isPressed) {
						if (ig.game.pointer.pos.x <= ig.system.width / 2) {
							this.swords[0].hold();
						} else {
							this.swords[1].hold();
						}
					}
					if (ig.game.pointer.isReleased) {
						if (ig.game.pointer.pos.x <= ig.system.width / 2) {
							if (this.swords[0].isCharging) this.swords[0].release();
						} else {
							if (this.swords[1].isCharging) this.swords[1].release();
						}
					}
				} else {

					if (ig.input.pressed('s0_up')) {
						if (this.swords[0].slashDir == this.slashDirs.DOWN) this.swords[0].switchDir();
					}
					if (ig.input.pressed('s0_down')) {
						if (this.swords[0].slashDir == this.slashDirs.UP) this.swords[0].switchDir();
					}


					if (ig.input.pressed('s1_up')) {
						if (this.swords[1].slashDir == this.slashDirs.DOWN) this.swords[1].switchDir();
					}
					if (ig.input.pressed('s1_down')) {
						if (this.swords[1].slashDir == this.slashDirs.UP) this.swords[1].switchDir();
					}


					if (ig.input.state('s0_up') || ig.input.state('s0_down')) {
						this.swords[0].hold();
					} else {
						if (this.swords[0].isCharging) this.swords[0].release();
					}

					if (ig.input.state('s1_up') || ig.input.state('s1_down')) {
						this.swords[1].hold();
					} else {
						if (this.swords[1].isCharging) this.swords[1].release();
					}
				}
			},



			update: function () {
				// Update all entities and backgroundMaps
				this.parent();


				//console.log(ig.input.mouse);

				this.inputcheck();

				var hitResult = this.lineIntersection(this.swords[0].getPoint(), this.swords[1].getPoint())
				if (hitResult && (this.swords[0].isSlashing || this.swords[1].isSlashing)) {
					console.log("HITT");

					console.log(hitResult);

					if (this.swords[0].slashDir == this.swords[1].slashDir) {

						if (this.recentSwing == 0) {

							this.swords[1].break();
							var remainingHealth = this.swords[1].health;
							this.shout.break(remainingHealth);
							if (remainingHealth == 1) this.swords[0].swing();
						} else {

							this.swords[0].break();
							var remainingHealth = this.swords[0].health;
							this.shout.break(remainingHealth);
							if (remainingHealth == 1) this.swords[1].swing();
						}

						this.play = false;

					} else if (this.swords[0].stunTime == 0 && this.swords[1].stunTime == 0) {
						this.swords[1].stuned();
						this.swords[0].stuned();
						this.shout.parry();
					}

				}

				// Add your own, additional update code here
			},

			gameover:function () {
				this.intro.moveIn();
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
				
				var ctx = ig.system.context;

				var angle1 = this.swords[0].stunTime;
				var angle2 = (this.swords[1].stunTime);

				ctx.font = "10pt YOZAKURA";

				//ctx.fillText(angle1.round(2)+" "+angle2.round(2),150,200);

			},

			// Precise method, which guarantees v = v1 when t = 1.
			lerp: function (v0, v1, t) {
				return (1 - t) * v0 + t * v1;
			},

			linesTouching: function (l1, l2) {

				var x1 = l1.x1;
				var y1 = l1.y1;
				var x2 = l1.x2;
				var y2 = l1.y2;
				var x3 = l2.x1;
				var y3 = l2.y1;
				var x4 = l2.x2;
				var y4 = l2.y2;

				console.log(x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3 + " " + x4 + "," + y4);


				var denominator = ((x2 - x1) * (y4 - y3)) - ((y2 - y1) * (x4 - x3));
				var numerator1 = ((y1 - y3) * (x4 - x3)) - ((x1 - x3) * (y4 - y3));
				var numerator2 = ((y1 - y3) * (x2 - x1)) - ((x1 - x3) * (y2 - y1));

				// Detect coincident lines (has a problem, read below)
				if (denominator == 0) return numerator1 == 0 && numerator2 == 0;

				var r = numerator1 / denominator;
				var s = numerator2 / denominator;

				return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
			},

			lineIntersection: function (l1, l2) {

				var x1 = l1.x1;
				var y1 = l1.y1;
				var x2 = l1.x2;
				var y2 = l1.y2;
				var x3 = l2.x1;
				var y3 = l2.y1;
				var x4 = l2.x2;
				var y4 = l2.y2;

				//console.log(x1+","+y1+" "+x2+","+y2+" "+x3+","+y3+" "+x4+","+y4);

				// calculate the distance to intersection point
				var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
				var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

				// if uA and uB are between 0-1, lines are colliding
				if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
					return { x: x1 + (uA * (x2 - x1)), y: y1 + (uA * (y2 - y1)) };
				}
				return null;
			}

		});


		// Start the Game with 60fps, a resolution of 320x240, scaled
		// up by a factor of 2
		ig.main('#canvas', MyGame, 60, 320, 240, scale);

	});
