import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CrudService } from './crud.service';
import { InformeService } from './informe.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  _Subject$ = new Subject();
  private tab :any= [];

  constructor(public crud: CrudService,private informe:InformeService) { }

  emitSubject(hote : string) {
    this.crud.get(hote).subscribe(
         (data: any) => {
           this.tab = data;
           this._Subject$.next(this.tab);
           
         }
       );

  }
  add(hote:string,formData : any) {
    this.crud.post(hote, formData).subscribe(
      (data) => {
                this.tab.unshift(data);
                this._Subject$.next(this.tab);
                this.informe.shownotifier('SUCCESS');
                   
      },
      (error) =>{ 
         this.informe.shownotifier('ERROR'); 
      }
    );
   
  }
    
}
