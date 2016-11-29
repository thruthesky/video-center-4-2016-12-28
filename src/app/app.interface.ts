/**
 * @desc Groups of Interface
 */

export interface USER {
    name: string;
    room: string;
    socket: string
    type: string;
    eventType: string;
}

export interface ROOMS {
  ( room_id: string ) : {
    name: string;
    users: Array< USER >;
  }
}

export interface MESSAGE {
    message: string;
    name: string;
    room: string;
    eventType: string;
}

export interface MESSAGELIST {
    messages: Array< MESSAGE >
}

export interface Mouse {
    click: boolean;
    move: boolean;
    pos: { x:number | string,
         y:number | string };
    pos_prev: { x: number | string,
         y: number | string };
}



/**
 * @desc Groups of Variables
 */

export let mouse: Mouse = {
    click: false,
    move: false,
    pos: { x:0, y: 0},
    pos_prev: { x: 0, y: 0 }
}

export const LobbyRoomName: string = 'Lobby';