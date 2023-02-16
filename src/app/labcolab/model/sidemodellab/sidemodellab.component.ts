import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { NotificationService } from 'src/app/shared';
import { AppTitleService } from 'src/app/shared/services';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-sidemodellab',
  templateUrl: './sidemodellab.component.html',
  styleUrls: ['./sidemodellab.component.scss']
})
export class SidemodellabComponent implements OnInit {

  urlpostmodel='extendfilab';
  public addmodelForm: any=FormGroup;
  statut: boolean=false;
  model:any;
  loarding:boolean=false; 
  detailmodel:any;
  idmodel:any;
  afficheupdate:any;
  del:boolean=false;;
  updatestatut:boolean=false;
  public updatemodelForm:any=FormGroup;
  p:number=1;
  searchmodel = '';
  value:any;
  affichelist;
  affichecard;
  id:any;
  public Editor = ClassicEditor;
  img='taches_ether.svg';
  text1="Vos actions s'afficheront ici";
  text2="Aucune donnée disponible";
  ckeConfig;
  fichlab;
  searchfichlab;
  urlpost='fichlabmodel';
  loadlab:boolean=false;
  affichecontenu;
  detailfichlab;
  affichedetail;

  constructor(private formBuilder: FormBuilder,public crud:CrudService,
    public notification:NotificationService,public informe:InformeService,public title:AppTitleService)
    { 
      this.title.setTitle('Modèle');
    }

  ngOnInit(): void { 
    this.getfichlab(this.urlpost);
    this.ckeConfig=this.crud.getckconfig();
    this.showvu('card');
  }

  getfichlab(url:any){
    this.loadlab=false;
    this.fichlab=undefined;
    this.searchfichlab = '';
    this.crud.get(url).subscribe((data:any)=>{
      this.fichlab=data;
      if(this.fichlab[0]){
        this.loadlab=true;
      }
    });
  }
  showdetail($item){
    this.detailfichlab=$item;
    this.affichedetail='ok';
    this.showvu('card');
    this.getmodel(this.detailfichlab.id);
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


    //Initial add services form
    initaddmodelForm($data) {
      this.addmodelForm = this.formBuilder.group({ 
        nom : ['',Validators.required],
        contenu : [$data.contenu,Validators.required]
      });
    }


    getmodel($id){
      this.loarding=false;
      this.model=undefined;
      this.searchmodel = '';
      this.crud.get('filemodel/'+$id).subscribe((data:any)=>{
        this.model=data;
        if(this.model[0]){
          this.loarding=true;
        }
      });
    }

 
    //Function to add data to service form
  addmodelt(){
    this.statut=true;
    const formValue=this.addmodelForm.value;
    formValue.statut='modele';
    formValue.definir_modele='Oui';
    formValue.modele=this.detailmodel.modele;
    // formValue.modele=this.idmodel;
    this.crud.post(this.urlpostmodel,formValue).subscribe({
      next:(data)=>{
        this.model.unshift(data);
        this.loarding=true;
        this.notification.onSuccess("Opération effectuée avec succés");
        this.resetmodel();
      },
      error:(error)=>{
        this.statut=false;
        this.notification.onError("Nous n'avons pas pu effectuer cette opération. Veuillez essayer de nouveau");
      }
    });  
  }
  resetmodel(){
    this.statut=false;
    this.affichecontenu=undefined;
    this.afficheupdate=undefined;
    this.detailmodel=undefined;
  }

  getIdmodel(item:any,$name:any,$i?:any){
    this.detailmodel=item;
    this.idmodel=item.id;
    this.value=$i; 
    this.initaddmodelForm(this.detailmodel);
    if(this.detailmodel){
       if($name=='detail'){
        this.afficheupdate='ok';
       } 
    }
   
  }
}
