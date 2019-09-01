ig.module('game.entities.bg')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntityBg = ig.Entity.extend({

            zIndex:0,

            sunY: 200,
            bg: new ig.Image('media/bg.png'),

            sun: new ig.Image('media/sun.png'),
            land: new ig.Image('media/land.png'),
            top: new ig.Image('media/top.png'),
            init: function (x, y, settings) {
                this.parent(x, y, settings);


            },
            update: function () {
                this.parent();
                this.sunY -= 1 * ig.system.tick;
            },
            draw: function () {
                this.parent();

                var ctx = ig.system.context;

                ctx.scale(0.5, 0.5);

                this.bg.draw(0, 0);
                this.sun.draw((ig.system.width / 2 - this.sun.width / 2) * 0.5, this.sunY * 0.5);
                this.land.draw(0, 0);

                ctx.scale(2, 2);
            }
        });
    });