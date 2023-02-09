import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'baseColumnIdFilter' })
export class BaseColumnIdFilterPipe implements PipeTransform {

  transform(list: any[], filters: {column: string, filterBase: {id: number}[]} [], changeIndicator: number): any {
    if(!(filters && filters.length) ){
          return list ? list : [];
    }

    filters.forEach(item=> list = this.check(list, item.column, item.filterBase));
    return list;
  }

  check(list: any[], column: string,filterBase: {id: number}[]) {
    if(!(filterBase && filterBase.length) ){
      return list ? list : [];
    }
    return list ? list.filter(item => filterBase.map(element=> element.id).includes(item[column].id)) : [];
  }
}
