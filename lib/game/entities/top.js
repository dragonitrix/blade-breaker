ig.module('game.entities.top')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntityTop = ig.Entity.extend({

            zIndex: 200,

            top: new ig.Image('media/top.png'),
            init: function (x, y, settings) {
                this.parent(x, y, settings);


            },
            update: function () {
                this.parent();
            },
            draw: function () {
                this.parent();

                var ctx = ig.system.context;

                ctx.scale(0.5, 0.5);

                this.top.draw(0, 0);

                ctx.scale(2, 2);
            }
        });
    });