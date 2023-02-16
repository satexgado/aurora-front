import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-servicefichier',
  templateUrl: './servicefichier.component.html',
  styleUrls: ['./servicefichier.component.scss']
})
export class ServicefichierComponent implements OnInit {

  @Input() id:any;
  @Input() vue:any;
  urlpost="servfile";
  urlget="servbyfile";
  @Input('id') set myid(id:any){
    this.id=id;
    this.getservice(this.id);
  }
  @Input('vue') set myvue(vue:any){
    this.vue=vue;
  }
  public addserviceForm:any= FormGroup;
  statut: boolean=false;
  loadservice:boolean=false;
  service;
  typestructure:any;
  indexdelserv;
  constructor(private formBuilder: FormBuilder,public informe: InformeService,public notify:NotificationService,public crud:CrudService) { }

  ngOnInit() {
    this.getStructure();
    this.initAddserviceForm();
  }
  //Initial add service form
  initAddserviceForm() {
    this.addserviceForm = this.formBuilder.group({
      service:['',Validators.required]
    });

  }
  getservice($id){
    this.loadservice=false;
    this.service=undefined;
    this.crud.get(this.urlget+'/'+$id).subscribe((data)=>{
      this.service=data;
      if(this.service[0]){
        this.loadservice=true;
      }
    })
  }
  getStructure(){
    this.typestructure=undefined;
    this.crud.get('mystruct').subscribe((data)=>{
      this.typestructure=data;
    });
  }
   //Function to add data to service form
   addservice(){
    this.statut=true;
    const serviceForm=this.addserviceForm.value;
    serviceForm.fichier=this.id;
    this.crud.post(this.urlpost,serviceForm).subscribe(
      (data)=>{
        this.statut=false;
        var myval=data;
        if(myval.message){
          this.notify.onError(myval.message);
        }
        else{
          this.service.unshift(data);
          this.loadservice=true;
          this.informe.closeModal('#addServ');
          this.informe.shownotifier('SUCCESS');
          this.initAddserviceForm();
          this.resetservice();
        }
      },
      (error)=>{
        this.statut=false;
        this.notify.onError("Nous n'avons pas pu effectuer cette opération. Veuillez essayer de nouveau");
      }
    );
   }
   resetservice(){
    this.initAddserviceForm();
    this.informe.closeModal('#addServ');
    this.statut=false;
  }
  showdelserv($id:any){
    this.indexdelserv=$id;
    this.informe.openModal('#delservbaseModal');
  }
  delservbase() {
    this.statut=true;
    this.crud.delete(this.urlpost+'/',this.service[this.indexdelserv].id).subscribe({
      next:(data) => {
        this.informe.shownotifier('SUCCESS');
        this.service.splice(this.indexdelserv, 1);
        this.statut=false;          
        this.informe.closeModal('#delservbaseModal');
       },
       error: (err) =>{
        this.notify.onError("Impossible d'effectuer la suppression. d'autres éléments sont associés à cet élément");
        this.informe.closeModal('#delservbaseModal');
        this.statut=false;
      }
    }
    );
   
  }

}
