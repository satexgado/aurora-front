import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-basecolobs',
  templateUrl: './basecolobs.component.html',
  styleUrls: ['./basecolobs.component.scss']
})
export class BasecolobsComponent implements OnInit {
  @Input() id:any;
  @Input() urlpost:any;
  @Input() urlget:any;
  @Input() vue:any;
  @Input('urlget') set myurlget(urlget:any){
    this.urlget=urlget;
  }
  @Input('id') set myid(id:any){
    this.id=id;
    this.getcolab(this.id);
  }
  @Input('urlpost') set myurlpost(urlpost:any){
    this.urlpost=urlpost;
  }
  @Input('vue') set myvue(vue:any){
    this.vue=vue;
  }
  public addaffectresForm:any= FormGroup;
  statut: boolean=false;
  statutsearch:boolean=false;
  loadcolab:boolean=false;
  colab;
  valueequipe:any=[];
  membres:any;
  afficheresultsearch:any;
  indexdelete;
  typeparticipant=['Observateur','Collaborateur'];
  filterparticip;

  constructor(private formBuilder: FormBuilder,public informe: InformeService,public notify:NotificationService,public crud:CrudService) { }

  ngOnInit() {
    this.initAddaffectressForm();
  }
  //Initial add affectress form
  initAddaffectressForm() {
    this.addaffectresForm = this.formBuilder.group({
      membres: [''],
      type:['',Validators.required]
    });

  }
  getcolab($id){
    this.loadcolab=false;
    this.colab=undefined;
    this.crud.get(this.urlget+'/'+$id).subscribe((data)=>{
      this.colab=data;
      if(this.colab[0]){
        this.loadcolab=true;
        this.myfilterparticip();
      }
    })
  }
  myfilterparticip(){
    this.filterparticip=[];
    if(this.colab[0]){
      for(const[i,item] of this.typeparticipant.entries()){
        var curentvalue=this.colab.filter(word => word.type==item);
        this.filterparticip.push({'value':curentvalue});
      }
    }
  }
  getMembre($tel:any){
      this.statutsearch=true;
      this.crud.get('myuserby/'+$tel).subscribe((data)=>{
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
      this.initAddaffectressForm();
  }
  removeMember(i:any) {
    this.valueequipe.splice(i, 1);
  }
   //Function to add data to service form
   addmember(){
    if(this.valueequipe[0]){
      this.statut=true;
      var value:any=[];
      for(let item of this.valueequipe){
        value.push(item.id);
      }
      const affectressForm=this.addaffectresForm.value;
      affectressForm.value=this.id;
      affectressForm.participant=value;
      this.crud.post(this.urlpost,affectressForm).subscribe(
        (data)=>{
        this.statut=false;
        this.colab=data;
        this.myfilterparticip();
        this.loadcolab=true;
        this.informe.closeModal('#addMembre');
        this.informe.shownotifier('SUCCESS');
        this.initAddaffectressForm();
        this.resetmember();
        },
        (error)=>{
          this.statut=false;
          this.notify.onError("Nous n'avons pas pu effectuer cette opération. Veuillez essayer de nouveau");
        }
      );
    }

   }
   resetmember(){
    this.initAddaffectressForm();
    this.valueequipe=[];
    this.membres=undefined;
    this.informe.closeModal('#addMembre');
    this.statut=false;
  }
  showdelete($id:any){
    for(const[i,item] of this.colab.entries()){
      if(item.id==$id){
        this.indexdelete=i;
      }
    }
    this.informe.openModal('#deletebaseModal');
  }
  deletebase() {
    this.statut=true;
    this.crud.delete(this.urlpost+'/',this.colab[this.indexdelete].id).subscribe({
      next:(data) => {
        this.informe.shownotifier('SUCCESS');
        this.colab.splice(this.indexdelete, 1);
        this.myfilterparticip();
        this.statut=false;          
        this.informe.closeModal('#deletebaseModal');
       },
       error: (err) =>{
        this.notify.onError("Impossible d'effectuer la suppression. d'autres éléments sont associés à cet élément");
        this.informe.closeModal('#deletebaseModal');
        this.statut=false;
      }
    }
    );
   
  }

}
