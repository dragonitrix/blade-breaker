ig.module('game.entities.sword')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntitySword = ig.Entity.extend({

            man: new ig.Image('media/man.png'),

            manf: new ig.Image('media/man-f.png'),

            zIndex: 100,

            health: 4,

            length: 30,
            offset: 30,
            angle: 0,
            angleKeyframe: [[-55, -115, 60], [-125, -75, -240]],

            slashDir: 0,

            slashDirs: {
                "UP": 0,
                "DOWN": 1
            },

            isCharging: false,
            isSlashing: false,

            stunTime: 0,

            powerVal: 0,

            setDir: function (dir) {
                this.slashDir = dir;
                this.stopTweens(true);
                switch (this.slashDir) {
                    case this.slashDirs.UP:

                        this.pos.y = ig.system.height / 3 * 2;
                        this.angle = this.angleKeyframe[this.player][0];
                        break;
                    case this.slashDirs.DOWN:

                        this.pos.y = ig.system.height / 3 * 1;
                        this.angle = this.angleKeyframe[this.player][0] * -1;

                        break;
                }

            },

            break: function () {
                if (!ig.game.play) {
                    return;
                }
                this.health -= 1;

                if (this.health <= 1) {

                    this.tween(
                        { pos: { y: 1000 } },
                        0.2,
                        {
                            delay: 0.2,
                            onComplete: function () {
                                ig.game.gameover();
                            }
                        }
                    ).start();
                } else {

                    this.tween(
                        { pos: { x: this.pos.x + (this.length * ((this.player == 0) ? 1 : -1)) } },
                        1,
                        {
                            onComplete: function () {
                                ig.game.shout.countdown();
                            }
                        }
                    ).start();
                }
            },

            getPoint: function () {


                var length = (this.length * this.health) + this.offset;



                var endpoint = {
                    x: this.pos.x + (length * Math.cos(this.angle * Math.PI / 180)),
                    y: this.pos.y + (length * Math.sin(this.angle * Math.PI / 180))
                }


                return {
                    x1: this.pos.x,
                    y1: this.pos.y,
                    x2: endpoint.x,
                    y2: endpoint.y
                }

            },

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.angle = this.angleKeyframe[this.player][0];

                switch (this.player) {
                    case 0:
                        this.pos.x = (ig.system.width / 6) * 1;
                        break;
                    case 1:
                        this.pos.x = (ig.system.width / 6) * 5;
                        break;
                }

                this.setDir(this.slashDirs.UP);

            },

            switchDir: function () {
                switch (this.slashDir) {
                    case this.slashDirs.UP:
                        this.setDir(this.slashDirs.DOWN);
                        break;
                    case this.slashDirs.DOWN:
                        this.setDir(this.slashDirs.UP);
                        break;
                }
            },

            update: function () {
                this.parent();

                //console.log(this.angle);

                if (this.stunTime != 0) {
                    this.stunTime -= ig.system.tick;
                    if (this.stunTime <= 0) {
                        this.stunTime = 0;
                        this.tween(
                            { angle: this.angleKeyframe[this.player][0] },
                            1,
                            {}
                        ).start();
                    }
                }

            },

            stuned: function () {
                this.stopTweens(true);
                this.stunTime = this.powerVal * 5 * (this.health / 4);
                //return this.stunTime;
            },

            hold: function () {
                //this.isSlashing = true;
                if (this.isSlashing || this.stunTime != 0) {
                    return;
                }
                this.isCharging = true;
                this.angle = ig.game.lerp(this.angle, this.angleKeyframe[this.player][1] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1), ig.system.tick + (ig.system.tick * (this.health / 4)));
                //this.angle += 20 * ig.system.tick;
                //console.log(this.angle+"   "+this.angleKeyframe[this.player][1]);


            },


            release: function () {

                if (!this.isCharging) {
                    return;
                }

                this.stopTweens(true);

                this.isSlashing = true;
                this.isCharging = false;
                ig.game.recentSwing = this.player;
                var frame0 = this.angleKeyframe[this.player][0] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1);

                var frame1 = this.angleKeyframe[this.player][1] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1);
                var val = (this.angle - frame0) / (frame1 - frame0);

                val = val.limit(-1, 1);

                this.powerVal = Math.abs(val);

                var delta = this.angleKeyframe[this.player][2] - this.angleKeyframe[this.player][1];


                console.log(delta);

                var nextplayerindex = Math.abs(this.player - 1);

                if (ig.game.swords[nextplayerindex].stunTime != 0) {
                    var swingTw2 = this.tween(
                        {
                            angle: ((this.angleKeyframe[this.player][0] + (delta * val)) * ((this.slashDir == this.slashDirs.UP) ? 1 : -1))
                            , pos: { x: this.pos.x + (this.length * ((this.player == 0) ? 1 : -1)) }
                        },
                        0.25 / 2,
                        {
                            onComplete: function () {
                                //this.powerVal = 0;
                            }.bind(this)
                        }
                    )

                    var swingTw3 = this.tween(
                        {
                            angle: this.angleKeyframe[this.player][0] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1)
                            , pos: { x: this.pos.x - (this.length * ((this.player == 0) ? 1 : -1)) }
                        },
                        0.5 / 2,
                        {
                            onComplete: function () {
                                this.isSlashing = false;
                                this.powerVal = 0;
                            }.bind(this)
                        }
                    )
                } else {
                    var swingTw2 = this.tween(
                        {
                            angle: ((this.angleKeyframe[this.player][0] + (delta * val)) * ((this.slashDir == this.slashDirs.UP) ? 1 : -1))

                        },
                        0.25 / 2,
                        {
                            onComplete: function () {
                                //this.powerVal = 0;
                            }.bind(this)
                        }
                    )

                    var swingTw3 = this.tween(
                        { angle: this.angleKeyframe[this.player][0] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1) },
                        0.5 / 2,
                        {
                            onComplete: function () {
                                this.isSlashing = false;
                                this.powerVal = 0;
                            }.bind(this)
                        }
                    )
                }
                swingTw2.chain(swingTw3);

                swingTw2.start();

            },

            swing: function (param) {

                this.stopTweens(true);

                var swingTw1 = this.tween(
                    { angle: this.angleKeyframe[this.player][1] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1) },
                    0.25 / 2,
                    {}
                )

                var swingTw2 = this.tween(
                    { angle: this.angleKeyframe[this.player][0] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1) },
                    0.25 / 2,
                    {}
                )
                swingTw1.chain(swingTw2);

                swingTw1.start();

            },

            draw: function () {
                this.parent();

                var ctx = ig.system.context;

                switch (this.player) {
                    case 0:
                        ctx.scale(0.5, 0.5);
                        this.man.draw((this.pos.x - ig.system.width / 6 * 1) * 0.5, 0);
                        ctx.scale(2, 2);
                        break;
                    case 1:
                        break;
                    default:
                        break;
                }

                ctx.lineWidth = 5
                    ;

                ctx.strokeStyle = "#000000";

                ctx.save();

                ctx.translate(this.pos.x, this.pos.y);
                //console.log(this.pos);

                ctx.rotate(this.angle * Math.PI / 180);
                ctx.beginPath();

                ctx.moveTo(this.offset, 0);
                ctx.lineTo(this.offset + (this.length * this.health), 0);
                ctx.stroke();

                ctx.closePath();

                ctx.restore();

            }



        });
    });