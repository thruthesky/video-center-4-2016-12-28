import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  name;
  constructor() {
    this.name = localStorage.getItem('name');
  }

  ngOnInit() {
  }

}
