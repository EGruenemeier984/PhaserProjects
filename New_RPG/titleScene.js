var TitleScene = new Phaser.Class ({
    Extends: Phaser.Scene,

constructor () {
    super('Title');
  },
 
  preload () {
    this.load.image("dragon", "assets/dragonblue.png");
    this.load.image('box', 'assets/ui/grey_box.png');
    this.load.image('checkedBox', 'assets/ui/blue_boxCheckmark.png');
  },
 
  create () {
    this.gameButton = this.add.sprite(100, 200, "blueButton1").setInteractive();
    this.centerButton(this.gameButton, 1);

    this.gameText = this.add.text(0,0, "Play!", { fontSize: "32px", fill: "#fff" });
    this.centerButtonText(this.gameText, this.gameButton);
  }
});
