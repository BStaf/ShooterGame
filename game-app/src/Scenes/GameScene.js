import Phaser from "phaser";
import * as Player from "../Objects/Player";
import { getLevelAr2 } from "../Objects/TestLevel";

import box from "../../Assets/box.jpg";
import tiles from "../../Assets/platformBlock.jpg";
import playerSprite from "../../Assets/PlayerSprite.png";

class GameScene extends Phaser.Scene {
    preload()
    {
        this.load.image("box", box);
        this.load.image("tiles", tiles);
        this.load.spritesheet("player", playerSprite, { frameWidth: 50, frameHeight: 50});
    }

    setupPlayer(scene, xPos, yPos) 
    {
        const player = Player.create(scene, xPos, yPos);
        scene.add.existing(player);
        Player.setPlayerPhysics(player, scene.physics);
        return player;
    }

    create() 
    {
        const levelAr = getLevelAr2();

        this.cursors = this.input.keyboard.createCursorKeys();

        const map = this.make.tilemap({ data: levelAr, tileWidth: 25, tileHeight: 25 });
        const tiles = map.addTilesetImage("tiles");
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(1, 3);
        layer.setCollisionByProperty({ collides: true });
        
        this.player = this.setupPlayer(this, 100, 400);

        const playerAnimation = this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 7
        });

        this.player2 = this.setupPlayer(this, 300, 400);
        this.player3 = this.setupPlayer(this, 500, 400);
        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.player2, layer);
        this.physics.add.collider(this.player3, layer);

        this.myPos = {playerAnimation};

        this.diagnostics = this.createDiagnosticText();

        /*setInterval(
            () => this.movePlayer(this.myPos, this.player2),
            450
        );
        //*/

        /*const debugGraphics = this.add.graphics().setAlpha(0.75);
        layer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });*/
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

    createDiagnosticText = () => 
        this.add.text(5, 5, "text", {font: "12px Arial", fill: "#00000f", align: "left"});

    updateDiagnosticsForPlayer(player, text) {
        text.setText(`Velocity : ${player.body.velocity.x.toFixed(1)}, ${player.body.velocity.y.toFixed(1)}\n` +
        `Acceleration : ${player.body.acceleration.x.toFixed(1)}, ${player.body.acceleration.y.toFixed(1)}\n`+
        `X,Y : ${player.x.toFixed(1)}, ${player.y.toFixed(1)}`);
    }

    isPlayerRunning(player){
        if ((player.action.left || player.action.right) && player.body.blocked.down)
            return true;
        return false;
    }

    handlePlayerAnimations(player){
        if (this.isPlayerRunning(player) && !player.anims.isPlaying)
            player.play({ key: "walk", repeat: -1 });
        else if (!this.isPlayerRunning(player)){//} && player.anims.isPlaying){
            player.stop();
            player.setFrame(1);
        }

        if (player.action.up)
            player.setFrame(0);

        if (player.action.right && !player.flipped){
            player.flipX = true;
            player.flipped = true;
        }
        else if (player.action.left && player.flipped){
            player.flipX = false;
            player.flipped = false;
        }

    }

    handlePlayerMovement(player) 
    {
        if (player.action.left)
            player.setAccelerationX(-player.accelerationRate);
        else if (player.action.right)
            player.setAccelerationX(player.accelerationRate);
        else if (!player.action.left && !player.action.right && player.body.blocked.down === false){
            //if (player.body.velocity.x > 0)
            player.setAccelerationX(0);
        }
            
        else if (!player.action.left && !player.action.right && player.body.blocked.down === true)
        {//stopped
            player.setAccelerationX(0);
            player.setVelocityX(0);
        }      
        if (player.action.up && player.body.blocked.down === true){
            player.setVelocityY(-700);
        }
    }

    update() 
    {
        if (this.player === null)
            return;
        
        const playerEvents = Player.getLatestPlayerActionsQueue(this.player, this.cursors);
        this.player.action = Player.getPlayerActionsFromEventsEvents(this.player, playerEvents);
        this.player2.action = Player.getPlayerActionsFromEventsEvents(this.player, playerEvents);
        this.player3.action = Player.getPlayerActionsFromEventsEvents(this.player, playerEvents);
        this.handlePlayerMovement(this.player);
        this.handlePlayerMovement(this.player2);
        this.handlePlayerMovement(this.player3);

        this.handlePlayerAnimations(this.player);
        
        this.updateDiagnosticsForPlayer(this.player, this.diagnostics);
        //this.myPos = this.player.getMovementData();
        //this.player.actionQueue = Player.getLatestPlayerActionsQueue(this.player, this.cursors);
    }
}
export default GameScene;