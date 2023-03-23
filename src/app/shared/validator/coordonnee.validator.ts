import { map, switchMap } from 'rxjs/operators';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Observable, of, timer } from 'rxjs';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import { Filter } from 'src/app/shared/models/query-options/filter.model';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
export class CoordonneeValidator {
  static alreadyUsedEmailValidator(defaultVal: string = ''): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return timer(800).pipe(switchMap(()=>{
        if(control.value == defaultVal) {
          return of(null);
        }
        const service = new CrCoordonneeFactory();
        const queryOptions = new QueryOptions([
              {or: false, filters:[new Filter('email', control.value, 'eq')]},
        ]);
        return service.list(queryOptions).pipe(
          map((data) =>{
            return  data.data?.length && control.dirty ? {alreadyUsedEmail: true} : null;
            })
          );
        }
      ))
    }
  }
}
