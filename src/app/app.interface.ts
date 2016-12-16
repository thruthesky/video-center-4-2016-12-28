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
    selectSizeCanvas:any;
    colors:any;
    size: any;
    sizeCanvas: any;
    canvasPhoto:any;
    canvasWidth:string;
    canvasHeight:string;
    whiteboardDisplay:boolean;
}
export interface VideoSetting {
    selectAudio: any;
    selectVideo: any;
    defaultAudio: boolean;
    defaultVideo: boolean;
}

export interface DisplayElement {
    settingsDisplay:boolean;
    chatDisplay:boolean;
    assetDisplay:boolean;
    deviceDisplay:boolean;
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
    {text:"Extra Small" , value: "2" },
    {text:"Small" , value: "4" },
    {text:"Medium" , value: "5" },
    {text:"Large" , value: "8" },
    {text:"Extra Large" , value: "10" }
];
export let sizeCanvas = [
    {text:"340x400" , value: "small" },
    {text:"480x600" , value: "medium" },
    {text:"600x720" , value: "large" }
];
export let whiteboardSetting:WhiteboardSetting = {
  optionDrawMode:"",
  optionDrawSize:"",
  optionDrawColor:"",
  selectDrawColor:null,
  selectDrawSize:null,
  selectSizeCanvas:null,
  colors: whiteboardColors,
  size: whiteboardSize,
  sizeCanvas: sizeCanvas,
  canvasPhoto: "../../assets/1.png",
  canvasWidth: "340px",
  canvasHeight: "400px",
  whiteboardDisplay: false
}
export let videoSetting:VideoSetting = {
    selectAudio: null,
    selectVideo: null,
    defaultAudio: false,
    defaultVideo: false
};
export let displayElement: DisplayElement =  {
    settingsDisplay:false,
    chatDisplay:true,
    assetDisplay:false,
    deviceDisplay:false
}
export let videoSize:string = '100%'; 
// export let videoSize:string = '226px'; 