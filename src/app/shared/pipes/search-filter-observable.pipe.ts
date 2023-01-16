import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Pipe({ name: 'searchFilterObs' })
export class SearchFilterObsPipe implements PipeTransform {

  transform(list: Observable<any[]>, filterText: string, changeIndicator: number): any {
    return list ? list.pipe(
        map(
         item => {
          if(
            item && item.length
           ) {
            return  item.filter((element) => (element.upload && element.upload.state != 'Done') || element.libelle.search(new RegExp(filterText, 'i')) > -1);
           }
           return [];
         }))
         : 
         of([]);
  }
}
