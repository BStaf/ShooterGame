import Phaser from "phaser";
import * as Player from "../Objects/Player";
//import { getLevelAr2 } from "../Objects/TestLevel";

import box from "../../assets/images/box.jpg";
import tiles from "../../assets/images/platformBlock.png";
import playerSprite from "../../assets/images/PlayerSprite.png";
import background from "../../assets/images/background.jpg";
import level1 from "../../assets/tilemaps/Level1.json";

class GameScene extends Phaser.Scene {
    preload()
    {
        this.load.image("back", background);
        this.load.image("box", box);
        this.load.image("tiles", tiles);
        this.load.spritesheet("player", playerSprite, { frameWidth: 50, frameHeight: 50});
        this.load.tilemapTiledJSON("map", level1);
    }

    setupPlayer(scene, xPos, yPos) 
    {
        const player = Player.create(scene, xPos, yPos);
        scene.add.existing(player);
        Player.setPlayerPhysics(player, scene.physics);
        return player;
    }

    /* setupAiPlayer(scene, xPos, yPos)
    {
        const player = this.setupPlayer(scene, xPos, yPos);
        const lRecs = [];
        const rRecs = [];
        for (let i=0; i<5; i++){
            lRecs.push(scene.add.rectangle(xPos, yPos-(i*20), 10, 10, 0xff6699));
            rRecs.push(scene.add.rectangle(xPos-20, yPos-(i*20), 10, 10, 0xff6699));
            scene.physics.add.existing(lRecs[i]);
        }
        player["lRecs"] = lRecs;
        player["rRecs"] = rRecs;
        return player;
    }*/

    create() 
    {
        this.cursors = this.input.keyboard.createCursorKeys();

        const map = this.add.tilemap("map");

        this.add.image(0,0,"back").setOrigin(0,0).setScale(3);

        // const map = this.make.tilemap({ data: levelAr, tileWidth: 25, tileHeight: 25 });
        const tiles = map.addTilesetImage("platformBlock", "tiles");
        
        const layer = map.createLayer("Tile Layer 1", tiles);
        // map.createStaticLayer("Platforms", tiles, 0, 200);
        //const layer = map.createLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(1, 3);
        layer.setCollisionByProperty({ collides: true });
        
        this.player = this.setupPlayer(this, 100, 400);
        this.aiPlayer = this.setupPlayer(this, 200, 400);
        this.aiPlayer.action.right = true;
        this.cameras.main.setBounds(0, 0, map.widthInPixels ,map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        const playerAnimation = this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 7
        });


        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.aiPlayer, layer);/*, function (player, wall) {
            if (wall === undefined) return;
            if (player.body.blocked.left){
                player.action = Player.getClearedActions();
                player.action.right = true;
            }
            else if (player.body.blocked.right){
                player.action = Player.getClearedActions();
                player.action.left = true;
            }
        });*/

        //this.physics.add.collider(this.player2, layer);
        //this.physics.add.collider(this.player3, layer);

        this.myPos = {playerAnimation};

        this.diagnostics = this.createDiagnosticText();
        this.diagnostics.setScrollFactor(0);

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
        this.add.text(5, 5, "text", {font: "12px Arial", fill: "#00000F", align: "left"});

    updateDiagnosticsForPlayer(player, text) {
        text.setText(`Velocity : ${player.body.velocity.x.toFixed(1)}, ${player.body.velocity.y.toFixed(1)}\n` +
        `Acceleration : ${player.body.acceleration.x.toFixed(1)}, ${player.body.acceleration.y.toFixed(1)}\n`+
        `X,Y : ${player.x.toFixed(1)}, ${player.y.toFixed(1)}`);
    }

    handlePlayerAnimations(player){
        if (Player.isRunning(player) && !player.anims.isPlaying)
            player.play({ key: "walk", repeat: -1 });
        else if (!Player.isRunning(player)){//} && player.anims.isPlaying){
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
        if (Player.isRunningLeft(player))
            player.setAccelerationX(-player.accelerationRate);
        else if (Player.isRunningRight(player))
            player.setAccelerationX(player.accelerationRate);
        else if (Player.isStoppedInAir(player))
            player.setAccelerationX(0);
        else if (Player.isStoppedOnGround(player)){
            player.setAccelerationX(0);
            player.setVelocityX(0);
        }

        if (Player.jumped(player))
            player.setVelocityY(-700);
    }

    doPlayerMovements(player)
    {
        this.handlePlayerMovement(player);
        this.handlePlayerAnimations(player);
    }

    update() 
    {
        if (this.player === null)
            return;
        
        this.player.action = Player.getPlayerActionsFromEvents(
            this.player,
            Player.getLatestPlayerActionsQueue(this.player, this.cursors));

        this.doPlayerMovements(this.player);

        this.doPlayerMovements(this.aiPlayer);

        /*for (let i=0; i<5; i++){
            const x = this.aiPlayer.lRecs[i];
            x.body.setVelocityX(800);
        }*/

        this.updateDiagnosticsForPlayer(this.player, this.diagnostics);
        //this.myPos = this.player.getMovementData();
        //this.player.actionQueue = Player.getLatestPlayerActionsQueue(this.player, this.cursors);
    }
}
export default GameScene;