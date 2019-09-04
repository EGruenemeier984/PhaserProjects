// import { BattleScene } from "battle.js";

var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function BootScene() {
            Phaser.Scene.call(this, {
                key: 'BootScene'
            });
        },

    preload: function () {
        this.load.image("tiles", "assets/map/spritesheet.png");
        this.load.tilemapTiledJSON("map", "assets/map/map.json");
        this.load.spritesheet("player", "assets/RPG_assets.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('dragonblue', 'assets/dragonblue.png');
        this.load.image('dragonorrange', 'assets/dragonorrange.png');
    },

    create: function () {
        this.scene.start('WorldScene');
    }
});

var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function WorldScene() {
            Phaser.Scene.call(this, {
                key: 'WorldScene'
            });
        },
    preload: function () {

    },
    create: function () {
        // sets the map tiles and sets the tiles boundaries
        var map = this.make.tilemap({
            key: "map"
        });
        var tiles = map.addTilesetImage("spritesheet", "tiles");
        var grass = map.createStaticLayer("Grass", tiles, 0, 0);
        var obstacles = map.createStaticLayer("Obstacles", tiles, 0, 0);
        obstacles.setCollisionByExclusion([-1]);

        // animations for player walking
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [1, 7, 1, 13]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [1, 7, 1, 13]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [2, 8, 2, 14]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [0, 6, 0, 12]
            }),
            frameRate: 10,
            repeat: -1
        });

        // Adds player sprite and physics plus sets a collision to the map.
        this.player = this.physics.add.sprite(50, 100, "player", 6);
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        // hit obstacles 
        this.physics.add.collider(this.player, obstacles);
        // for camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;
         // for player movement
         this.cursors = this.input.keyboard.createCursorKeys();
        
        // Zones for player to spawn
        this.spawns = this.physics.add.group({
            classType: Phaser.GameObjects.Zone
        });
        // Zones for battles
        for (var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            this.spawns.create(x, y, 20, 20);
        }
        // battle spots won't spawn on player
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
        // listen for wake event
        this.sys.events.on("wake", this.wake, this);
    },

    wake: function() {
        this.cursors.left.reset();
        this.cursors.right.reset();
        this.cursors.up.reset();
        this.cursors.down.reset();
    },

    onMeetEnemy: function (player, zone) {
        // enemy code
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

        this.cameras.main.shake(300);

        this.input.stopPropagation();
        // start battle 
        this.scene.switch('BattleScene');  
    },

    update: function (time, delta) {
        this.player.setVelocity(0);
        // left and right movement
        this.cursors.left.isDown ? this.player.body.setVelocityX(-80) :
            this.cursors.right.isDown ? this.player.body.setVelocityX(80) : null;
        // up and down movement
        this.cursors.up.isDown ? this.player.body.setVelocityY(-80) :
            this.cursors.down.isDown ? this.player.body.setVelocityY(80) : null;
        // Update Animations
        this.cursors.left.isDown ? this.player.anims.play("left", true) :
            this.cursors.right.isDown ? this.player.anims.play("right", true) :
            this.cursors.up.isDown ? this.player.anims.play("up", true) :
            this.cursors.down.isDown ? this.player.anims.play("down", true) :
            this.player.anims.stop();
    }
});