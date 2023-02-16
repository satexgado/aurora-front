import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-motclefichier',
  templateUrl: './motclefichier.component.html',
  styleUrls: ['./motclefichier.component.scss']
})
export class MotclefichierComponent implements OnInit {

  @Input() id:any;
  urlpost="motclefile";
  urlget="motclebyfile";
  @Input('id') set myid(id:any){
    this.id=id;
    this.getmotcles(this.id);
  }
  public addmotclesForm:any= FormGroup;
  statut: boolean=false;
  loadmotcles:boolean=false;
  motcles;
  indexdelmotcles;
  constructor(private formBuilder: FormBuilder,public informe: InformeService,public notify:NotificationService,public crud:CrudService) { }

  ngOnInit() {
    this.initAddmotclesForm();
  }
  //Initial add motcles form
  initAddmotclesForm() {
    this.addmotclesForm = this.formBuilder.group({
      mot:['',Validators.required]
    });

  }
  getmotcles($id){
    this.loadmotcles=false;
    this.motcles=undefined;
    this.crud.get(this.urlget+'/'+$id).subscribe((data)=>{
      this.motcles=data;
      if(this.motcles[0]){
        this.loadmotcles=true;
      }
    })
  }
   //Function to add data to motcles form
   addmotcles(){
    this.statut=true;
    const motclesForm=this.addmotclesForm.value;
    motclesForm.fichier=this.id;
    this.crud.post(this.urlpost,motclesForm).subscribe(
      (data)=>{
        this.statut=false;
        var myval=data;
        if(myval.message){
          this.notify.onError(myval.message);
        }
        else{
          this.motcles.unshift(data);
          this.loadmotcles=true;
          this.informe.closeModal('#addmotcles');
          this.informe.shownotifier('SUCCESS');
          this.initAddmotclesForm();
          this.resetmotcles();
        }
      },
      (error)=>{
        this.statut=false;
        this.notify.onError("Nous n'avons pas pu effectuer cette opération. Veuillez essayer de nouveau");
      }
    );
   }
   resetmotcles(){
    this.initAddmotclesForm();
    this.informe.closeModal('#addmotcles');
    this.statut=false;
  }
  showdelmotcles($id:any){
    this.indexdelmotcles=$id;
    this.informe.openModal('#delmotclesbaseModal');
  }
  delmotclesbase() {
    this.statut=true;
    this.crud.delete(this.urlpost+'/',this.motcles[this.indexdelmotcles].id).subscribe({
      next:(data) => {
        this.informe.shownotifier('SUCCESS');
        this.motcles.splice(this.indexdelmotcles, 1);
        this.statut=false;          
        this.informe.closeModal('#delmotclesbaseModal');
       },
       error: (err) =>{
        this.notify.onError("Impossible d'effectuer la suppression. d'autres éléments sont associés à cet élément");
        this.informe.closeModal('#delmotclesbaseModal');
        this.statut=false;
      }
    }
    );
   
  }
}
