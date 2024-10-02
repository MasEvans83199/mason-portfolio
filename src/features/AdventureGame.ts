interface Room {
    description: string;
    exits: { [key: string]: string };
    items?: string[];
    interactions?: { [key: string]: string };
}

interface GameState {
    currentRoom: string;
    inventory: string[];
    flags: { [key: string]: boolean };
}

const rooms: { [key: string]: Room } = {
    start: {
        description: "You find yourself in a dimly lit study. An old computer sits on a desk, its screen flickering with an eerie glow. There's a door to the north and a window to the east.",
        exits: { north: 'corridor', east: 'garden' },
        items: ['old floppy disk'],
        interactions: {
            computer: "The computer seems to be running an ancient operating system. Maybe it could read a floppy disk?",
            desk: "The desk is cluttered with papers and old technology. You notice an old floppy disk.",
        }
    },
    corridor: {
        description: "You're in a long, dark corridor. Strange symbols flicker on the walls, reminiscent of matrix code. There's a door to the south and a staircase going up.",
        exits: { south: 'start', up: 'server_room' },
        interactions: {
            symbols: "The symbols seem to shift and change as you look at them. They're mesmerizing.",
            walls: "The walls are covered in constantly changing symbols. It's disorienting.",
        }
    },
    garden: {
        description: "You step into a beautiful digital garden. Pixelated flowers sway in a non-existent breeze. There's a shed to the north and a window back to the west.",
        exits: { north: 'shed', west: 'start' },
        items: ['encryption key'],
        interactions: {
            flowers: "As you touch a flower, it dissolves into a shower of pixels, revealing an encryption key.",
        }
    },
    shed: {
        description: "You're in a virtual shed. A large server rack hums in the corner. There's a rusty lever on the wall.",
        exits: { south: 'garden' },
        interactions: {
            lever: "You pull the lever. A hidden panel slides open, revealing a passage to a secret room.",
            "server rack": "The server rack is filled with blinking lights. It seems to be processing something important.",
        }
    },
    server_room: {
        description: "You're in a high-tech server room. Rows of servers line the walls, blinking and humming. A large mainframe dominates the center of the room.",
        exits: { down: 'corridor' },
        interactions: {
            mainframe: "The mainframe has a slot for a floppy disk and a keypad for entering an encryption key.",
        }
    },
    secret_room: {
        description: "You've discovered a hidden room! It's filled with ancient technology and modern gadgets. A glowing portal shimmers in one corner.",
        exits: { out: 'shed' },
        interactions: {
            portal: "The portal seems to lead to another dimension. It might be your way out of this digital world.",
        }
    },
    end: {
        description: "Congratulations! You've completed the Coder's Quest and escaped the digital labyrinth!",
        exits: {}
    }
};

const processCommand = (state: GameState, command: string): { newState: GameState, message: string } => {
    const words = command.toLowerCase().split(' ');
    const action = words[0];
    const target = words.slice(1).join(' ');

    const moveActions = ['go', 'move', 'walk', 'run', 'travel', 'head'];
    const takeActions = ['take', 'grab', 'pick', 'get', 'acquire'];
    const useActions = ['use', 'utilize', 'activate', 'operate'];
    const lookActions = ['look', 'examine', 'inspect', 'check'];

    if (moveActions.includes(action)) {
        return move(state, target);
    } else if (takeActions.includes(action)) {
        return takeItem(state, target);
    } else if (useActions.includes(action)) {
        return useItem(state, target);
    } else if (lookActions.includes(action)) {
        return look(state, target);
    } else if (action === 'inventory') {
        return { newState: state, message: `You are carrying: ${state.inventory.join(', ') || 'nothing'}` };
    } else {
        return { newState: state, message: "I don't understand that command. Try 'look', 'go', 'take', 'use', or 'inventory'." };
    }
};

const move = (state: GameState, direction: string): { newState: GameState, message: string } => {
    const currentRoom = rooms[state.currentRoom];
    const validDirections = Object.keys(currentRoom.exits);
    const matchedDirection = validDirections.find(dir => dir.startsWith(direction.toLowerCase()));

    if (matchedDirection) {
        const newRoom = currentRoom.exits[matchedDirection];
        return {
            newState: { ...state, currentRoom: newRoom },
            message: rooms[newRoom].description
        };
    }
    return { newState: state, message: "You can't go that way. Try another direction." };
};

const takeItem = (state: GameState, item: string): { newState: GameState, message: string } => {
    const currentRoom = rooms[state.currentRoom];
    const matchedItem = currentRoom.items?.find(i => i.toLowerCase().includes(item.toLowerCase()));

    if (matchedItem) {
        const newState = {
            ...state,
            inventory: [...state.inventory, matchedItem]
        };
        currentRoom.items = currentRoom.items?.filter(i => i !== matchedItem);
        return { newState, message: `You picked up the ${matchedItem}.` };
    }
    return { newState: state, message: "You can't take that." };
};

const useItem = (state: GameState, item: string): { newState: GameState, message: string } => {
    const matchedItem = state.inventory.find(i => i.toLowerCase().includes(item.toLowerCase()));

    if (matchedItem) {
        if (matchedItem === 'old floppy disk' && state.currentRoom === 'server_room') {
            return {
                newState: { ...state, flags: { ...state.flags, diskUsed: true } },
                message: "You insert the floppy disk into the mainframe. It whirs to life, but seems to be waiting for an encryption key."
            };
        }
        if (matchedItem === 'encryption key' && state.currentRoom === 'server_room' && state.flags.diskUsed) {
            return {
                newState: { ...state, currentRoom: 'end' },
                message: "You enter the encryption key. The mainframe processes the data from the floppy disk. Suddenly, a portal opens! You step through and find yourself back in the real world."
            };
        }
        return { newState: state, message: "You can't use that here." };
    }
    return { newState: state, message: "You don't have that item." };
};

const look = (state: GameState, target: string): { newState: GameState, message: string } => {
    const currentRoom = rooms[state.currentRoom];
    if (!target) {
        return { newState: state, message: currentRoom.description };
    }
    const interaction = currentRoom.interactions?.[target.toLowerCase()];
    if (interaction) {
        return { newState: state, message: interaction };
    }
    return { newState: state, message: "You don't see anything special about that." };
};

export const adventureGame = { rooms, processCommand };