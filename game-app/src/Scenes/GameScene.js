import Phaser from 'phaser';
import * as Player from '../Objects/Player';
import { getLevelAr } from '../Objects/TestLevel';

class GameScene extends Phaser.Scene {

    preload()
    {
        this.load.image('bg', 'assets/background.jpg');
        this.load.image('box', 'assets/box.jpg');
        this.load.image('tiles', 'assets/platformBlock.jpg');
    }

    setupPlayer(scene) 
    {
        const player = Player.create(this);
        Player.addToScene(player, this);
        Player.addToPhysics(player, this.physics);
        player.setFrictionX(9000);
        player.setGravityY(600);
        player.setMaxVelocity(180, 500);
        player.slowdownRate = 12;
        player.accelerationRate = 1500;

        return player;
    }

    create() 
    {
        const levelAr = getLevelAr();

        this.cursors = this.input.keyboard.createCursorKeys();

        const map = this.make.tilemap({ data: levelAr, tileWidth: 25, tileHeight: 25 });
        const tiles = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(1, 3);
        layer.setCollisionByProperty({ collides: true });
        
        this.player = this.setupPlayer(this);
        this.physics.add.collider(this.player, layer);
        //*/

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // layer.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });
    }
    slideAmount = () => 10;

    getStopSlide = (direction) =>
        direction === "left" ?
            "-=" + this.slideAmount() :
            direction === "right" ?
                "+=" + this.slideAmount() :
                "+=1";

    setStopVelocity = (velocity, deceleration) => 
    {
        const vel = velocity - deceleration;

        if (velocity > 0)
            return vel > 0 ? vel : 0;
        return vel < 0 ? vel : 0;
    };

    handlePlayerMovement(player, cursors) 
    {
        const deceleration = player.slowdownRate;

        if (cursors.left.isDown) {
            player.action.movement = "left";
            player.setAccelerationX(-player.accelerationRate);
            //player.setVelocityX(-150);
        }
        else if (cursors.right.isDown) {
            player.action.movement = "right";
            player.setAccelerationX(player.accelerationRate);
        }
        else if (player.body.blocked.down === true && this.player.body.velocity.x !== 0){
            player.setAccelerationX(0);
            player.setVelocityX(this.setStopVelocity(
                this.player.body.velocity.x,
                this.player.body.velocity.x > 0 ? 
                    deceleration : 
                    -deceleration));
            player.action.movement = "stopped";
        }

        if ((player.body.blocked.down === true) && (cursors.up.isDown)){
            player.setVelocityY(-400);
            player.action.movement = "jump";
        }
    }

    update() 
    {
        if (this.player !== null){
            this.handlePlayerMovement(this.player, this.cursors);
        }
    }
}
export default GameScene;