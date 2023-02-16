import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared';
import { ItemSelectHelper } from 'src/app/shared/state';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

declare var $;

@Component({
  selector: 'app-execrapport',
  templateUrl: './execrapport.component.html',
  styleUrls: ['./execrapport.component.scss']
})
export class ExecrapportComponent implements OnInit {

  urlpostexec='execrap';
  public addexecutionForm: any=FormGroup;
  statut: boolean=false;
  execution:any;
  loarding:boolean=false; 
  detailexecution:any;
  idexecution:any;
  afficheupdate:any;
  del:boolean=false;;
  updatestatut:boolean=false;
  public updateexecutionForm:any=FormGroup;
  p:number=1;
  searchexecution = '';
  value:any;
  moyen=['Voiture', 'Taxi', 'Vélo', 'Mail', 'Courtier', 'Retrait surplace' ];
  confirmation=['Oui','Non','En attente'];
  depot_par=['Agent interne', 'Agent externe' ];
  statutdepot=['Abandonné','Déposé','Reporté','Non exécuté'];
  raisonnondepot=["Mauvaise adresse", "Adresse introuvable", "Non disponibilité", "En retard", "Flux de dépôt surchargé", "Oubli", 
    "Adresse non précisée", "Pas de téléphone dans l'annuaire", "Changement d'adresse", "Changement de Téléphone", "Pas d'adresse mail", "Mauvaise adresse mail"];
  // affichedetail:any;
  afficheagent;
  affichecoordonne;
  affichedepot;
  public addsearchForm: FormGroup;
  statutsearch:boolean=false;
  afficheresultsearch;
  membres;
  responsable;
  $currentsearch;
  affichelist;
  affichecard;
  afficheplan;
  myfilterplan;
  currentexect;
  typeFilterSelectHelper = new ItemSelectHelper();
  id:any;
  name:any;
  affichedetticket;
  affichenondepot;

  constructor(private formBuilder: FormBuilder,public crud:CrudService,public route:ActivatedRoute,
    public notification:NotificationService,public informe:InformeService) { }

  ngOnInit(): void { 
    this.route.params.subscribe((data)=>{
      var mydata=data;
      this.getexecution(mydata['id']);
    });
    this.showvu('card');
    this.initaddexecutionForm();
    this.initAddsearchForm();
  }
  showvu($name){
    this.affichecard=undefined;
    this.affichelist=undefined;
    this.afficheplan=undefined;
    if($name=='card'){
      this.affichecard='ok';
    }
    if($name=='list'){
      this.affichelist='ok';
    }
    if($name=='plan'){
      this.afficheplan='ok';
      this.myplan();
    }
  }
  myplan(){
    this.myfilterplan=[];
    if(this.execution[0]){
      for(const[i,item] of this.statutdepot.entries()){
        var curentvalue=this.execution.filter(word => word.statut==item);
        this.myfilterplan.push({'value':curentvalue});
      }
    }
  }
  clearDropdownFilter() {
    this.typeFilterSelectHelper.clearSelection();
    // this.showFolder = false;
  }
  resetticket(){
    this.affichedetticket=undefined;
  }
  showticket($name){
    if($name=='detail'){
      this.affichedetticket='ok';
    }
  }

    //Initial add services form
    initaddexecutionForm() {
      this.addexecutionForm = this.formBuilder.group({ 
        statut_depot : ['',Validators.required],
        date_depot : [''],
        heure_depot : [''],
        moyen_depot : [''],
        entite_depot : [''],
        personnelle : [''],
        personnelle1 : [''],
        coordonnee : [''],
        coordonnee1 : [''],
        raison_non_depot : [''],
        statut : [''],
        observation : ['',Validators.required]
      });
    }
       //Initial add searchs form
       initAddsearchForm() {
        this.addsearchForm = this.formBuilder.group({
          search:['',Validators.required]
        });
      }

    getexecution($id:any){
      this.informe.closeModal('#detailexecutionModal');
      this.resetticket();
      this.loarding=false;
      this.execution=undefined;
      this.searchexecution = '';
      this.id=$id;
      this.crud.get('rapbyticket/'+$id).subscribe((data:any)=>{
        var mydata=data;
        this.name=mydata.ticket;
        this.execution=mydata.exect;
        if(this.execution[0]){
          this.loarding=true;
          this.myplan();
        }
      });
    }

 
    //Function to add data to service form
  addexect(){
    var myverif='none';
    if(this.addexecutionForm.value.statut_depot==this.confirmation[0]){
      this.addexecutionForm.controls['raison_non_depot'].setValue('');
      if(this.addexecutionForm.value.date_depot &&
        this.addexecutionForm.value.heure_depot &&
        this.addexecutionForm.value.moyen_depot &&
        this.addexecutionForm.value.entite_depot){
          if( this.addexecutionForm.value.personnelle || this.addexecutionForm.value.coordonnee){
            myverif='ok';
          }
          
      }
    }
    if(this.addexecutionForm.value.statut_depot==this.confirmation[1]){
      this.addexecutionForm.controls['date_depot'].setValue('');
      this.addexecutionForm.controls['heure_depot'].setValue('');
      this.addexecutionForm.controls['moyen_depot'].setValue('');
      this.addexecutionForm.controls['entite_depot'].setValue('');
      this.addexecutionForm.controls['personnelle'].setValue('');
      this.addexecutionForm.controls['coordonnee'].setValue('');
      if(this.addexecutionForm.value.raison_non_depot){
        myverif='ok';
      }
    }
    if(this.addexecutionForm.value.statut_depot==this.confirmation[2]){
      this.addexecutionForm.controls['date_depot'].setValue('');
      this.addexecutionForm.controls['heure_depot'].setValue('');
      this.addexecutionForm.controls['moyen_depot'].setValue('');
      this.addexecutionForm.controls['entite_depot'].setValue('');
      this.addexecutionForm.controls['personnelle'].setValue('');
      this.addexecutionForm.controls['coordonnee'].setValue('');
      this.addexecutionForm.controls['raison_non_depot'].setValue('');
      myverif='ok';
    }
    if(myverif=='ok'){
      this.statut=true;
      const formValue=this.addexecutionForm.value;
      formValue.personnelle=formValue.personnelle1;
      formValue.coordonnee=formValue.coordonnee1;
      formValue.ticket=this.id;
      this.crud.post(this.urlpostexec,formValue).subscribe({
        next:(data)=>{
          this.execution.unshift(data);
          this.loarding=true;
          this.notification.onSuccess("Opération effectuée avec succés");
          this.resetexec();
        },
        error:(error)=>{
          this.statut=false;
          this.notification.onError("Nous n'avons pas pu effectuer cette opération. Veuillez essayer de nouveau");
        }
      });  
    } 
    if(myverif!='ok'){
      this.notification.onError('Veuillez renseigner les champs');
    } 
  }
  resetexec(){
    this.statut=false;
    this.informe.closeModal('#executionModal');
    this.informe.closeModal('#editexecutionModal');
    this.informe.closeModal('#detailexecutionModal');
    this.initaddexecutionForm();
    this.afficheupdate=undefined;
    this.afficheagent=undefined;
    this.affichecoordonne=undefined;
    this.affichedepot=undefined;
    this.affichenondepot=undefined;
    // this.affichedetail=undefined;
  }

  
  getIdexec(item:any,$name:any,$i?:any){
    this.detailexecution=item;
    this.idexecution=item.id;
    this.value=$i; 
    if(this.detailexecution){
       if($name=='update'){
          // this.modifFormexec(this.detailexecution);
          this.afficheupdate='ok';
          this.informe.openModal('#editexecutionModal'); 
       }
       if($name=='delete'){
        this.informe.openModal('#deleteexecutionModal');
       }
       if($name=='detail'){
        this.informe.openModal('#detailexecutionModal');
        this.currentexect=undefined;
        this.crud.get('byexwithrap/'+this.idexecution).subscribe((data)=>{
          this.currentexect=data;
        });
       } 
    }
   
  }


  deleteexec() {
    this.del=true;
    this.crud.delete(this.urlpostexec+'/',this.idexecution).subscribe({
      next:(data) => {
        this.informe.shownotifier('SUCCESS');
        this.execution.splice(this.value, 1);
        this.del=false;          
        this.informe.closeModal('#deleteexecutionModal');
       },
       error: (err) =>{
        this.notification.onError("Impossible d'effectuer la suppression. d'autres éléments sont associés à cet élément");
        this.informe.closeModal('#deleteexecutionModal');
        this.del=false;
      }
    }
    );
   
  }

  updateValueexec(){
    this.updatestatut=true;
    this.crud.put(this.urlpostexec+'/',this.updateexecutionForm.value,this.idexecution).subscribe({
        next:(data) => {
          this.execution[this.value]=data;
          this.informe.shownotifier('SUCCESS');
          this.updatestatut=false;
          this.resetexec();
        },
        error:(error) =>{
          this.informe.shownotifier('ERROR');
          this.updatestatut=false;
        }
    });
  
  }
  verifyDateexec($form:any,$name){
    if($name=='date_depot'){
      var $val=this.informe.compareDate(new Date(),$form.value.date_depot);
      if($val=='NEGATIF'){
        this.notification.onError('Erreur au niveau de la date');
        $form.controls['date_depot'].setValue('');
      }
    }
  }
  listenconfirmation($name,$event){
   if($name=='depot_par'){
    if($event==this.depot_par[0]){
      this.afficheagent='ok';
      this.affichecoordonne=undefined;
    }
    if($event==this.depot_par[1]){
      this.afficheagent=undefined;
      this.affichecoordonne='ok';
    }
   }
   if($name=='statut'){
    if($event==this.confirmation[0]){
      this.affichedepot='ok';
      this.affichenondepot=undefined;
    }
    if($event==this.confirmation[1]){
      this.affichedepot=undefined;
      this.affichenondepot='ok';
    }
    if($event==this.confirmation[2]){
      this.affichedepot=undefined;
      this.affichenondepot=undefined;
    }
   }
  }
  getMembre($tel){
    this.statutsearch=true;
    var myurl;
    var message;
    if(this.afficheagent){
      myurl='myuserby/'+$tel;
      message="Personne non trouvée";
    }
    if(this.affichecoordonne){
      myurl='mycoordby/'+$tel;
      message="Structure non trouvée";
    }

    this.crud.get(myurl).subscribe((data)=>{
        this.membres=data;
        if(this.membres.length>0){
          this.afficheresultsearch='ok';
          this.statutsearch=false;
        }
        else{
          this.notification.onError(message);
          this.statutsearch=false;
        }
    })
  }
    
  addValue($val){
      this.responsable=$val;
      this.afficheresultsearch=undefined; 
      // $(this.$currentsearch).val(this.responsable.prenom+' '+this.responsable.nom);
      this.informe.closeModal('#searchproprioModal');
      if(this.$currentsearch=='#resp'){
        this.addexecutionForm.controls['personnelle'].setValue(this.responsable.prenom+' '+this.responsable.nom);
        this.addexecutionForm.controls['personnelle1'].setValue(this.responsable.id);
        this.addexecutionForm.controls['coordonnee'].setValue('');
        this.addexecutionForm.controls['coordonnee1'].setValue('');
      }
      if(this.$currentsearch=='#nouveau'){
        this.addexecutionForm.controls['coordonnee'].setValue(this.responsable.libelle);
        this.addexecutionForm.controls['coordonnee1'].setValue(this.responsable.id);
        this.addexecutionForm.controls['personnelle'].setValue('');
        this.addexecutionForm.controls['personnelle1'].setValue('');
      }
  }
  resetsearch(){
    this.membres=undefined;
    this.afficheresultsearch=undefined;
    $(this.$currentsearch).val('');
    this.responsable=undefined;
    this.initAddsearchForm();
    this.informe.closeModal('#searchproprioModal');
    this.statutsearch=false;
    if(this.$currentsearch=='#resp'){
      this.addexecutionForm.controls['personnelle'].setValue('');
      this.addexecutionForm.controls['personnelle1'].setValue('');
    }
    if(this.$currentsearch=='#nouveau'){
      this.addexecutionForm.controls['coordonnee'].setValue('');
      this.addexecutionForm.controls['coordonnee1'].setValue('');
    }

  }
  showsearch($data){
    this.initAddsearchForm();
    this.$currentsearch=$data;
    this.informe.openModal('#searchproprioModal');
  }
  

}
