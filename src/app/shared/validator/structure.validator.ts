import { CrServiceDefaultFactory } from 'src/app/core/services/gestion-courrier/cr-service-default';
import { map, switchMap } from 'rxjs/operators';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Observable, of, timer } from 'rxjs';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import { Filter } from 'src/app/shared/models/query-options/filter.model';

export class StructureValidator {
  static alreadyDefaultValidator(defaultVal: string = ''): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return timer(800).pipe(switchMap(()=>{
        if(control.value == defaultVal) {
          return of(null);
        }
        const service = new CrServiceDefaultFactory();
        const queryOptions = new QueryOptions([
              {or: false, filters:[new Filter('structure_id', control.value, 'eq')]},
        ]);
        return service.list(queryOptions).pipe(
          map((data) =>{
            return  data.data?.length && control.dirty ? {alreadyUsedStructure: true} : null;
            })
          );
        }
      ))
    }
  }
}
