var TitleScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: 

    function TitleScene() {
        Phaser.Scene.call(this,{
            key: 'TitleScene'
        });
    },

    preload: function () {
        this.load.image("Dragon", "assets/dragonblue.png");
        this.setBackgroundColor("green");
    },

    create: function () {
        model.state = "title";
    }
});