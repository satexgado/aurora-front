import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared';
import { AppTitleService } from 'src/app/shared/services';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-siderapport',
  templateUrl: './siderapport.component.html',
  styleUrls: ['./siderapport.component.scss']
})
export class SiderapportComponent implements OnInit {

  urlpost='ticketrap';
  public addticketrapForm: any=FormGroup;
  statut: boolean=false;
  ticketrap:any;
  loarding:boolean=false;
  detailticketrap:any;
  idticketrap:any;
  searchticketrap = '';
  orientation=['Interne', 'National', 'International'];
  modalite=['Prévisionnelle', 'Immédiate'];
  niveau=['Urgent','Pas urgent','Normal','Non précisé'];
  affichedetail:any;
  courrier;
  affichemodalite;
  img='taches_ether.svg';
  text1="Vos actions s'afficheront ici";


  constructor(private formBuilder: FormBuilder,public crud:CrudService, public title:AppTitleService,
    public notification:NotificationService,public informe:InformeService,public router:Router)
    {
      this.title.setTitle("Rapports des courriers");
    }

  ngOnInit(): void {
    this.getticketrap(this.urlpost);
    this.initaddticketrapForm();
  }

    //Initial add services form
    initaddticketrapForm() {
      this.addticketrapForm = this.formBuilder.group({
        courrier : ['',Validators.required],
        courrierDT : [null],
        orientation : ['',Validators.required],
        modalite : ['',Validators.required],
        date_modalite : ['',Validators.required],
        objectif : ['',Validators.required],
        date_exec : ['',Validators.required],
        duree : ['',Validators.required],
        niveau : ['',Validators.required]
      });
      this.onChangeCourrier();
    }

    onChangeCourrier() {
      const courriereIdControl = this.addticketrapForm.get('courrier') as FormControl;
      const courriereControl = this.addticketrapForm.get('courrierDT') as FormControl;
      courriereControl.valueChanges.subscribe(
        (value)=>{
          if(value && value.length) {
            courriereIdControl.setValue(value[0].id);
          } else {
            courriereIdControl.setValue(null);
          }
          courriereIdControl.markAsDirty();
          courriereIdControl.markAsTouched();
        }
      )
    }

    getticketrap(url:any){
      this.loarding=false;
      this.ticketrap=undefined;
      this.searchticketrap = '';
      this.crud.get(url).subscribe((data:any)=>{
        this.ticketrap=data;
        if(this.ticketrap[0]){
          this.loarding=true;
        }
      });
    }

    //Function to add data to service form
  add(){
      this.statut=true;
      const formValue=this.addticketrapForm.value;
      var date = new Date(formValue.date_exec);
      // Add ten days to specified date
      date.setDate(date.getDate() + formValue.duree);
      var myear=date.getFullYear();
      var month=date.getMonth() + 1;
      var day = date.getDate();
      formValue.date_exp=myear+'-'+month+'-'+day;

      this.crud.post(this.urlpost,formValue).subscribe({
        next:(data)=>{
          this.ticketrap.unshift(data);
          this.loarding=true;
          this.notification.onSuccess("Opération effectuée avec succés");
          this.resetValue();
        },
        error:(error)=>{
          this.statut=false;
          this.notification.onError("Nous n'avons pas pu effectuer cette opération. Veuillez essayer de nouveau");
        }
      });
  }
  resetValue(){
    this.statut=false;
    this.informe.closeModal('#ticketrapModal');
    this.initaddticketrapForm();
    this.affichedetail=undefined;
    this.affichemodalite=undefined;
  }
  getId(item:any,$name:any,$i?:any){
    this.detailticketrap=item;
    this.idticketrap=item.id;
    if(this.detailticketrap){
       if($name=='detail'){
        this.affichedetail='ok';
        this.router.navigate(['/courrier/rapport/'+this.idticketrap]);
       }
    }

  }

  listenmodalite($form,$event){
    this.affichemodalite=undefined;
    if($event==this.modalite[0]){
      this.affichemodalite='ok';
    }
    if($event==this.modalite[1]){
      var mydate= new Date();
      var myear=mydate.getFullYear();
      var month=mydate.getMonth() + 1;
      var day = mydate.getDate();
      var currentyear=myear+'-'+month+'-'+day;
      $form.controls['date_modalite'].setValue(currentyear);
    }
  }
  verifyDate($form:any,$name){
    if($name=='date_modalite'){
      var $val=this.informe.compareDate($form.value.date_modalite,new Date());
      if($val=='NEGATIF'){
        this.notification.onError('Erreur au niveau de la date');
        $form.controls['date_modalite'].setValue('');
      }
    }
    if($name=='date_exec'){
      var $val=this.informe.compareDate($form.value.date_exec,new Date());
      if($val=='NEGATIF'){
        this.notification.onError('Erreur au niveau de la date');
        $form.controls['date_exec'].setValue('');
      }
    }
  }
}
