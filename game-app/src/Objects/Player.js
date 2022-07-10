import Phaser from "phaser";

const getInitialActions = () => ({
    ...getClearedActions(),
    shots : 0});

export const getClearedActions = () => ({
    left : false,
    right : false,
    up : false,
    down : false});

export const create = (playerScene, xPos, yPos) => {
    const player = new Phaser.Physics.Arcade.Sprite(playerScene, xPos, yPos, "player", "misa-front");
    player.setFrame(1);

    player.setOrigin(0,0);
    player.action = getInitialActions();

    return player;
};

export const setPlayerPhysics = (player, physics) => {
    physics.add.existing(player);
    player.setGravityY(600);
    player.setMaxVelocity(280, 500);
    player.accelerationRate = 1500;
    player.flipped = false;
    player.setBodySize(0.45*player.body.width,player.body.height,true);
};

export const getLatestPlayerActionsQueue = (player, cursors) => 
{
    const actionEvents = [];

    if (cursors.left.isDown && !player.action.left) 
        actionEvents.push({left:true});
    if (!cursors.left.isDown && player.action.left)
        actionEvents.push({left:false});
    
    if (cursors.right.isDown && !player.action.right) 
        actionEvents.push({right:true});
    if (!cursors.right.isDown && player.action.right)
        actionEvents.push({right:false});

    if (cursors.up.isDown && !player.action.up) 
        actionEvents.push({up:true});
    if (!cursors.up.isDown && player.action.up)
        actionEvents.push({up:false});   

    return actionEvents;
};

export const getPlayerActionsFromEvents = (player, events) =>
    events.reduce((action, event) => {
        if (event["left"] === true)
            action.left = true;
        else if (event["left"] === false)
            action.left = false;
        if (event["right"] === true)
            action.right = true;
        else if (event["right"] === false)
            action.right = false;
        if (event["up"] === true)
            action.up = true;
        else if (event["up"] === false)
            action.up = false;
        return action;
    },{...player.action});

/*Phaser.Physics.Arcade.Sprite.prototype.getMovementData = function() {
    return {
        "pos": this.body.position, 
        "vel": this.body.velocity,
        "acc": this.body.acceleration };
};*/


