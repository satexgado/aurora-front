import { NotificationService } from 'src/app/shared';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import * as frLocale from 'date-fns/locale/fr';
// import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class InformeService {
  _Subject$ = new Subject();
  _Subject2$ = new Subject();
  _Subject3$ = new Subject();
  _Subjectval1$ = new Subject();
  _Subjectval2$ = new Subject();
  private tab :any= [];
  private tab1=[];
  private tab2:any=[];
  tabValue:any;
  _tabValue$:any=new Subject();
  _tabValuesimple$:any=new Subject();



  constructor(public crud: CrudService, private http: HttpClient,public notifyservice:NotificationService) { }




    shownotifier($params:any){
      if($params=='SUCCESS'){
        this.notifyservice.onSuccess('Opération effectuée avec succès');
      }
      if($params=='ERROR'){
        this.notifyservice.onError('Nous n\'avons pas pu effectuer cette opération. Veuillez essayer de nouveau');
      }

    }

    //Informe Object to give a new data
    emitSubject(hote : string) {
      this.crud.get(hote).subscribe(
           (data: any) => {
             this.tab = data;
             this._Subject$.next(this.tab);

           }
         );

  }
  emitVal1(hote : string) {
    this.crud.get(hote).subscribe(
         (data: any) => {
           this.tab1 = data;
           this._Subjectval1$.next(this.tab1);
         }
       );

}
emitVal2(hote : string) {
  this.crud.get(hote).subscribe(
       (data: any) => {
         this.tab2 = data;
         this._Subjectval2$.next(this.tab2);
       }
     );

}


  //Close Modal from typescript
  closeModal(element: string ){

    $(element).modal('hide');

  }
  //Open Modal from typescript
  openModal(element: string){
    $(element).modal('toggle');
  }


  //Get Data(Tab)
  getTab (){
    return this.tab;
  }
  //When translate, we need to get Key


   //Method to add and informe we have a new Data if saving is succeed
    add(hote:string,formData : any, hote1:string) {

      this.crud.post(hote, formData).subscribe(
        (data) => {
                  // this.tab.push(data);
                  // this._Subject$.next(this.tab);
                  this.emitSubject(hote1);

                this.shownotifier('SUCCESS');

        },
        (error) =>{
           this.shownotifier('ERROR');

        }

      );

    }
    add2(hote:string,formData : any) {

      this.crud.post(hote, formData).subscribe(
        (data) => {
                  this.tab.push(data);
                  this._Subject3$.next(this.tab);
                 // this.emitSubject(hote1);
                 this.shownotifier('SUCCESS');
        },
        (error) =>{
           this.shownotifier('ERROR');
        }

      );

    }
    add3(hote:string,formData : any) {
      this.crud.post(hote, formData).subscribe(
        (data) => {
                  this.tab.unshift(data);
                  this._Subject$.next(this.tab);
                 // this.emitSubject(hote1);
                  this.shownotifier('SUCCESS');
        },
        (error) =>{
           this.shownotifier('ERROR');
        }
      );

    }

    addNoInforme(hote:string,formData : any) {

      this.crud.post(hote, formData).subscribe(
        (data) => {
             this.shownotifier('SUCCESS');
        },
        (error) =>{
           this.shownotifier('ERROR');

        }

      );

    }


    //Method to add ffile and informe we have a new Data if saving is succeed
    postfile(hote:string,formData : any,id:any , hote1:string) {

      this.crud.postfile(hote, formData, id).subscribe(
        (data) => {
                 // this.tab.push(data);
                //  this._Subject$.next(this.tab);
                  this.emitSubject(hote1);
                  this.shownotifier('SUCCESS');
        },
        (error) =>{
          this.shownotifier('ERROR');
        }

      );

    }
  //Method to update and informe we have a new Data if update is succeed
   update(hote: string, formData : any, id:any,hote1:string) {
     this.crud.put(hote , formData, id ).subscribe(
       (data: any) => {

         this.emitSubject(hote1);
         this.shownotifier('SUCCESS');

      },
       (error) =>{
            this.shownotifier('ERROR');
      });

   }
   //Update val 1
   updateVal1(hote: string, formData : any, id:any,hote1:string) {
    this.crud.put(hote , formData, id ).subscribe(
      (data: any) => {

        this.emitVal1(hote1);
        this.shownotifier('SUCCESS');

     },
      (error) =>{
           this.shownotifier('ERROR');
     });

  }

  //Method to add and informe we have a new Data who destroy if deleted is succeed
   delete(hote: string, $id:any, hote1:string) {

     this.crud.delete(hote,$id).subscribe(
       (data) => {

         this.emitSubject(hote1);
         this.shownotifier('SUCCESS');

  },
  (error) =>{
    this.closeModal('#deleteModal');
    // this.shownotifier('ERROR');b
    this.notifyservice.onError('Impossible d\'effectuer la suppression. d\'autres éléments sont associés à cet élément');

   });
   }


  //Calculer la difference entre deux heure
  CalculHours($valeurmax:any,$valeurmin:any){
    //temps matinee
    var s=""+$valeurmax+"";
    var hd=""+$valeurmin+"";
    var hdtest=hd.replace(":",",");
    var hdh=hdtest.substring(0,2);
    var hdm=hdtest.substring(3,5);
    var a =new Date();
    a.setHours(+hdh);
    a.setMinutes(+hdm);
    a.setSeconds(0);
    a.setMilliseconds(0);
    var test=s.replace(":",",");
    var hoursfintravail=test.substring(0,2);
    var minutefintravail=test.substring(3,5);
    var b =new Date();
    b.setHours(+hoursfintravail);
    b.setMinutes(+minutefintravail);
    b.setSeconds(0);
    b.setMilliseconds(0);
   // Number(hoursfintravail);
    //temps matiné
    var c =b.getTime() - a.getTime();
    //return c;
    if(c<0){
      this.notifyservice.onError('Erreur au niveau de l\'heure');
       return null;
    }
    else{
      return c;
    }


  }



    //Compare two date
    compareDate($dateprevuretour:any,$dateretour:any){
      //temps matinee
      var dateprevuretour= new Date($dateprevuretour).getTime();
      var dateretour=new Date($dateretour).getTime();
      var diff=dateretour-dateprevuretour;
      if(diff<0){

        return "POSITIF";

       }
       if(diff>0){
         return "NEGATIF"
       }
       else{
         return "EGAL"
       }


    }
    addVal2(hote:string,formData : any) {
      this.crud.post(hote, formData).subscribe(
        (data) => {
                  this.tab2.unshift(data);
                  this._Subjectval2$.next(this.tab2);
                  this.shownotifier('SUCCESS');
        },
        (error) =>{
            this.shownotifier('ERROR');
        }

      );

    }



  }
