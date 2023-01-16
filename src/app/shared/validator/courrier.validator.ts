import { CrCourrierFactory } from 'src/app/core/services/gestion-courrier/cr-courrier';
import { map, switchMap } from 'rxjs/operators';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Observable, of, timer } from 'rxjs';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import { Filter } from 'src/app/shared/models/query-options/filter.model';
export class CourrierValidator {
  static alreadyUsedNumeroValidator(defaultVal: string = ''): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return timer(800).pipe(switchMap(()=>{
        if(control.value == defaultVal) {
          return of(null);
        }
        const service = new CrCourrierFactory();
        const queryOptions = new QueryOptions([
              {or: false, filters:[new Filter('numero', control.value, 'eq')]},
        ]);
        return service.list(queryOptions).pipe(
          map((data) =>{
            return  data.data?.length && control.dirty ? {alreadyUsedNumero: true} : null;
            })
          );
        }
      ))
    }
  }
}
