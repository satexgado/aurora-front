import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap, hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IMpProcedureTypeEtape, MpProcedureTypeEtape } from './type-procedure-etape.model';

export interface IMpProcedureType extends IBase {
  type_id: number;
  etapes: IMpProcedureTypeEtape[];
  type_procedure:IMpProcedureType;
  type_procedures: IMpProcedureType[];
  children: {name:string, value: IMpProcedureType[]};
  cant_delete: number;
}

export class MpProcedureType implements IMpProcedureType {
    id: number = 0;
    libelle: string = '';
    type_id: number = null;
    cant_delete: number = 0;

    @hasManyMap({field: 'mp_type_procedure_etapes', class: MpProcedureTypeEtape})
    etapes: IMpProcedureTypeEtape[] = null;

    @hasOneMap({field: 'mp_type_procedure', class: MpProcedureType})
    type_procedure: IMpProcedureType = null;

    @hasManyMap({field:'mp_type_procedures', class: MpProcedureType})
    type_procedures: IMpProcedureType[] = null;

    get children()
    {
        return {
            'name' : 'type_procedures',
            'value': this.type_procedures
        };
    }

    get titleParent() {
      return this.type_procedure ? this.type_procedure.libelle : '';
    }
}
