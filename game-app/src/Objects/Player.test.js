import * as Player from '../Objects/Player';


test('gets expected action queue', () => {
    const player = {};
    player.action = getInitialActions();
    const cursors = getInitCursor();

    //render(<App />);
    //const linkElement = screen.getByText(/learn react/i);
    expect(
        Player.getLatestPlayerActionsQueue(player, cursors))
        .toBe([]);
});
//cursors.left.isDown

const getInitCursor = () => {
    const cursors = {};
    cursors.left.isDown = false;
    cursors.right.isDown = false;
    cursors.up.isDown = false;
    cursors.down.isDown = false;
    return cursors; 
};

const getInitialActions = () => ({
    left : false,
    right : false,
    up : false,
    down : false,
    shots : 0});