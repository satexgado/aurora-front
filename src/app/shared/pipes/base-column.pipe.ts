import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'baseColumnFilter' })
export class BaseColumnFilterPipe implements PipeTransform {

  transform(list: any[], filters: {column: string, filterBase: number[]} [], changeIndicator: number): any {
    if(!(filters && filters.length) ){
          return list ? list : [];
    }

    filters.forEach(item=> list = this.check(list, item.column, item.filterBase));
    return list;
  }

  check(list: any[], column: string,filterBase: number[]) {
    if(!(filterBase && filterBase.length) ){
      return list ? list : [];
    }
    return list ? list.filter(item => filterBase.includes(item[column])) : [];
  }
}
