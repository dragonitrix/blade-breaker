ig.module('game.entities.shout')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntityShout = ig.Entity.extend({

            fontSize: 0,
            fontSizes: [0, 100],
            alpha: 1,
            alphas: [1, 0],
            text: "",

            init: function (x, y, settings) {
                this.parent(x, y, settings);

            },


            break: function (val) {

                this.stopTweens(true);

                this.fontSize = this.fontSizes[0];
                this.alpha = this.alphas[0];

                switch (val) {
                    case 0:
                        this.text = "BREAK!";
                        break;
                    case 1:
                        this.text = "BROKE!!";
                        break;
                    case 2:
                        this.text = "BROKEN!!!";
                        break;
                }


                var tw1 = this.tween(
                    { fontSize: this.fontSizes[1], alpha: 0 },
                    0.5,
                    {
                        onComplete: function () {
                            this.fontSize = this.fontSizes[0];
                            this.alpha = this.alphas[0];
                        }.bind(this),
                        easing: ig.Tween.Easing.Circular.EaseOut
                    }
                )
                tw1.start();
            },

            parry: function () {

                this.stopTweens(true);

                this.fontSize = this.fontSizes[0];
                this.alpha = this.alphas[0];
                this.text = "PARRY!";

                var tw1 = this.tween(
                    { fontSize: this.fontSizes[1], alpha: 0 },
                    0.5,
                    {
                        onComplete: function () {
                            this.fontSize = this.fontSizes[0];
                            this.alpha = this.alphas[0];
                        }.bind(this),
                        easing: ig.Tween.Easing.Circular.EaseOut
                    }
                )
                tw1.start();
            },

            countdown: function () {
                this.stopTweens(true);

                this.fontSize = this.fontSizes[0];
                this.alpha = this.alphas[0];
                this.text = "3";

                var tw1 = this.tween(
                    { fontSize: this.fontSizes[1], alpha: 0 },
                    0.5,
                    {
                        onComplete: function () {
                            this.fontSize = this.fontSizes[0];
                            this.alpha = this.alphas[0];
                            this.text = "2";
                        }.bind(this),
                        easing: ig.Tween.Easing.Circular.EaseOut
                    }
                )

                var tw2 = this.tween(
                    { fontSize: this.fontSizes[1], alpha: 0 },
                    0.5,
                    {
                        onComplete: function () {
                            this.fontSize = this.fontSizes[0];
                            this.alpha = this.alphas[0];
                            this.text = "1";
                        }.bind(this),
                        easing: ig.Tween.Easing.Circular.EaseOut
                    }
                )
                var tw3 = this.tween(
                    { fontSize: this.fontSizes[1], alpha: 0 },
                    0.5,
                    {
                        onComplete: function () {
                            this.fontSize = this.fontSizes[0];
                            this.alpha = this.alphas[0];
                            this.text = "FIGHT!";
                        }.bind(this),
                        easing: ig.Tween.Easing.Circular.EaseOut
                    }
                )
                var tw4 = this.tween(
                    { fontSize: this.fontSizes[1], alpha: 0 },
                    0.5,
                    {
                        onComplete: function () {
                            this.fontSize = this.fontSizes[0];
                            this.alpha = this.alphas[0];
                            ig.game.play = true;
                        }.bind(this),
                        easing: ig.Tween.Easing.Circular.EaseOut
                    }
                )

                tw1.chain(tw2);
                tw2.chain(tw3);
                tw3.chain(tw4);
                tw1.start();



            },

            draw: function () {
                this.parent();

                var ctx = ig.system.context;
                var tempalpha = ctx.globalAlpha;
                ctx.globalAlpha = this.alpha;
                ctx.font = this.fontSize + "pt arty-mouse";
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.text, ig.system.width / 2, ig.system.height / 2);

                ctx.globalAlpha = tempalpha;

            }
        });
    });