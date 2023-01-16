import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evenement',
  templateUrl: './evenement.component.html',
  styleUrls: ['./evenement.component.scss']
})
export class EvenementComponent implements OnInit {

  urlpost='commentevent';
  urlget='commentbyevent';
  url='evenement';
  urlshared='sharedevent';
  evenement:any;
  data:boolean=false;
  loardstatut: boolean = false;
  updatestatut:boolean=false;
  del:boolean=false;
  public AddobjetevenementForm:any= FormGroup;
  public modifevenementForm:any= FormGroup;
  afficheupdate:any;
  idevenement:any;
  detailevenement:any;
  p1:number=1;
  affichecomevent:any;
  type=['Interne','Externe'];
  affichedetail:any;
  currentid:any;
  loardparticipant:boolean=false;
  detailevent:any;
  StImg=environment.imageUrl;
  objet=[{'color':'bg-primary','value':'Réunions'},{'color':'bg-danger','value':'Rendez-vous'},{'color':'bg-success','value':'Visite'},
  {'color':'bg-pink','value':'Formations'},{'color':'bg-facebook','value':'Invitations'},{'color':'bg-orange','value':'Voyages'},
  {'color':'bg-purple','value':'Séminaires'},{'color':'bg-teal','value':'Autres événements'}];
  currentobjet:any;
  searcheventText = '';


  constructor(private formBuilder: FormBuilder, public service: InformeService,public crud:CrudService,public notifyservice:NotificationService){ }

  ngOnInit(): void {
    this.getEvent(this.url);
    this.initAddobjetevenementForm();
  }
  getEvent($url:any,$objet?:any){
    this.evenement=undefined;
    this.data=false;
    this.currentobjet=undefined;
    this.idevenement=undefined;
    this.searcheventText = '';
    this.resetevent();
    if($objet){
      this.currentobjet=$objet;
    }
    this.service.emitSubject($url);
    this.service._Subject$.subscribe(
      (data: any) => {
        this.evenement = data;
        if(this.evenement[0]){
          this.data=true;
        }
    });
  }

    //Initial add Registre form
  initAddobjetevenementForm() {
    this.AddobjetevenementForm = this.formBuilder.group({
      libelle: ['',Validators.required],
      objet: ['',Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      lieu: ['', Validators.required],
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required],
      type: ['', Validators.required]
    });
  }
  addEvent($file?:any){
      this.loardstatut = true;
      this.service.add3(this.url,this.AddobjetevenementForm.value);
      this.service._Subject$.subscribe(()=>{
          this.resetevent();
          if($file){
            this.currentid=this.evenement[0]?.id;
          }
      });
      if($file){
        this.service.openModal('#fileModal');
      }

  }
  resetevent(){
    this.initAddobjetevenementForm();
    this.service.closeModal('#objetevenementModal');
    this.service.closeModal('#updateevenementModal');
    this.afficheupdate=undefined;
    this.updatestatut=false;
    this.loardstatut = false;
    this.affichecomevent=undefined;
    this.affichedetail=undefined;
  }
  getId(item:any,$name:any,index?:any){
    this.detailevenement=item;
    this.idevenement=item.id;
    if(this.detailevenement){
       if($name=='update'){
         this.modifQForm(this.detailevenement);
         this.afficheupdate='ok';
         this.service.openModal('#updateevenementModal');
       }
       if($name=='detail'){
          this.affichedetail='okk';
          this.affichecomevent=undefined;
          this.detailevent=undefined;
          this.crud.get(this.url+'/'+this.idevenement).subscribe((data)=>{
            this.detailevent=data;
          });
       }
       if($name=='comment'){
        this.affichecomevent='ok';
        this.affichedetail=undefined;
       }
       if($name=='shared'){
        this.service.openModal('#addModalresaffect');
       }
       if($name=='delete'){
        this.service.openModal('#deleteModal');
        this.currentobjet=undefined;
       }
       if($name=='participant'){
          this.loardparticipant=true;
          var currentdata:any;
          const fd={'evenement':this.idevenement};
          this.crud.post('/participevent',fd).subscribe(
            (data)=>{
                this.loardparticipant=false;
                currentdata=data;
                if(currentdata.value=='SUCCESS'){
                  this.service.shownotifier('SUCCESS');
                  this.evenement[index].participants.push(currentdata.data);
                }
                if(currentdata.value=='ERROR'){
                  this.notifyservice.onError('Vous étes déjà un participant');
                }
            },
            (error)=>{
             this.loardparticipant=false;
             this.service.shownotifier('ERROR');
            }
          )
       }

    }

  }

  modifQForm(data:any) {
      this.modifevenementForm = this.formBuilder.group({
        libelle: [data.libelle,Validators.required],
        objet: [data.objet,Validators.required],
        date: [data.date, Validators.required],
        description: [data.description,Validators.required],
        lieu: [data.lieu, Validators.required],
        heure_debut: [data.heure_debut, Validators.required],
        heure_fin: [data.heure_fin, Validators.required],
        type: [data.type, Validators.required]
     });
  }

  updateValueevent($file?:any){
    this.updatestatut=true;
    if(this.modifevenementForm.valid){
      this.service.update(this.url+'/',this.modifevenementForm.value,this.idevenement,this.url);
      this.service._Subject$.subscribe(()=>{
        this.resetevent();
      });
      if($file){
        this.currentid=this.idevenement;
        this.service.openModal('#fileModal');
      }
      this.currentobjet=undefined;
    }
  }
  verifyDate($type:any,$form:any){
    if($type=='date'){
      var $val=this.service.compareDate($form.value.date,new Date());
      if($val=='NEGATIF'){
        this.notifyservice.onError('Erreur au niveau de la date');
        $form.controls['date'].setValue('');
      }
    }
    if($type=='heure'){
      var $val2=this.service.CalculHours($form.value.heure_fin,$form.value.heure_debut);
      if(!$form.value.heure_debut){
        this.notifyservice.onError('Renseignez d\'abord l\'heure de debut');
        $form.controls['heure_debut'].setValue('');
        $form.controls['heure_fin'].setValue('');
      }
      if($val2==null){
        $form.controls['heure_fin'].setValue('');
      }
    }

  }



}
