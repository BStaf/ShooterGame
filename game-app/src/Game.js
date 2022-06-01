import Phaser from 'phaser';

class Game {
    constructor() {
        this.tileSize = 25;
        this.player = null;
        this.cursors = null;
        this.self = this;
    }  
  
    config = () => ({
        type: Phaser.AUTO,
        width: 32 * this.tileSize,
        height: 24 * this.tileSize,
        physics: {
            default: 'arcade',
            arcade:{debug:true}
            /*arcade: {
                gravity: { y: 200, x: 0 }
            }*/
        },
        scene: {
            preload: this.preload,
            create: this.create,
            update: this.update(this)
        }
    });

    doGame(){
        const conf = this.config();
        return new Phaser.Game(conf);
    }
    

    preload ()
    {
        this.load.image('bg', 'assets/background.jpg');
        this.load.image('box', 'assets/box.jpg');
        this.load.image('tiles', 'assets/platformBlock.jpg');
    }

    create ()
    {
        const levelAr = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

        //this.add.image(400, 300, 'bg');
        //this.add.image(100, 500, 'box');
        
        //platforms = this.physics.add.staticGroup();
        //platforms.create(400, 568, 'platBox').setScale(2).refreshBody();

        this.cursors = this.input.keyboard.createCursorKeys();
        
        const map = this.make.tilemap({ data: levelAr, tileWidth: 25, tileHeight: 25 });
        const tiles = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(1, 3);
        layer.setCollisionByProperty({ collides: true });

        this.player = this.physics.add.sprite(100, 400, "box","misa-front");
        this.physics.add.collider(this.player, layer);
        this.player.setFrictionX(9000);
        this.player.setGravityY(600);

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // layer.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });
    }

    handleMovement (player, cursors) {
        if (player.body.blocked.down === true)
            player.setVelocityX(0);

        if (cursors.left.isDown)
        {
            player.setVelocityX(-150);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(150);
        }

        if ((player.body.blocked.down === true) && (cursors.up.isDown))
            player.setVelocityY(-400);
    }

    update (self) 
    {
        if (this.player !== null)
            self.handleMovement(this.player,this.cursors);
    }
}

/*class Player extends Phaser.sprite{
    constructor(scene){
        this.scene = scene;
        this.scene.physics.add.sprite(100, 400, "box","misa-front");
    }
}*/
export default Game;