import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mysidefichier',
  templateUrl: './mysidefichier.component.html',
  styleUrls: ['./mysidefichier.component.scss']
})
export class MysidefichierComponent implements OnInit {
  curreturl;
  mymenu=[
    {'nom':'Acceuil','compurl':'/labcolab/xfile','icone':'fas fa-folder-tree tx-18 tx-echos1 bg-light','url':'.'},
    {'nom':'Vue en Arbre','compurl':'/labcolab/xfile/vue_arbre','icone':'fas fa-folder-tree tx-18 tx-echos1 bg-light','url':'vue_arbre'},
    {'nom':'Vue Kanban','compurl':'/labcolab/xfile/vue_kanban','icone':'fas fa-line-columns tx-18 tx-echos1 bg-light','url':'vue_kanban'}
  ];


  constructor(public router:Router) { }

  ngOnInit(): void {
    this.curreturl=this.router.url.toString();  
    this.router.events.subscribe(val => {
      this.curreturl=this.router.url.toString();  
    }); 
  }
  

}
