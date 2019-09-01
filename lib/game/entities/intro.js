ig.module('game.entities.intro')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntityIntro = ig.Entity.extend({

            zIndex: 999,

            val: 1,

            init: function (x, y, settings) {
                this.parent(x, y, settings);


            },
            update: function () {
                this.parent();
            },

            isClosed: true,


            moveOut: function (param) {
                this.isClosed = false;
                console.log("helo?");
                
                this.tween(
                    { val: -0.5 },
                    1,
                    {
                        easing: ig.Tween.Easing.Circular.EaseOut,
                        onComplete: function () {

                            ig.game.shout.countdown();

                        }.bind(this)
                    }
                ).start();
            },

            moveIn: function (param) {
                this.tween(
                    { val: 1 },
                    1,
                    {
                        easing: ig.Tween.Easing.Circular.EaseOut,
                        onComplete: function () {
                            ig.system.setGame(MyGame);
                        }.bind(this)
                    }
                ).start();
            },

            draw: function () {
                this.parent();

                var ctx = ig.system.context;

                ctx.fillStyle = "#000000";

                ctx.fillRect(0, this.val * (ig.system.height / 2) - (ig.system.height / 2), ig.system.width, ig.system.height / 2);

                ctx.fillRect(0, ig.system.height - this.val * (ig.system.height / 2), ig.system.width, ig.system.height / 2);

                ctx.font = 40 + "pt YOZAKURA";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#ffffff";
                ctx.fillText("BRO-KENDO", ig.system.width / 2+2, this.val * (ig.system.height / 2)+2);

                ctx.fillStyle = "#d11242";
                ctx.fillText("BRO-KENDO", ig.system.width / 2, this.val * (ig.system.height / 2));

            }
        });
    });