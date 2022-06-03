import Phaser from 'phaser';

const action = () => ({
    movemnet : "stopped",
    firing : "false",
    existing : "true"
});

export const create = (playerScene) => {
    const player = new Phaser.Physics.Arcade.Sprite(playerScene, 100, 400, "box", "misa-front");
    player.action = action();
    return player;
};

export const addToScene = (player, scene) =>
    scene.add.existing(player);

export const addToPhysics = (player, physics) =>
    physics.add.existing(player);
