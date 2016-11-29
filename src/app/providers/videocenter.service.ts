/// <reference path="rmc.d.ts" />
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class VideocenterService {
  socketUrl: string = "http://localhost:9001/";
  static socket:any = false;
  static connection: any;
  public myEvent: EventEmitter<any>;
  constructor() {
    console.log('Hello VideocenterService Provider');
    this.myEvent = new EventEmitter();
  }
  /**
   * @desc This method will get the socket
   */
  get socket() {
    return this.getSocket();
  }
  /**
   * @desc This method will return the socket
   */
  getSocket() {
    if ( VideocenterService.socket === false ) {
        VideocenterService.socket = VideocenterService.connection.getSocket();
    }
    return VideocenterService.socket;
  }
  /**
   * @desc This method will connect to 
   * RTCMultiConnection Server 
   */
  connect() {
    console.log("Videocenter::connect()");
    VideocenterService.connection = new RTCMultiConnection();
    VideocenterService.connection.socketURL = this.socketUrl;
    this.initializeConnection();
    this.listen();
  }
  initializeConnection() {
    let connection: any = <any> VideocenterService.connection;
    connection.enableFileSharing = false;
    connection.session = {
        audio: true,
        video: true,
        data : false
    };
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    };
    connection.getExternalIceServers = false;
    connection.iceServers = [];
    connection.iceServers.push({
        urls: 'turn:videocenter.co.kr:3478',
        username: 'test_username1',
        credential: 'test_password1'
    });
  }
  /**
   * @desc This Method will emit a protocol in the server
   * @param protocol - name of socket event
   * @param data - any class of data for example username, roomname, message
   * @param callback - this will be invoke after the server invoke it
   */
  emit( protocol: string, data?: any, callback?: boolean | any ) {
    if ( callback ) this.socket.emit( protocol, data, callback );
    else this.socket.emit( protocol, data );
  }

  /**
   * @desc Group of methods to communicate
   * in the Server
   */

  /**
   * @desc This method will update the username
   * @param username, callback
   */
  updateUsername( username: string, callback: ( user:any ) => void ) {
    this.emit( 'update-username', username, ( user: any ) => {
      localStorage.setItem('username', user.name);
      callback( user );
    });
  }
  /**
   * @desc This method will join a room 
   * @param roomname, callback
   */
  joinRoom( roomname: string, callback: ( room:any ) => void ) {
    this.emit('join-room', roomname, room => {
      localStorage.setItem('roomname', room);
      callback( room );
    });
  }
  /**
   * @desc This method will get all the user in roomlist
   * @param roomname, callback
   */
  getUserList( roomname: string, callback : any ) : void {
    this.emit('user-list', roomname, callback);
  }
  /**
   * @desc This method will logout the user
   * @param  callback
   */ 
  logout( callback ) {
    localStorage.setItem('username', '');
    this.emit('log-out', callback );
  }
  /**
   * @desc This Method listens to socket event and
   * pass it to eventEmmiter
   */
  
  listen() {
    let socket = this.socket;

    socket.on('update-username', data => {
      data.eventType = "update-username";
      this.myEvent.emit(data);
    });
    socket.on('join-room', re => {
    });
    socket.on('leave-room', re => {
    });
    socket.on('room-cast', re => {
    });
    socket.on('you-are-new-owner', re => {
    });
    socket.on('chatMessage', re => {
    });
    socket.on('whiteboard', re => {
    });
    socket.on('log-out', re => {
    });
    socket.on('disconnect', re => {
    });
  }

}
