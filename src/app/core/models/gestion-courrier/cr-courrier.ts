import { ICrCourrierEtape, CrCourrierEtape } from './cr-courrier-etape';
import { ICrStatut, CrStatut } from 'src/app/core/models/gestion-courrier/cr-statut';
import { CrNature, ICrNature } from './cr-nature';
import { User, IUser } from 'src/app/core/models/user';
import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';
import { CrCoordonnee, ICrCoordonnee } from './cr-coordonnee';
import { CrType, ICrType } from './cr-type';
import { CrUrgence, ICrUrgence } from './cr-urgence';
import { ICrCloture, CrCloture } from './cr-cloture';
import { CrDossier, ICrDossier } from './cr-dossier';
import { JsonFormData } from 'src/app/modules/gestion-courrier/json-form/form/json-form2.component';
import { retrocycle } from 'src/app/shared/helperfonction';

export interface ICrCourrier extends IBase {
  objet: string;
  date_redaction: Date;
  commentaire: string;
  numero: string;
  valider: number;
  type_id: number;
  type: ICrType;
  nature_id: number;
  nature: ICrNature;
  urgence_id: number;
  urgence: ICrUrgence;
  structure_id: number;
  structure: any;
  affected_structure: IBase;
  suivi_par: number;
  suivi_par_user: IUser;
  created_by: IUser;

  statut_id: number;
  statut: ICrStatut;
  current_etape_id: number;
  current_etape: ICrCourrierEtape;
  cloture_id: number;
  cloture: ICrCloture;
  courrier_lier_id: number;
  courrier_lier: ICrCourrier;
  date_cloture: Date;
  date_limit: Date;
  message_cloture: string;
  structure_copie_traitements: any;
  structure_copie_informations: any;
  dossier_id: number;
  dossier: ICrDossier;
  additional_field: string;
  additional_jsonFormData: JsonFormData;
  link: string;
}

export class CrCourrier implements ICrCourrier {
    id: number = 0;
    libelle: string = '';
    objet: string = '';
    commentaire: string = '';
    numero: string = '';
    link: string = '';
    valider: number = 0;
    message_cloture: string = '';
    type_id: number = 0;
    nature_id: number = 0;
    urgence_id: number = 0;
    structure_id: number = 0;
    suivi_par: number = 0;
    statut_id: number = 0;
    current_etape_id: number = 0;
    cloture_id: number  = 0;
    dossier_id: number = null;
    courrier_lier_id: number = null;
    structure_copie_traitements: any = null;
    structure_copie_informations: any = null;
    structure: any = null;
    additional_field: string = '';

    get additional_jsonFormData() {
      if((!this.additional_field) || this.additional_field ==='') {
        return null;
      }
      let retro = JSON.parse(this.additional_field);
      retro = retrocycle(retro);
      return retro;
    }


    @adaptableMap('cr_reaffected_structure')
    affected_structure: any = null;

    @dateAdaptableMap('date_redaction')
    date_redaction: Date = new Date();

    @dateAdaptableMap('date_cloture')
    date_cloture: Date = new Date();

    @dateAdaptableMap('date_limit')
    date_limit: Date = new Date();

    @hasOneMap({field:'cr_type', class: CrType})
    type: ICrType = null;

    @hasOneMap({field:'cr_nature', class: CrNature})
    nature: ICrNature = null;

    @hasOneMap({field:'cr_urgence', class: CrUrgence})
    urgence: ICrUrgence = null;

    @hasOneMap({field:'cr_dossier', class: CrDossier})
    dossier: ICrDossier = null;

    @hasOneMap({field:'cr_courrier_lier', class: CrCourrier})
    courrier_lier: ICrCourrier = null;

    @hasOneMap({field:'suivi_par_inscription', class: User})
    suivi_par_user: IUser = null;

    @hasOneMap({field:'inscription', class: User})
    created_by: IUser = null;

    @hasOneMap({field:'cr_statut', class: CrStatut})
    statut: ICrStatut = null;

    @hasOneMap({field:'cr_courrier_etape', class: CrCourrierEtape})
    current_etape: ICrCourrierEtape = null;

    @hasOneMap({field:'cr_cloture', class: CrCloture})
    cloture: ICrCloture = null;
}
