ig.module('game.entities.sword')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntitySword = ig.Entity.extend({

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

            setDir: function (dir) {
                this.slashDir = dir;
                this.stopTweens(false);
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

            getPoint:function () {
                

                var length = this.length  + this.offset;

                var endpoint = {
                    x: this.pos.x + (length * Math.cos(this.angle * 180 / Math.PI)),
                    y: this.pos.y + (length * Math.sin(this.angle * 180 / Math.PI))
                }

                return {
                    x1:this.pos.x,
                    y1:this.pos.y,
                    x2:endpoint.x,
                    y2:endpoint.y
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


            },

            hold: function () {
                this.isSlashing = true;
                this.isCharging = true;
                this.angle = ig.game.lerp(this.angle, this.angleKeyframe[this.player][1] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1), ig.system.tick);
            },


            release: function () {

                this.isCharging = false;
                var frame0 = this.angleKeyframe[this.player][0] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1);

                var frame1 = this.angleKeyframe[this.player][1] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1);
                var val = (this.angle - frame0) / (frame1 - frame0);


                var delta = this.angleKeyframe[this.player][2] - this.angleKeyframe[this.player][1];


                var swingTw2 = this.tween(
                    { angle: this.angle + ((delta * val) * ((this.slashDir == this.slashDirs.UP) ? 1 : -1)) },
                    0.25 / 2,
                    {
                        onComplete: function () {
                            this.isSlashing = false;
                        }.bind(this)
                    }
                )

                var swingTw3 = this.tween(
                    { angle: this.angleKeyframe[this.player][0] * ((this.slashDir == this.slashDirs.UP) ? 1 : -1) },
                    0.5 / 2,
                    {}
                )
                swingTw2.chain(swingTw3);

                swingTw2.start();

            },

            swing: function (param) {
                var swingTw1 = this.tween(
                    { angle: this.angleKeyframe[this.player][1] },
                    0.25 / 2,
                    {}
                )

                var swingTw2 = this.tween(
                    { angle: this.angleKeyframe[this.player][2] },
                    0.25 / 2,
                    {}
                )

                var swingTw3 = this.tween(
                    { angle: this.angleKeyframe[this.player][0] },
                    0.5 / 2,
                    {}
                )
                swingTw2.chain(swingTw3);
                swingTw1.chain(swingTw2);

                swingTw1.start();

            },

            draw: function () {
                this.parent();

                var ctx = ig.system.context;

                ctx.lineWidth = 5
                    ;

                ctx.strokeStyle = "#ff0000";

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