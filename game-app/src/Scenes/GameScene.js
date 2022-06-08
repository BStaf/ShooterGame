import Phaser from 'phaser';
import * as Player from '../Objects/Player';
import { getLevelAr2 } from '../Objects/TestLevel';

import box from '../../Assets/box.jpg'
import tiles from '../../Assets/platformBlock.jpg'

class GameScene extends Phaser.Scene {
    preload()
    {
      //  this.load.image('bg', 'assets/background.jpg');
        this.load.image('box', box);
        this.load.image('tiles', tiles);
    }

    setupPlayer(scene, xPos, yPos) 
    {
        const player = Player.create(scene, xPos, yPos);
        Player.addToScene(player, scene);
        Player.addToPhysics(player, scene.physics);
        player.setFrictionX(9000);
        player.setGravityY(600);
        player.setMaxVelocity(180, 500);
        player.slowdownRate = 12;
        player.accelerationRate = 1500;

        return player;
    }

    create() 
    {
        const levelAr = getLevelAr2();

        this.cursors = this.input.keyboard.createCursorKeys();

        const map = this.make.tilemap({ data: levelAr, tileWidth: 25, tileHeight: 25 });
        const tiles = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(1, 3);
        layer.setCollisionByProperty({ collides: true });
        
        this.player = this.setupPlayer(this, 100, 400);
        this.player2 = this.setupPlayer(this, 300, 400);
        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.player2, layer);

        this.myPos = {};
        setInterval(
            () => this.movePlayer(this.myPos, this.player2),
            450
        );
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
            player.setAccelerationX(-player.accelerationRate);
        }
        else if (cursors.right.isDown) {
            player.setAccelerationX(player.accelerationRate);
        }
        else if (player.body.blocked.down === true && this.player.body.velocity.x !== 0)
        {//stopped
            player.setAccelerationX(0);
            player.setVelocityX(this.setStopVelocity(
                this.player.body.velocity.x,
                this.player.body.velocity.x > 0 ? 
                    deceleration : 
                    -deceleration));
        }

        if ((player.body.blocked.down === true) && (cursors.up.isDown)){
            player.setVelocityY(-400);
        }
    }

    movePlayer(movement, player)
    {
        if (Object.keys(movement).length !== 0){
            player.setPosition(movement["pos"].x + 250,movement["pos"].y);
            player.setVelocity(movement["vel"].x, movement["vel"].y);
            player.setAcceleration(movement["acc"].x, movement["acc"].y);
        }
    }

    update() 
    {
        if (this.player !== null){
            this.handlePlayerMovement(this.player, this.cursors);
            this.myPos = this.player.getMovementData();
            this.player.actionQueue = Player.getLatestPlayerActionsQueue(this.player, this.cursors);
            //this.movePlayer(this.myPos, this.player2);
        }
    }
}
export default GameScene;