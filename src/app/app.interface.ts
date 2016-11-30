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
export interface WhiteboardSetting {
    optionDrawMode:string;
    optionDrawSize:string;
    optionDrawColor:string;
    selectDrawSize:any;
    selectDrawColor:any;
    colors:any;
    size:any;
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
export let whiteboardColors = [
    {text:"Black" , value: "#161515" },
    {text:"Grey" , value: "#57646B" },
    {text:"White" , value: "#fff" },
    {text:"Red" , value: "#D01B1B" },
    {text:"Green" , value: "#1DB73C" },
    {text:"Blue" , value: "#2094D7" }
];

export let whiteboardSize = [
    {text:"Extra Small" , value: "1" },
    {text:"Small" , value: "3" },
    {text:"Medium" , value: "5" },
    {text:"Large" , value: "7" },
    {text:"Extra Large" , value: "9" }
];
export let whiteboardSetting:WhiteboardSetting = {
  optionDrawMode:"",
  optionDrawSize:"",
  optionDrawColor:"",
  selectDrawSize:null,
  selectDrawColor:null,
  colors: whiteboardColors,
  size: whiteboardSize
}