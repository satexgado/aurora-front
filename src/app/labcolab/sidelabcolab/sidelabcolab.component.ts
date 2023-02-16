import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidelabcolab',
  templateUrl: './sidelabcolab.component.html',
  styleUrls: ['./sidelabcolab.component.scss']
})
export class SidelabcolabComponent implements OnInit {

  curreturl;
  mymenu=[
    {'nom':'Espace Fichier','compurl':'/labcolab/fichier','icone':'fas fa-text tx-18 tx-echos1 bg-light','url':'fichier'},
    {'nom':'X-File','compurl':'/labcolab/xfile','icone':'fas fa-text-size tx-18 tx-echos1 bg-light','url':'xfile'},
    {'nom':'Modèles','compurl':'/labcolab/modele','icone':'fas fa-text-width tx-18 tx-echos1 bg-light','url':'modele'}
  ];


  constructor(public router:Router) { }

  ngOnInit(): void {
    this.curreturl=this.router.url.toString();  
    this.router.events.subscribe(val => {
      this.curreturl=this.router.url.toString();  
    }); 
  }
  

}
