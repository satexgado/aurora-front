import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-echeancefichier',
  templateUrl: './echeancefichier.component.html',
  styleUrls: ['./echeancefichier.component.scss']
})
export class EcheancefichierComponent implements OnInit {

  @Input() id:any;
  @Input() action;
  urlpost="echeafile";
  urlget="echeabyfile";
  @Input('id') set myid(id:any){
    this.id=id;
    this.getecheance(this.id);
  }
  public addecheanceForm:any= FormGroup;
  statut: boolean=false;
  echeance;
  constructor(private formBuilder: FormBuilder,public informe: InformeService,public notify:NotificationService,public crud:CrudService) { }

  ngOnInit() {
  }
  //Initial add echeance form
  initAddecheanceForm() {
    if(this.echeance){
      if(this.echeance[0]){
        this.addecheanceForm = this.formBuilder.group({
          date_debut:[this.echeance[0].date_debut,Validators.required],
          date_fin:[this.echeance[0].date_fin,Validators.required]
        });
      }
      else{
        this.addecheanceForm = this.formBuilder.group({
          date_debut:['',Validators.required],
          date_fin:['',Validators.required]
        });
      }
    }

  }
  getecheance($id){
    this.echeance=undefined;
    this.crud.get(this.urlget+'/'+$id).subscribe((data)=>{
      this.echeance=data;
      this.initAddecheanceForm();
    })
  }
   //Function to add data to echeance form
   addecheance(){
    this.statut=true;
    const echeanceForm=this.addecheanceForm.value;
    echeanceForm.fichier=this.id;
    this.crud.post(this.urlpost,echeanceForm).subscribe(
      (data)=>{
        this.statut=false;
        this.echeance.unshift(data);
          this.informe.shownotifier('SUCCESS');
          this.initAddecheanceForm();
          this.resetecheance();
      },
      (error)=>{
        this.statut=false;
        this.informe.shownotifier('ERROR');
      }
    );
   }
   resetecheance(){
    this.initAddecheanceForm();
    this.statut=false;
  }

  updatecheance() {
    this.statut=true;
    this.crud.put(this.urlpost+'/',this.addecheanceForm.value,this.echeance[0].id).subscribe({
      next:(data) => {
        this.informe.shownotifier('SUCCESS');
        this.echeance[0]=data;
        this.statut=false;          
       },
       error: (err) =>{
        this.informe.shownotifier('ERROR');
        this.statut=false;
      }
    }
    );
   
  }

  verifyDate($form:any,$name){
    var $val;
    if($name=='date_debut'){
      if($form.value.date_fin){
         $val=this.informe.compareDate($form.value.date_fin,$form.value.date_debut);
      }
      if(!$form.value.date_fin){
         $val=this.informe.compareDate($form.value.date_debut,new Date());
      }
      if($val=='NEGATIF'){
        this.notify.onError('Erreur au niveau de la date de debut');
        $form.controls['date_debut'].setValue('');
      }
    }
    if($name=='date_fin'){
      if(!$form.value.date_debut){
        this.notify.onError('Veuillez renseigner la date de debut d\'abord');
        $form.controls['date_debut'].setValue('');
      }
      if($form.value.date_debut){
         $val=this.informe.compareDate($form.value.date_fin,$form.value.date_debut);
        if($val=='NEGATIF'){
          this.notify.onError('Erreur au niveau de la date de fin');
          $form.controls['date_fin'].setValue('');
        }
      }
    }
  }


}
