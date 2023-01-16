import { InformeService } from 'src/app/shareddash/services/informe.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-tableauobjectif',
  templateUrl: './tableauobjectif.component.html',
  styleUrls: ['./tableauobjectif.component.scss']
})
export class TableauobjectifComponent implements OnInit {

  urlpost='commenttabobj';
  urlget='commentbytabobj';
  url='tabobjectif';
  urlshared='sharedtabobj';
  tabobjectif:any;
  data:boolean=false;
  loardstatut: boolean = false;
  updatestatut:boolean=false;
  del:boolean=false;
  public AddobjettabobjectifForm:any= FormGroup;
  public modiftabobjectifForm:any= FormGroup;
  afficheupdate:any;
  idtabobjectif:any;
  detailtabobjectif:any;
  p1:number=1;
  affichecomtabobj:any;
  affichedetail:any;
  objet=[{'color':'bg-primary','value':'Objectifs Généraux'},{'color':'bg-danger','value':'Objectifs par Services'},{'color':'bg-success','value':'Objectifs par Fonctions'}];
  currentobjet:any;
  searchtabobjText = '';
  color:any;
  public Editor = ClassicEditor;


  constructor(private formBuilder: FormBuilder, public service: InformeService){ }

  ngOnInit(): void {
    this.gettabobj(this.url);
    this.initAddobjettabobjectifForm();
  }
  gettabobj($url:any,$objet?:any){
    this.tabobjectif=undefined;
    this.data=false;
    this.currentobjet=undefined;
    this.idtabobjectif=undefined;
    this.searchtabobjText = '';
    this.resettabobj();
    if($objet){
      this.currentobjet=$objet;
    }
    this.service.emitSubject($url);
    this.service._Subject$.subscribe(
      (data: any) => {
        this.tabobjectif = data;
        if(this.tabobjectif[0]){
          this.data=true;
        }
    });
  }

    //Initial add Registre form
  initAddobjettabobjectifForm() {
    this.AddobjettabobjectifForm = this.formBuilder.group({
      libelle: ['',Validators.required],
      objet: ['',Validators.required],
      description: ['', Validators.required]
    });
  }
  addtabobj(){
      this.loardstatut = true;
      this.AddobjettabobjectifForm.value.couleur = this.color;
      this.service.add3(this.url,this.AddobjettabobjectifForm.value);
      this.service._Subject$.subscribe(()=>{
        this.resettabobj();
      });
  }
  resettabobj(){
    this.initAddobjettabobjectifForm();
    this.service.closeModal('#objettabobjectifModal');
    this.service.closeModal('#updatetabobjectifModal');
    this.afficheupdate=undefined;
    this.updatestatut=false;
    this.loardstatut = false;
    this.affichecomtabobj=undefined;
    this.affichedetail=undefined;
    this.color=undefined;
  }
  getId(item:any,$name:any,index?:any){
    this.detailtabobjectif=item;
    this.idtabobjectif=item.id;
    this.resettabobj();
    if(this.detailtabobjectif){
       if($name=='update'){
         this.modifQForm(this.detailtabobjectif);
         this.afficheupdate='ok';
         this.service.openModal('#updatetabobjectifModal');
       }
       if($name=='detail'){
          this.affichedetail='okk';
          this.affichecomtabobj=undefined;
       }
       if($name=='comment'){
        this.affichecomtabobj='ok';
        this.affichedetail=undefined;
       }
       if($name=='shared'){
        this.service.openModal('#addModalresaffect');
       }
       if($name=='delete'){
        this.service.openModal('#deleteModal');
        this.currentobjet=undefined;
       }
    }

  }

  modifQForm(data:any) {
      this.modiftabobjectifForm = this.formBuilder.group({
        libelle: [data.libelle,Validators.required],
        objet: [data.objet,Validators.required],
        description: [data.description,Validators.required]
     });
     this.color=data.couleur;
  }

  updateValuetabobj(){
    this.updatestatut=true;
    if(this.modiftabobjectifForm.valid){
      this.modiftabobjectifForm.value.couleur = this.color;
      this.service.update(this.url+'/',this.modiftabobjectifForm.value,this.idtabobjectif,this.url);
      this.service._Subject$.subscribe(()=>{
        this.resettabobj();
      });
      this.currentobjet=undefined;
    }
  }
  getColor($val:any){
    return $val;
  }



}
