import GameScene from './Scenes/GameScene';
import Phaser from 'phaser';

export const config = (tileSize) => ({
    type: Phaser.AUTO,
    width: 32 * tileSize,
    height: 24 * tileSize,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: [GameScene]
});