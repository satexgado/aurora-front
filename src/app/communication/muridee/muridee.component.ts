import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { CrudService } from 'src/app/dashboard/shareddash/services/crud.service';
import { NotificationService } from 'src/app/shared';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-muridee',
  templateUrl: './muridee.component.html',
  styleUrls: ['./muridee.component.scss']
})
export class MurideeComponent implements OnInit {

  urlpost='commentmuridee';
  urlget='commentbymuridee';
  url='muridee';
  urlshared='sharedmuridee';
  muridee:any;
  data:boolean=false;
  loardstatut: boolean = false;
  updatestatut:boolean=false;
  del:boolean=false;
  public AddanonymatmurideeForm:any= FormGroup;
  public modifmurideeForm:any= FormGroup;
  afficheupdate:any;
  idmuridee:any;
  detailmuridee:any;
  p1:number=1;
  affichecommuridee:any;
  affichedetail:any;
  anonymat=['Oui','Non'];
  searchmurideeText = '';
  loardlike:boolean=false;
  public Editor = ClassicEditor;
  constructor(private formBuilder: FormBuilder, public service: InformeService,public notifyservice:NotificationService,public crud:CrudService){ }

  ngOnInit(): void {
    this.getmuridee(this.url);
    this.initAddanonymatmurideeForm();
  }
  getmuridee($url:any){
    this.muridee=undefined;
    this.data=false;
    this.searchmurideeText = '';
    this.service.emitSubject($url);
    this.service._Subject$.subscribe(
      (data: any) => {
        this.muridee = data;
        if(this.muridee[0]){
          this.data=true;
        }
    });
  }

    //Initial add Registre form
  initAddanonymatmurideeForm() {
    this.AddanonymatmurideeForm = this.formBuilder.group({
      libelle: ['',Validators.required],
      anonymat: ['',Validators.required],
      description: ['', Validators.required]
    });
  }
  addmuridee(){
      this.loardstatut = true;
      this.service.add3(this.url,this.AddanonymatmurideeForm.value);
      this.service._Subject$.subscribe(()=>{
        this.resetmuridee();
      });
  }
  resetmuridee(){
    this.initAddanonymatmurideeForm();
    this.service.closeModal('#anonymatmurideeModal');
    this.service.closeModal('#updatemurideeModal');
    this.afficheupdate=undefined;
    this.updatestatut=false;
    this.loardstatut = false;
    this.affichecommuridee=undefined;
    this.affichedetail=undefined;
  }
  getId(item:any,$name:any,index?:any){
    this.detailmuridee=item;
    this.idmuridee=item.id;
    this.resetmuridee();
    if(this.detailmuridee){
       if($name=='update'){
         this.modifQForm(this.detailmuridee);
         this.afficheupdate='ok';
         this.service.openModal('#updatemurideeModal');
       }
       if($name=='detail'){
          this.affichedetail='okk';
          this.affichecommuridee=undefined;
       }
       if($name=='comment'){
        this.affichecommuridee='ok';
        this.affichedetail=undefined;
       }
       if($name=='shared'){
        this.service.openModal('#addModalresaffect');
       }
       if($name=='delete'){
        this.service.openModal('#deleteModal');
       }
       if($name=='like'){
        this.loardlike=true;
        var currentdata:any;
        const fd={'mur_idee':this.idmuridee};
        this.crud.post('/likemuridee',fd).subscribe(
          (data)=>{
              this.loardlike=false;
              currentdata=data;
              if(currentdata.value=='SUCCESS'){
                this.service.shownotifier('SUCCESS');
                this.muridee[index].likes.push(currentdata.data);
              }
              if(currentdata.value=='ERROR'){
                this.notifyservice.onError('Vous avez déjà aimé');
              }
          },
          (error)=>{
           this.loardlike=false;
           this.service.shownotifier('ERROR');
          }
        )
     }
    }

  }

  modifQForm(data:any) {
      this.modifmurideeForm = this.formBuilder.group({
        libelle: [data.libelle,Validators.required],
        anonymat: [data.anonymat,Validators.required],
        description: [data.description,Validators.required]
     });
  }

  updateValuemuridee(){
    this.updatestatut=true;
    if(this.modifmurideeForm.valid){
      this.service.update(this.url+'/',this.modifmurideeForm.value,this.idmuridee,this.url);
      this.service._Subject$.subscribe(()=>{
        this.resetmuridee();
      });
    }
  }



}
