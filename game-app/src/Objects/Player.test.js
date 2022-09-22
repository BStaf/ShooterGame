import * as Player from "../Objects/Player";


test("getLatestPlayerActionsQueue_withNoInput_ReturnsEmptyEvents", () => {
    const player = {action: getInitialActions()};
    const cursors = getInitCursor();

    expect(
        Player.getLatestPlayerActionsQueue(player, cursors).length)
        .toBe(0);
});

test("getLatestPlayerActionsQueue_TestLeftInput", () => {
    const player = {action: getInitialActions()};
    const cursors = getInitCursor();

    testDirection("left", player, cursors);
});

test("getLatestPlayerActionsQueue_TestRightInput", () => {
    const player = {action: getInitialActions()};
    const cursors = getInitCursor();

    testDirection("right", player, cursors);
});

test("getLatestPlayerActionsQueue_TestUpInput", () => {
    const player = {action: getInitialActions()};
    const cursors = getInitCursor();

    testDirection("up", player, cursors);
});

test("getPlayerActionsFromEventsEvents_TestUpInput", () => {
    const player = {action: getInitialActions()};
    const cursors = getInitCursor();

    cursors.left.isDown = true;
    let actions = getPlayerActionWithCursors(player, cursors);

    expect(actions.left).toBe(true);

    cursors.up.isDown = true;
    actions = getPlayerActionWithCursors(player, cursors);

    expect(actions.left).toBe(true);
    expect(actions.up).toBe(true);

    cursors.left.isDown = false;
    actions = getPlayerActionWithCursors(player, cursors);

    expect(actions.left).toBe(false);
    expect(actions.up).toBe(true);
});

const getPlayerActionWithCursors = (player, cursors) =>
    Player.getPlayerActionsFromEventsEvents(
        player, 
        Player.getLatestPlayerActionsQueue(player, cursors));

const testDirection = (dir, player, cursors) =>{

    cursors[dir].isDown = true;
    let events = Player.getLatestPlayerActionsQueue(player, cursors);
    expect(events.length).toBe(1);

    player.action[dir] = true;
    events = Player.getLatestPlayerActionsQueue(player, cursors);
    expect(events.length).toBe(0);

    cursors[dir].isDown = false;
    events = Player.getLatestPlayerActionsQueue(player, cursors);
    expect(events.length).toBe(1);
};

const getInitCursor = () => {
    const cursors = {};
    cursors.left = {isDown: false};
    cursors.right = {isDown: false};
    cursors.up = {isDown: false};
    cursors.down = {isDown: false};
    return cursors; 
};

const getInitialActions = () => ({
    left : false,
    right : false,
    up : false,
    down : false,
    shots : 0});