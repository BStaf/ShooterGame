import Phaser from 'phaser';

//https://github.com/ourcade/memory-match-template-phaser3/blob/master/src/main.js
class ShooterGame extends Phaser.Game {
    constructor(config, tileSize) {  
        super(config(tileSize));
        this.tileSize = tileSize;
        this.player = null;
        this.cursors = null;
        this.self = this;
    }  
}
export default ShooterGame;
