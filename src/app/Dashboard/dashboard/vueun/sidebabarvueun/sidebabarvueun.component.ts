import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebabarvueun',
  templateUrl: './sidebabarvueun.component.html',
  styleUrls: ['./sidebabarvueun.component.scss']
})
export class SidebabarvueunComponent implements OnInit {
  currentUrl:any;
  urlsorti='dashboard/vueun/courriersorti';
  urlentrant='dashboard/vueun/courrierentrant';
  urlinterne='dashboard/vueun/courrierinterne';


  constructor(public router:Router) { }

  ngOnInit(): void {
    this.currentUrl=this.router.url.toString();
    this.router.events.subscribe(val => {
      this.currentUrl=this.router.url.toString();
    });
  }

}
