import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ShooterGame from './Game';


let tilesize = 25;
config = (tilesize) => ({
    type: Phaser.AUTO,
    width: 32 * tileSize,
    height: 24 * tileSize,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    /*scene: {
        preload: this.preload,
        create: this.create,
        update: this.update
    }*/
});

new ShooterGame(config, tileSize);//.doGame();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
