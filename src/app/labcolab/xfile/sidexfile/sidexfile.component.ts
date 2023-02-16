import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { NotificationService } from 'src/app/shared';
import { AppTitleService } from 'src/app/shared/services';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-sidexfile',
  templateUrl: './sidexfile.component.html',
  styleUrls: ['./sidexfile.component.scss']
})
export class SidexfileComponent implements OnInit {

  urlpostmodel='extendfilab';
  public addmodelForm: any=FormGroup;
  model:any;
  loarding:boolean=false; 
  detailmodel:any;
  idmodel:any;
  afficheupdate:any;
  searchmodel = '';
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
  detailfichlab;
  affichedetail;
  affichepropriete;
  currenttab;
  urlgetobs="obsfilabby";
  urlpostobs="obsfilab";
  urlgetcol="colabfilabby";
  urlpostcol="colabfilab";
  urlpostcomment='comfilelab';
  urlgetcomment='comlabyfile';
  vue='ok';

  constructor(private formBuilder: FormBuilder,public crud:CrudService,
    public notification:NotificationService,public informe:InformeService,public title:AppTitleService)
    { 
      this.title.setTitle('Espace Fichier');
    }

  ngOnInit(): void { 
    this.getfichlab(this.urlpost);
    this.ckeConfig=this.crud.getckconfig();
    this.ckeConfig.language = 'fr';
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
    editor.enableReadOnlyMode( 'my-feature-id' );
  }


    //Initial add services form
    initaddmodelForm($data) {
      this.addmodelForm = this.formBuilder.group({ 
        nom : ['',Validators.required],
        contenu : [$data.contenu,Validators.required]
      });
    }

    switchtab($name,$propriete?){
      this.affichepropriete=undefined;
      this.currenttab=$name;
      if($propriete){
        this.affichepropriete='ok';
      }
    }
    getmodel($id){
      this.loarding=false;
      this.model=undefined;
      this.searchmodel = '';
      this.crud.get('filevalid/'+$id).subscribe((data:any)=>{
        this.model=data;
        if(this.model[0]){
          this.loarding=true;
        }
      });
    }

 

  resetmodel(){
    this.afficheupdate=undefined;
    this.detailmodel=undefined;
  }

  getIdmodel(item:any,$name:any,$i?:any){
    this.detailmodel=item;
    this.idmodel=item.id;
    this.initaddmodelForm(this.detailmodel);
    if(this.detailmodel){
       if($name=='detail'){
        this.afficheupdate='ok';
        this.switchtab('detail');
       } 
    }
   
  }
}
