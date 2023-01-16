import { Pipe, PipeTransform } from '@angular/core';
import { CrTacheStatut, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { filter, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Pipe({ name: 'tacheStatut' })
export class TacheStatutPipe implements PipeTransform {

  transform(list: ICrTache[], filterText: string[]): any {
    return list ? list.filter(element => filterText.includes(element.statut)) : [];
  }
}


@Pipe({ name: 'tacheStatutObs' })
export class TacheStatutObsPipe implements PipeTransform {

  transform(list: Observable<any[]>, filterText: string[]): any {
    return list ? list.pipe(
      map(
       item => {
        if(
          item && item.length
         ) {
          return  item.filter(element => filterText.includes(element.statut));
         }
         return [];
       }))
       : 
       of([]);
  }
}
