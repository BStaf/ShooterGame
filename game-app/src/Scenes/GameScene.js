import Phaser from "phaser";
import * as Player from "../Objects/Player";
import { getLevelAr2 } from "../Objects/TestLevel";

import box from "../../Assets/box.jpg";
import tiles from "../../Assets/platformBlock.jpg";

class GameScene extends Phaser.Scene {
    preload()
    {
        this.load.image("box", box);
        this.load.image("tiles", tiles);
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
        const tiles = map.addTilesetImage("tiles");
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(1, 3);
        layer.setCollisionByProperty({ collides: true });
        
        this.player = this.setupPlayer(this, 100, 400);
        this.player2 = this.setupPlayer(this, 300, 400);
        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.player2, layer);

        this.myPos = {};
        /*setInterval(
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
    
    /*movePlayer(movement, player)
    {
        if (Object.keys(movement).length !== 0){
            player.setPosition(movement["pos"].x + 250,movement["pos"].y);
            player.setVelocity(movement["vel"].x, movement["vel"].y);
            player.setAcceleration(movement["acc"].x, movement["acc"].y);
        }
    }*/

    handlePlayerMovement(player) 
    {
        if (player.action.left)
            player.setAccelerationX(-player.accelerationRate);
        else if (player.action.right)
            player.setAccelerationX(player.accelerationRate);
        else if (!player.action.left && !player.action.right && player.body.blocked.down === true)
        {//stopped
            player.setAccelerationX(0);
            player.setVelocityX(0);
        }      
        if (player.action.up && player.body.blocked.down === true){
            player.setVelocityY(-400);
        }
    }

    setPlayerActionsFromEventsEvents(player, events) {
        events.forEach((event) => {
            if (event["left"] === true)
                player.action.left = true;
            else if (event["left"] === false)
                player.action.left = false;
            if (event["right"] === true)
                player.action.right = true;
            else if (event["right"] === false)
                player.action.right = false;
            if (event["up"] === true)
                player.action.up = true;
            else if (event["up"] === false)
                player.action.up = false;
        });
    }

    update() 
    {
        if (this.player !== null){
            const playerEvents = Player.getLatestPlayerActionsQueue(this.player, this.cursors);
            this.setPlayerActionsFromEventsEvents(this.player, playerEvents);
            this.handlePlayerMovement(this.player);
            this.myPos = this.player.getMovementData();
            this.player.actionQueue = Player.getLatestPlayerActionsQueue(this.player, this.cursors);
        }
    }
}
export default GameScene;