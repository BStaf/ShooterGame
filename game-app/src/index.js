import './index.css';
import ShooterGame from './Game';
import * as conf from './Config';

const tileSize = 25;

new ShooterGame(conf.config, tileSize);