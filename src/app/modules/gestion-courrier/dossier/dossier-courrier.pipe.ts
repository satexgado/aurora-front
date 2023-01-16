import { CrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { AdaptableMapper } from 'src/app/shared/decorator/adapter/adaptable-mapper';
import { ICrDossier } from 'src/app/core/models/gestion-courrier/cr-dossier';
import { Pipe, PipeTransform } from '@angular/core';
import { CrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';

@Pipe({ name: 'DossierCourrierRehab' })
export class DossierCourrierrPipe implements PipeTransform {

  transform(list: any[], filterText: string): any {
    return list ? this.map(list) : [];
  }

  map(dossier: ICrDossier[]) {
    dossier.map(
      (dos)=> {
        if(dos.courrier_entrants && dos.courrier_entrants.length) {
          let adaper1 = new AdaptableMapper(CrCourrierEntrant);
          dos.courrier_entrants = this.convertData(dos.courrier_entrants, adaper1);
        }

        if(dos.courrier_sortants && dos.courrier_sortants.length) {
          let adaper2 = new AdaptableMapper(CrCourrierSortant);
          dos.courrier_sortants = this.convertData(dos.courrier_sortants, adaper2);
        }

        return dos;
      }
    )

    return dossier;
  }

  protected convertData(data: any, adapter) {
    return data.map(item => adapter.fromSource(item));
  }

}


@Pipe({ name: 'SingleDossierCourrierRehab' })
export class SingleDossierCourrierrPipe implements PipeTransform {

  transform(list: ICrDossier, filterText: string): any {
    return list ? this.map(list) : [];
  }

  map(dossier: ICrDossier) {

        if(dossier.courrier_entrants && dossier.courrier_entrants.length) {
          let adaper1 = new AdaptableMapper(CrCourrierEntrant);
          dossier.courrier_entrants = this.convertData(dossier.courrier_entrants, adaper1);
        }

        if(dossier.courrier_sortants && dossier.courrier_sortants.length) {
          let adaper2 = new AdaptableMapper(CrCourrierSortant);
          dossier.courrier_sortants = this.convertData(dossier.courrier_sortants, adaper2);
        }

        return dossier;
  }

  protected convertData(data: any, adapter) {
    return data.map(item => adapter.fromSource(item));
  }

}

