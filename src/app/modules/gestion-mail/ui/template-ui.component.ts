import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { GestionMailService } from './../gestion-mail.service';
import { Component, OnInit } from '@angular/core';
import { CrMail, ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';
import { DatePipe } from '@angular/common';
import { CrMailTagFactory } from 'src/app/core/services/gestion-courrier/cr-mail-tag';
import { Sort } from 'src/app/shared/models/query-options';


@Component({
  selector: 'app-gestion-mail-ui',
  templateUrl: 'template-ui.component.html',
  styleUrls: ['./template-ui.component.css']
})

export class GestionMailUiComponent implements OnInit {

  newMail: ICrMail;
  newMailFormTitle = 'nouveau';
  allTags: any[] = [];

  constructor(
    public service: GestionMailService
  ) { }

  ngOnInit() {

    let tagServices = new CrMailTagFactory();

    tagServices.list(
      new QueryOptions().setSort([new Sort('libelle', 'ASC')])
    ).subscribe(
      (data)=> {
       this.allTags = data.data;
      }
    )

    this.service.newMail$.subscribe(
      ()=> {
        this.onNewMail();
      }
    );

    this.service.transfertMail$.subscribe(
      (mail)=>{
        this.onTransfert(mail);
      }
    )

    this.service.respondMail$.subscribe(
      (mail)=> {
        this.onRespondToMail(mail);
      }
    )

    this.service.respondToAllMail$.subscribe(
      (data)=>{
        this.onRespondToAll(data);
      }
    )
  }

  onNewMail() {
    this.newMailFormTitle = 'Nouveau';
    this.newMail = new CrMail();
  }

  onTransfert(mail: ICrMail) {
    this.newMailFormTitle = 'Trf: ' + mail.libelle
    let newMail = new CrMail();
    let destinataireList = '';
    newMail.libelle = 'Trf: ' + mail.libelle;
    newMail.mail_id =  mail.id;
    mail.affectations.forEach(
      element=> {
        destinataireList = destinataireList+ ' '+ element.libelle + '(' + element.email +')';      }
    )
    newMail.contenu = `
    <p>
    <span data-test="10" class="pls" style="
      background-color: rgb(255, 255, 255);
      color: rgb(34, 34, 34);
      font-family: Arial, Helvetica, sans-serif;
    ">---------- message transferer---------</span
  ><br /><span
    style="
      background-color: rgb(255, 255, 255);
      color: rgb(34, 34, 34);
      font-family: Arial, Helvetica, sans-serif;
    "
    >De&nbsp;: </span
  ><strong>${mail.auteur.libelle}</strong
  ><span
    style="
      background-color: rgb(255, 255, 255);
      color: rgb(34, 34, 34);
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    &lt;${mail.auteur.email}&gt;</span
  ><br/><span
    style="
      background-color: rgb(255, 255, 255);
      color: rgb(34, 34, 34);
      font-family: Arial, Helvetica, sans-serif;
    "
    >Date: ${new DatePipe('fr').transform(mail.date, 'medium')}</span
  ><br/><span
    style="
      background-color: rgb(255, 255, 255);
      color: rgb(34, 34, 34);
      font-family: Arial, Helvetica, sans-serif;
    "
    >Subject: ${mail.libelle}</span
  ><br /><span
    style="
      background-color: rgb(255, 255, 255);
      color: rgb(34, 34, 34);
      font-family: Arial, Helvetica, sans-serif;
    "
    >À: ${destinataireList}&gt;</span>
</p>
<p>&nbsp;</p>
${mail.contenu}
    `;

    this.newMail = newMail;
  }

  onRespondToMail(mail: ICrMail) {
    this.newMailFormTitle = 'Rep: '+ mail.libelle;
    let newMail = new CrMail();
    newMail.libelle = 'Rep: '+ mail.libelle;
    newMail.mail_id =  mail.id;
    newMail.destinataire_personnes = [
      mail.auteur
    ];
    newMail.contenu = `
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    Le ${new DatePipe('fr').transform(mail.date, 'medium')},  <strong>${mail.auteur.libelle}</strong> <span
    style="
      background-color: rgb(255, 255, 255);
      color: rgb(34, 34, 34);
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    &lt;${mail.auteur.email}&gt;</span
  > a écrit
  <blockquote>
  ${mail.contenu}
  </blockquote>
    `;
    this.newMail = newMail;
  }

  onRespondToAll(mail: ICrMail) {
    this.newMailFormTitle = 'Rep: '+ mail.libelle;
    let newMail = new CrMail();
    newMail.libelle = 'Rep: '+ mail.libelle;
    newMail.destinataire_personnes = [ ...mail.destinataire_personnes, ...[
      mail.auteur
    ]];
    newMail.destinataire_structures = mail.destinataire_structures;
    newMail.mail_id =  mail.id;
    newMail.contenu = `
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    Le ${new DatePipe('fr').transform(mail.date, 'medium')},  <strong>${mail.auteur.libelle}</strong> <span
    style="
      background-color: rgb(255, 255, 255);
      color: rgb(34, 34, 34);
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    &lt;${mail.auteur.email}&gt;</span
  > a écrit
  <blockquote>
  ${mail.contenu}
  </blockquote>
    `;
    this.newMail = newMail;
  }

  closeMailForm() {
    this.newMail = null;
  }

}
