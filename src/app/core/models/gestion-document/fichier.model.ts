import { IBase } from 'src/app/core/models/base.interface';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { Upload, upload } from 'src/app/shared';
import { Observable, Subscription } from 'rxjs';
import { IUser, User } from '../user';
import { FichierType, IFichierType } from './fichier-type.model';
import { GedElement, IGedElement } from './ged-element.model';


export interface IFichier extends IBase {
  fichier: string;
  type_id: number;
  type: IFichierType;
  date: Date;
  upload$: Observable<Upload>;
  upload: Upload;
  size: number;
  ged_element: IGedElement;
  is_user: number;
  user: IUser;
  currentRequest$: Observable<Upload>;
  lastSubcription$: Subscription;
}

export class Fichier implements IFichier {
    id: number = 0;
    libelle: string = '';

    @dateAdaptableMap('created_at')
    date = new Date();
    fichier = '';
    size = null;
    is_user = 0;
    type_id: number = null;
    lastSubcription$: Subscription = null;
    currentRequest$: Observable<Upload> = null;

    @hasOneMap({field:'fichier_type', class:FichierType})
    type: IFichierType = null;

    @hasOneMap({field: 'inscription', class: User})
    user: IUser = null;

    @hasOneMap({field:'ged_element', class:GedElement})
    ged_element: IGedElement = null;

    upload = null;

    set upload$(upload: Observable<Upload>) {
      this.currentRequest$ = upload;
      this.lastSubcription$ = upload.subscribe(
        (data)=> {
          this.upload = data;
          if(data.state === 'DONE') {
            Object.assign(this, data.body);
          }
        },
        ()=>{
          this.upload = {
            progress: 100,
            state: false
          }
        }
      );
    }

    cancelSubscription() {
      if(this.lastSubcription$) {
        this.lastSubcription$.unsubscribe();
        this.upload.state = false;
      }
    }

    retryRequest() {
      if(this.currentRequest$) {
        this.upload$ = this.currentRequest$;
      }
    }
}
