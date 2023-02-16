import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statutrapport'
})
export class StatutrapportPipe implements PipeTransform {

  transform(list: any[], filterType: {id: number}[]): any {
    if(!(filterType && filterType.length) ){
        return list ? list : [];
    }
  return list ? list.filter(item => filterType.map(element=>element).includes(item.statut_depot)) : [];
 }
}
