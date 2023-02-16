import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared';
import { ItemSelectHelper } from 'src/app/shared/state';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';
declare var $;

@Component({
  selector: 'app-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.scss']
})
export class ExecutionComponent implements OnInit {
  urlpostexec='execticket';
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
  moyen=['Telephone','Email','Adresse physique','Autres outils'];
  confirmation=['Oui','Non'];
  statutsuivi=['En attente','Exécuté','Reporté','Non exécuté'];
  statuttrait=['Atteint', 'Non atteint', 'À suivre', 'En cours de traitement', 'Objet non trouvé', 'Renvoie du courrier'];
  // affichedetail:any;
  affichenew;
  affichepasser;
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
      for(const[i,item] of this.statutsuivi.entries()){
        var curentvalue=this.execution.filter(word => word.statut_suivi==item);
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
        heure : ['',Validators.required],
        date : ['',Validators.required],
        moyen : ['',Validators.required],
        date_ouverture : [''],
        entite_contact : ['',Validators.required],
        entite_contact1 : [''],
        confirmation : ['',Validators.required],
        nouv_contact : [''],
        nouv_contact1 : [''],
        ordonnance : ['',Validators.required],
        statut_suivi : ['',Validators.required],
        statut_traitement : ['',Validators.required],
        duree : ['',Validators.required],
        passer_main : ['',Validators.required],
        nouv_resp : [''],
        nouv_resp1 : ['']
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
      this.crud.get('byticket/'+$id).subscribe((data:any)=>{
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
      this.statut=true;
      const formValue=this.addexecutionForm.value;
      formValue.entite_contact=formValue.entite_contact1;
      formValue.nouv_contact=formValue.nouv_contact1;
      formValue.nouv_resp=formValue.nouv_resp1;
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
  resetexec(){
    this.statut=false;
    this.informe.closeModal('#executionModal');
    this.informe.closeModal('#editexecutionModal');
    this.informe.closeModal('#detailexecutionModal');
    this.initaddexecutionForm();
    this.afficheupdate=undefined;
    this.affichenew=undefined;
    this.affichepasser=undefined;
    // this.affichedetail=undefined;
  }
  modifFormexec(data:any) { 
    this.updateexecutionForm = this.formBuilder.group({
      nom : [data.nom,Validators.required],
      type : [data.type,Validators.required],
      adresse : [data.adresse],
      email : [data.email],
      telephone : [data.telephone]
    });

  }
  
  getIdexec(item:any,$name:any,$i?:any){
    this.detailexecution=item;
    this.idexecution=item.id;
    this.value=$i; 
    if(this.detailexecution){
       if($name=='update'){
          this.modifFormexec(this.detailexecution);
          this.afficheupdate='ok';
          this.informe.openModal('#editexecutionModal'); 
       }
       if($name=='delete'){
        this.informe.openModal('#deleteexecutionModal');
       }
       if($name=='detail'){
        this.informe.openModal('#detailexecutionModal');
        this.currentexect=undefined;
        this.crud.get('byexwithsuiv/'+this.idexecution).subscribe((data)=>{
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
    if($name=='date'){
      var $val=this.informe.compareDate($form.value.date,new Date());
      if($val=='NEGATIF'){
        this.notification.onError('Erreur au niveau de la date');
        $form.controls['date'].setValue('');
      }
    }
    if($name=='date_ouverture'){
      var $val=this.informe.compareDate($form.value.date_ouverture,new Date());
      if($val=='NEGATIF'){
        this.notification.onError('Erreur au niveau de la date');
        $form.controls['date_ouverture'].setValue('');
      }
    }
  }
  listenconfirmation($name,$event){
   if($name=='new'){
    if($event==this.confirmation[0]){
      this.affichenew=undefined;
    }
    if($event==this.confirmation[1]){
      this.affichenew='ok';
    }
   }
   if($name=='passer'){
    if($event==this.confirmation[0]){
      this.affichepasser='ok';
    }
    if($event==this.confirmation[1]){
      this.affichepasser=undefined;
    }
   }
  }
  getMembre($tel){
    this.statutsearch=true;
    this.crud.get('myuserby/'+$tel).subscribe((data)=>{
        this.membres=data;
        if(this.membres.length>0){
          this.afficheresultsearch='ok';
          this.statutsearch=false;
        }
        else{
          this.notification.onError("Personne non trouvée");
          this.statutsearch=false;
        }
    })
  }
    
  addValue($val){
      this.responsable=$val;
      this.afficheresultsearch=undefined; 
      $(this.$currentsearch).val(this.responsable.prenom+' '+this.responsable.nom);
      this.informe.closeModal('#searchproprioModal');
      if(this.$currentsearch=='#resp'){
        this.addexecutionForm.controls['entite_contact'].setValue(this.responsable.prenom+' '+this.responsable.nom);
        this.addexecutionForm.controls['entite_contact1'].setValue(this.responsable.id);
      }
      if(this.$currentsearch=='#nouveau'){
        this.addexecutionForm.controls['nouv_contact1'].setValue(this.responsable.id);
      }
      if(this.$currentsearch=='#nouv_resp'){
        this.addexecutionForm.controls['nouv_resp1'].setValue(this.responsable.id);
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
      this.addexecutionForm.controls['entite_contact'].setValue('');
    }
    if(this.$currentsearch=='#nouveau'){
      this.addexecutionForm.controls['nouv_contact'].setValue('');
    }
    if(this.$currentsearch=='#nouv_resp'){
      this.addexecutionForm.controls['nouv_resp'].setValue('');
    }

  }
  showsearch($data){
    this.initAddsearchForm();
    this.$currentsearch=$data;
    this.informe.openModal('#searchproprioModal');
  }

   
}
