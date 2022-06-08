import Phaser from "phaser";

const getInitialActions = () => ({
    left : false,
    right : false,
    up : false,
    down : false,
    shots : 0});

export const create = (playerScene, xPos, yPos) => {
    const player = new Phaser.Physics.Arcade.Sprite(playerScene, xPos, yPos, "box", "misa-front");
    player.setOrigin(0,0);
    player.action = getInitialActions();
    return player;
};

export const getLatestPlayerActionsQueue = (player, cursors) => 
{
    const actionEvents = [];

    if (cursors.left.isDown && !player.action.left) 
        actionEvents.push("leftPressed");
    if (!cursors.left.isDown && player.action.left)
        actionEvents.push("leftReleased");
    
    if (cursors.right.isDown && !player.action.right) 
        actionEvents.push("rightPressed");
    if (!cursors.right.isDown && player.action.right)
        actionEvents.push("rightReleased");

    if (cursors.up.isDown && !player.action.up) 
        actionEvents.push("upPressed");
    if (!cursors.up.isDown && player.action.up)
        actionEvents.push("upRelease");   

    return actionEvents;
};

Phaser.Physics.Arcade.Sprite.prototype.getMovementData = function() {
    return {
        "pos": this.body.position, 
        "vel": this.body.velocity,
        "acc": this.body.acceleration };
};

export const addToScene = (player, scene) =>
    scene.add.existing(player);

export const addToPhysics = (player, physics) =>
    physics.add.existing(player);
