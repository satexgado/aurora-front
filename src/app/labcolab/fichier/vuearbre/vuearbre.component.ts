import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { AppTitleService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { InformeService } from 'src/app/shareddash/services/informe.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-vuearbre',
  templateUrl: './vuearbre.component.html',
  styleUrls: ['./vuearbre.component.scss']
})
export class VuearbreComponent implements OnInit {
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
  affichefinal;
  img='taches_ether.svg';
  text1="Aucune donnée disponible";
  constructor(private formBuilder: FormBuilder,public crud:CrudService,public route:ActivatedRoute, public title:AppTitleService,
    public notification:NotificationService,public informe:InformeService)
    { 
      this.title.setTitle('Vue en Arbre');
    }

  ngOnInit(): void {
    this.ckeConfig=this.crud.getckconfig();
    this.route.params.subscribe((data:any)=>{
      this.showcurrentfil(data['id']);
    });
  }
  showcurrentfil($event){
     this.currentfichier=undefined;
     this.colabfile=undefined;
     this.fichlab=undefined;
     this.crud.get('intvbyfile/'+$event).subscribe((data)=>{
       this.fichlab=data;
       this.colabfile=this.fichlab.intervenant;
       if(this.fichlab.file[0]){
        this.currentfichier=this.fichlab.file[0];
       }
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
  showdetail(){
    this.affichedetail='ok';
    if(this.currentfichier.statut!=this.statfile[1]){
      this.affichefinal=undefined;
    }
    else{
      this.affichefinal='ok';
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
    this.informe.closeModal('#fichlabModal');
    this.affichedetail=undefined;
    this.afficheinterv=undefined;
    this.currentextend=undefined;
    this.indexcolab=undefined;
    this.affichefinal=undefined;
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
    if(this.afficheinterv || this.affichefinal){
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
        this.listvalue[i].class1='media pd-b-20 pd-r-50 pointers';
        this.listvalue[i].class2='activity-icon bg-echolight8';
        this.listvalue[i].class3='fad fa-book-open tx-18 tx-primary';
        this.listvalue[i].class4='card ml-3 flex-1  bg-soft-primary';
      }
      if(i==1){
        this.listvalue[i].class1='media pd-b-20 pd-r-50 pointers';
        this.listvalue[i].class2='activity-icon bg-echolight7';
        this.listvalue[i].class3='fad fa-edit tx-18 tx-danger';
        this.listvalue[i].class4='card ml-3 flex-1 bg-soft-danger';
      }
      if(i==2){
        this.listvalue[i].class1='media pd-b-20 pointers';
        this.listvalue[i].class2='activity-icon bg-echolight11';
        this.listvalue[i].class3='fad fa-comment-alt-check tx-18 tx-warning';
        this.listvalue[i].class4='card ml-3 flex-1 bg-soft-warning';
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
