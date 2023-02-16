import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppTitleService } from 'src/app/shared/services';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-vuekanban',
  templateUrl: './vuekanban.component.html',
  styleUrls: ['./vuekanban.component.scss']
})
export class VuekanbanComponent implements OnInit {

  fichlab:any;
  currentfichier;
  colabfile;
  public addextendForm: any=FormGroup;
  urlpost='intvfile';
  public Editor = ClassicEditor;
  affichecontenu;
  ckeConfig;
  // statutextend=['Lecture','Correction','Approbation','Validation'];
  statutextend=['Lecture','Correction','Approbation'];
  affichedetail;
  statut:boolean=false;
  statfile=['En cours','Validé','À revoir','Brouillon'];
  afficheinterv;
  currentextend;
  indexcolab;
  currentparticipant;
  listvalue;
  img='taches_ether.svg';
  text1="Aucune donnée disponible";
  text2="Vos actions s'afficheront ici";
  loardfile:boolean=false;
  afficheelement;
  searchfichlab = '';
  search;
  constructor(private formBuilder: FormBuilder,public crud:CrudService,public route:ActivatedRoute, public title:AppTitleService,
    public informe:InformeService)
    { 
      this.title.setTitle('Vue Kanban');
    }

  ngOnInit(): void {
    this.ckeConfig=this.crud.getckconfig();
    this.getfile();
  }
  showsearch($search){
    if($search){
      this.search='ok';
    }
    if(!$search){
      this.searchfichlab='';
      this.search=undefined;
    }
  }
  getfile(){
    this.fichlab=undefined;
    this.afficheelement=undefined;
    this.loardfile=false;
    this.crud.get('filekan').subscribe((data)=>{
      this.fichlab=data;
      if(this.fichlab[0]){
        this.loardfile=true;
      }
    })
  }
  showcurrentfil($event){
     this.colabfile=undefined;
     this.crud.get('kanbyfile/'+$event).subscribe((data)=>{
       this.colabfile=data;
       this.elementvalue();
     });
  }
      //Initial add services form
  initaddextendForm($val) {
    this.addextendForm = this.formBuilder.group({ 
      contenu : [$val,Validators.required],
      statut : [this.statutextend[0],Validators.required]
    });
  }
  showdetail($id,$name?){
    this.currentfichier=this.fichlab[$id];
    this.showcurrentfil(this.currentfichier.id);
    this.afficheelement='ok';
    if($name){
      this.affichedetail='ok';
      this.afficheelement=undefined;
    }
    if(!$name){
      this.afficheelement='ok';
      this.affichedetail=undefined;
    }
    this.initaddextendForm(this.currentfichier.contenu);
  }
  showinterv($val){
    this.affichedetail='ok';
    this.afficheinterv='ok';
    this.indexcolab=$val;
    this.currentextend=this.listvalue[$val]; 
    this.currentparticipant=this.currentextend.all[0];
    this.initaddextendForm(this.currentextend.element[0].contenu);
  }
 
  resetValue(){
    this.statut=false;
    this.affichedetail=undefined;
    this.afficheinterv=undefined;
    this.currentextend=undefined;
    this.indexcolab=undefined;
    this.currentfichier=undefined;
    this.resetcurrentpart();
  }
  currentpart($event){
    this.currentparticipant=$event;
    this.initaddextendForm(this.currentparticipant.contenu);
  }
  resetcurrentpart(){
    this.currentparticipant=undefined;
  }
  public onReady( editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
    if(!this.afficheinterv){
      editor.disableReadOnlyMode( 'my-feature-id' );
    }
    if(this.afficheinterv){
      editor.enableReadOnlyMode( 'my-feature-id' );
    }
  }
  addexect($val){
    this.statut=true;
    const formValue=this.addextendForm.value;
    formValue.fichier=this.currentfichier.id;
    formValue.statut=$val;
    this.crud.post(this.urlpost,formValue).subscribe({
      next:(data)=>{
        this.informe.shownotifier('SUCCESS');
        this.colabfile.unshift(data);
        for(const[i,item] of this.statutextend.entries()){
           if(this.colabfile[0].statut==item){
            this.listvalue[i].all.push(this.colabfile[0]);
            if(this.listvalue[i].element.length!=0){
              this.listvalue[i].enfants.push(this.colabfile[0]);
            }
            if(this.listvalue[i].element.length==0){
              this.listvalue[i].element.push(this.colabfile[0]);
            }
           }
        }
        this.resetValue();
      },
      error:(error)=>{
        this.statut=false;
        this.informe.shownotifier('ERROR');
      }
    });  
  }
  elementvalue(){
    this.listvalue=[];
    for(const[i,el] of this.statutextend.entries()){
      this.listvalue.push({'name':el,'element':[],'enfants':[],'all':[],'class1':'ok','class2':'ok','class3':'ok','class4':'ok'});
      if(i==0){
        this.listvalue[i].class1='card-body bg-soft-primary p-2';
        this.listvalue[i].class2='card card-accent-primary  mg-15';
      }
      if(i==1){
        this.listvalue[i].class1='card-body bg-soft-danger p-2';
        this.listvalue[i].class2='card card-accent-danger mg-15';
      }
      if(i==2){
        this.listvalue[i].class1='card-body bg-soft-warning p-2';
        this.listvalue[i].class2='card card-accent-warning mg-15';
      }
    } 
    if(this.colabfile[0]){
      for(const[i,el] of this.statutextend.entries()){
        for(const[it,val]  of this.colabfile.entries()){
          if(val.statut==el){
            this.listvalue[i].all.push(val);
            if(this.listvalue[i].element.length!=0){
              this.listvalue[i].enfants.push(val);
            }
            if(this.listvalue[i].element.length==0){
              this.listvalue[i].element.push(val);
            }
          }
        }
      }
    }
  }
}
