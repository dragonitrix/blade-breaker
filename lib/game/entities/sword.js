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
            angleKeyframe: [-45, -90, 60],

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.angle = this.angleKeyframe[0];

            },
            update: function () {
                this.parent();

                //console.log(this.angle);


            },

            swing: function (param) {
                var swingTw1 = this.tween(
                    { angle: this.angleKeyframe[1] },
                    0.25 / 2,
                    {}
                )

                var swingTw2 = this.tween(
                    { angle: this.angleKeyframe[2] },
                    0.25 / 2,
                    {}
                )

                var swingTw3 = this.tween(
                    { angle: this.angleKeyframe[0] },
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