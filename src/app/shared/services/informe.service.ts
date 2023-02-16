import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { NotifierService } from 'angular-notifier';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
import { ConstantPool } from '@angular/compiler';
import { NotificationService } from '../shared/notification';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class InformeService {
  _Subject$ = new Subject();
  _Subject2$ = new Subject();
  _Subject3$ = new Subject();
  _Subject4$ = new Subject();
  _Subjectacte$ = new Subject();
  _Subjectreact$ = new Subject();
  _Subjectval1$ = new Subject();
  _Subjectval2$ = new Subject();
  _Subjectpub$ = new Subject();
  private tab : any= [];
  private tab1 : any= [];
  private tab2 : any= [];
  tabValue: any;
  _tabValue$ = new Subject();
  _tabValuesimple$ = new Subject();
  message: any;

  constructor(public crud: CrudService,
    private http: HttpClient, public notifyservice: NotificationService) { }




  shownotifier($params: any) {
    if ($params == 'SUCCESS') {
      this.notifyservice.onSuccess("Opération effectuée avec succès");
    }
    if ($params == 'ERROR') {
      this.notifyservice.onError("Nous n'avons pas pu effectuer cette opération. Veuillez essayer de nouveau");
    }

  }

  //Informe Object to give a new data
  emitSubject(hote: string) {
    this.crud.get(hote).subscribe(
      (data: any) => {
        this.tab = data;
        this._Subject$.next(this.tab);

      }
    );

  }

  //Close Modal from typescript
  closeModal(element: string) {
    // $(element).modal({backdrop:'false'});
    $(element).modal('hide'); 
  }
  //Open Modal from typescript
  openModal(element: string) {
    $(element).modal('toggle');
  }

  add2(hote: string, formData: any) {

    this.crud.post(hote, formData).subscribe({
      next:(data) => {
        this.tab.push(data);
        this._Subject3$.next(this.tab);
        // this.emitSubject(hote1);
        this.shownotifier('SUCCESS');
      },
      error:() => {
        this.shownotifier('ERROR');
      }
    }

    );

  }
  add3(hote: string, formData: any) {
    this.crud.post(hote, formData).subscribe({
      next:(data) => {
        this.tab.unshift(data);
        this._Subject$.next(this.tab);
        // this.emitSubject(hote1);
        this.shownotifier('SUCCESS');
      },
      error:() => {
        this.shownotifier('ERROR');
      }
    }
    );

  }

  //Method to update and informe we have a new Data if update is succeed 
  update(hote: string, formData: any, id: any, hote1: string) {
    this.crud.put(hote, formData, id).subscribe({
      next:(data: any) => {

        this.emitSubject(hote1);
        this.shownotifier('SUCCESS');

      },
      error:() => {
        this.shownotifier('ERROR');
      }
    }
     
      );

  }

  //Method to add and informe we have a new Data who destroy if deleted is succeed 
  delete(hote: string, $id: any, hote1: string) {
    this.crud.delete(hote, $id).subscribe({
      next:(data) => {
        this.emitSubject(hote1);
        this.shownotifier('SUCCESS');
      },
      error:() => {
              //this.toastr.error(res);
              this.closeModal('#deleteModal');
              // this.shownotifier('ERROR');
              this.notifyservice.onError("Impossible d'effectuer la suppression. d'autres éléments sont associés à cet élément");
      } 
    });
  }




 

}
