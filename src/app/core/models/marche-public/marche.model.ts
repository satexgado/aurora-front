import { IMpMarcheEtape, MpMarcheEtape } from './marche-etape.model';
import { IMpProcedureType, MpProcedureType } from './type-procedure.model';
import { IMpMarcheType, MpMarcheType } from './type-marche.model';
import { IBase } from 'src/app/core/models/base.interface';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { hasOneMap, hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { CrCoordonnee, ICrCoordonnee } from '../gestion-courrier/cr-coordonnee';

export interface IMpMarche extends IBase {
  date_execution: Date;
  date_fermeture: Date;
  date_creation: Date;
  fournisseur_id: number;
  fournisseur: ICrCoordonnee;
  fournisseurs: ICrCoordonnee[];
  partenaires: ICrCoordonnee[];
  type_marche_id: number;
  type_marche: IMpMarcheType;
  service_contractant_id: number;
  service_contractant: any;
  type_procedure_id: number;
  type_procedure: IMpProcedureType;
  etapes: IMpMarcheEtape[];
  structure: any;
  cout: number;
  source_financement: 'interne' | 'externe' | 'mixte';
}

export class MpMarche implements IMpMarche {
    id: number = 0;
    libelle: string = '';

    @dateAdaptableMap('created_at')
    date_creation: Date = new Date();

    @dateAdaptableMap('date_fermeture')
    date_fermeture: Date = new Date();

    @dateAdaptableMap('date_execution')
    date_execution: Date = new Date();

    type_marche_id: number = 0;
    type_procedure_id: number = 0;
    fournisseur_id: number = 0;
    service_contractant_id: number = 0;
    structure = null;
    source_financement: 'interne' | 'externe' | 'mixte' = 'interne';
    cout: number = 0;

    @hasOneMap({field: 'mp_type_marche', class: MpMarcheType})
    type_marche: IMpMarcheType = null;

    @hasOneMap({field: 'mp_type_procedure', class: MpProcedureType})
    type_procedure: IMpProcedureType = null;

    @hasOneMap({field: 'fournisseur', class: CrCoordonnee})
    fournisseur: ICrCoordonnee = null;

    @adaptableMap('structure')
    service_contractant: any = null;

    @hasManyMap({field: 'mp_marche_etapes', class: MpMarcheEtape})
    etapes: IMpMarcheEtape[] = null;

    @hasManyMap({field: 'fournisseurs', class: CrCoordonnee})
    fournisseurs: ICrCoordonnee[] = null;

    @hasManyMap({field: 'partenaires', class: CrCoordonnee})
    partenaires: ICrCoordonnee[] = null;
}
