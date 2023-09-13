import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToArray'
})
export class ConvertToArrayPipe implements PipeTransform {
  transform(item: any): any {
   return (item instanceof Array) ? item : [item]
 }
}
