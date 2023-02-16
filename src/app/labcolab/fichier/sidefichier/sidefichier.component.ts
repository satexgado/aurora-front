import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared';
import { AppTitleService } from 'src/app/shared/services';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ItemSelectHelper } from 'src/app/shared/state';

@Component({
  selector: 'app-sidefichier',
  templateUrl: './sidefichier.component.html',
  styleUrls: ['./sidefichier.component.scss']
})
export class SidefichierComponent implements OnInit {

  
  urlpost='fichlabmodel';
  public addfichlabForm: any=FormGroup;
  public updatefichlabForm: any=FormGroup;
  statut: boolean=false;
  fichlab:any;
  loarding:boolean=false; 
  detailfichlab:any;
  idfichlab:any;
  searchfichlab = '';
  affichedetail:any;
  afficheecheance;
  img='taches_ether.svg';
  text1="Vos actions s'afficheront ici";
  //debut extend, normalement cette partie devait étre dans un autre component
  urlpostexec='extendfilab';
  public addextendForm: any=FormGroup;
  extend:any;
  loardingextend:boolean=false; 
  detailextend:any;
  idextend:any;
  afficheupdate:any;
  del:boolean=false;;
  updatestatut:boolean=false;
  public updateextendForm:any=FormGroup;
  p:number=1;
  searchextend = '';
  value:any;
  statutextend=['En cours','Validé','À revoir','Brouillon'];
  affichelist;
  affichecard;
  typeFilterSelectHelper = new ItemSelectHelper();
  id:any;
  public Editor = ClassicEditor;
  affichecontenu;
  urlgetobs="obsfilabby";
  urlpostobs="obsfilab";
  urlgetcol="colabfilabby";
  urlpostcol="colabfilab";
  urlpostcomment='comfilelab';
  urlgetcomment='comlabyfile';
  currenttab;
  affichepropriete;
  ckeConfig;

  //fin


  constructor(private formBuilder: FormBuilder,public crud:CrudService, public title:AppTitleService,
    public notification:NotificationService,public informe:InformeService,public router:Router)
    { 
      this.title.setTitle("X-File");
    }

  ngOnInit(): void {
    this.getfichlab(this.urlpost);
    this.initaddfichlabForm();
    this.initaddextendForm();
    this.ckeConfig=this.crud.getckconfig();
  }
 
    //Initial add services form
    initaddfichlabForm() {
      this.addfichlabForm = this.formBuilder.group({
        nom : ['',Validators.required],
        description : ['',Validators.required]
      });
    }

    getfichlab(url:any){
      this.loarding=false;
      this.fichlab=undefined;
      this.searchfichlab = '';
      this.crud.get(url).subscribe((data:any)=>{
        this.fichlab=data;
        if(this.fichlab[0]){
          this.loarding=true;
        }
      });
    }

  add(){
    this.statut=true;
    this.crud.post(this.urlpost,this.addfichlabForm.value).subscribe({
        next:(data)=>{
          this.fichlab.unshift(data);
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
    this.informe.closeModal('#fichlabModal');
    this.initaddfichlabForm();
    this.affichedetail=undefined;
  }
  showdetail($item){
    this.detailfichlab=$item;
    this.affichedetail='ok';
    this.getextend(this.detailfichlab.id);
    this.showvu('card');
    this.initaddextendForm();
  }
  //Partie extend
  switchtab($name,$propriete?){
    this.affichepropriete=undefined;
    this.currenttab=$name;
    if($propriete){
      this.affichepropriete='ok';
    }
  }
  showvu($name){
    this.affichecard=undefined;
    this.affichelist=undefined;
    if($name=='card'){
      this.affichecard='ok';
    }
    if($name=='list'){
      this.affichelist='ok';
    }
  }
  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

  clearDropdownFilter() {
    this.typeFilterSelectHelper.clearSelection();
  }


    //Initial add services form
    initaddextendForm() {
      this.addextendForm = this.formBuilder.group({ 
        nom : ['',Validators.required],
        definir_modele : ['Non'],
        statut : [this.statutextend[3],Validators.required]
      });
    }


    getextend($id:any){
      this.informe.closeModal('#detailextendModal');
      this.loardingextend=false;
      this.extend=undefined;
      this.searchextend = '';
      this.id=$id;
      this.crud.get('filabbymodel/'+$id).subscribe((data:any)=>{
        this.extend=data;
        if(this.extend[0]){
          this.loardingextend=true;
        }
      });
    }

 
    //Function to add data to service form
  addexect(){
    this.statut=true;
    const formValue=this.addextendForm.value;
    formValue.modele=this.id;
    this.crud.post(this.urlpostexec,formValue).subscribe({
      next:(data)=>{
        this.extend.unshift(data);
        this.loardingextend=true;
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
    this.informe.closeModal('#extendModal');
    this.informe.closeModal('#editextendModal');
    this.informe.closeModal('#detailextendModal');
    this.initaddextendForm();
    this.afficheupdate=undefined;
    this.affichecontenu=undefined;
  }

  
  getIdexec(item:any,$name:any,$i?:any){
    this.detailextend=item;
    this.idextend=item.id;
    this.value=$i; 
    if(this.detailextend){
       if($name=='update'){
          this.modifFormexec(this.detailextend);
          this.afficheupdate='ok';
          this.informe.openModal('#editextendModal'); 
       }
       if($name=='delete'){
        this.informe.openModal('#deleteextendModal');
       }
       if($name=='detail'){
        this.switchtab('detail');
        this.modifFormexec(this.detailextend);
        this.affichecontenu='ok';
       } 
    }
   
  }
  changestat($name,$val){
    if($name=='modele'){
      this.updateextendForm.value.definir_modele=$val;
    }
    if($name=='statut'){
      this.updateextendForm.value.statut=$val;
    }
    this.updateValueexec('ok');
  }
  modifFormexec($data){
    this.updateextendForm = this.formBuilder.group({ 
      nom : [$data.nom,Validators.required],
      contenu : [$data.contenu,Validators.required],
      statut : [$data.statut,Validators.required]
    });
  }

  deleteexec() {
    this.del=true;
    this.crud.delete(this.urlpostexec+'/',this.idextend).subscribe({
      next:(data) => {
        this.informe.shownotifier('SUCCESS');
        this.extend.splice(this.value, 1);
        this.del=false;          
        this.informe.closeModal('#deleteextendModal');
        this.affichecontenu=undefined;
       },
       error: (err) =>{
        this.notification.onError("Impossible d'effectuer la suppression. d'autres éléments sont associés à cet élément");
        this.informe.closeModal('#deleteextendModal');
        this.del=false;
      }
    }
    );
   
  }

  updateValueexec($name?){
    this.updatestatut=true;
    this.crud.put(this.urlpostexec+'/',this.updateextendForm.value,this.idextend).subscribe({
        next:(data) => {
          this.extend[this.value]=data;
          this.detailextend=data;
          this.informe.shownotifier('SUCCESS');
          this.updatestatut=false;
          if(!$name){
            this.resetexec();
          }
        },
        error:(error) =>{
          this.informe.shownotifier('ERROR');
          this.updatestatut=false;
        }
    });
  
  }
 


  //Fin
  

}
