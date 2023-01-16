import { NotificationService } from 'src/app/shared';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CrudService } from '../services/crud.service';
import { InformeService } from '../services/informe.service';

@Component({
  selector: 'app-partage',
  templateUrl: './partage.component.html',
  styleUrls: ['./partage.component.css']
})
export class PartageComponent implements OnInit {
  @Input() id:any;
  @Input() url:any;
  @Input() url2:any;
  public addaffectresForm:any= FormGroup;
  statut: boolean=false;
  statutsearch:boolean=false;
  data:boolean=false;
  valueequipe:any=[];
  membres:any;
  afficheresultsearch:any;
  urlImg=environment.apiUrl;

  constructor(private formBuilder: FormBuilder,public informe: InformeService,public notify:NotificationService,public crud:CrudService) { }

  ngOnInit() {
    this.initAddaffectressForm();
  }
  //Initial add affectress form
  initAddaffectressForm() {
    this.addaffectresForm = this.formBuilder.group({
      membres: ['']
    });


  }
  getMembre($tel:any){
      this.statutsearch=true;
      this.crud.get('/getAlluserLikename/'+$tel).subscribe((data)=>{
        this.membres=data;
        if(this.membres.length>0){
          this.afficheresultsearch='ok';
          this.statutsearch=false;
        }
        else{
          this.notify.onError('Personne non trouvée');
          this.statutsearch=false;
        }
      })

  }
  addValue($val:any){
      var val='';
      this.afficheresultsearch=undefined;
      if(this.valueequipe[0]){
        for(let item of this.valueequipe){
          if(item.id==$val.id){
            val='okk';
          }
        }
        if(val!='okk'){
         this.valueequipe.unshift($val);
        }
      }
      if(!this.valueequipe[0]){
        this.valueequipe.unshift($val);
      }
  }
   //Function to add data to service form
   add(){
    if(this.valueequipe[0]){
      this.statut=true;
      var value=[];
      for(let item of this.valueequipe){
        value.push(item.id);
      }
      const affectressForm=this.addaffectresForm.value;
      affectressForm.value=this.id;
      affectressForm.receveur=value;
      if(this.url2){
        this.informe.add(this.url,affectressForm,this.url2);
        this.informe._Subject$.subscribe(()=>{
          this.statut=false;
          this.informe.closeModal('#addModalresaffect');
          this.initAddaffectressForm();
          this.reset();
        });
      }
      if(!this.url2){
        this.informe.addVal2(this.url,affectressForm);
        this.informe._Subjectval2$.subscribe(()=>{
          this.statut=false;
          this.informe.closeModal('#addModalresaffect');
          this.initAddaffectressForm();
          this.reset();
        });
      }
    }

   }
   reset(){
    this.initAddaffectressForm();
    this.valueequipe=[];
    this.membres=undefined;
    this.informe.closeModal('#addModalresaffect');
    this.statut=false;
  }

}
