import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss']
})
export class EntranceComponent implements OnInit {

  name;
  constructor( private route: ActivatedRoute, private router: Router ) {
    //console.log("name: ", route.snapshot.params['name']);
    //route.params.subscribe( params => console.log('name: ', params['name']));
  }

  ngOnInit() {
  }


  onClickEnterLobby() {
    if ( ! this.name ) return alert("Please inputname");
    localStorage.setItem('name', this.name);
    this.router.navigate(['lobby']);

  }

}
