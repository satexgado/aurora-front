import { Injectable } from '@angular/core';
import { GedModele } from '../../models/gestion-document/ged-modele.model';
import { Factory } from '../factory';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export  enum iconSubfolder {
  nosub = '',
  svgs = '/svgs',
  svgs2 = '/svgs2',
  brand = '/brand',
  duotone = '/duotone',
  light = '/light',
  regular = '/regular',
  sharplight = '/sharp-light',
  sharpsolid = '/sharp-solid',
  sharpregular = '/sharp-regular',
  solid = '/solid',
  thin = '/thin'
}

@Injectable({
    providedIn: 'root'
})
export class GedModeleFactory extends Factory<GedModele> {
  protected readonly endpoint: string = 'ged-modeles';

  constructor() {
    super(GedModele)
  }

  public icon(subfolder: iconSubfolder = iconSubfolder.nosub): Observable<string[]> {
    return this.authAccess
      .get(`${this.url}icon${subfolder}`)
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000), take(10))),
        map(data => {
          if(!data) {
            return null;
          }
         return data;
        })
      );
  }
}
