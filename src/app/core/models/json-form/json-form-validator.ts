import { IBase } from 'src/app/core/models/base.interface';

export interface IJsonFormValidator extends IBase {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}

export class JsonFormValidator implements IJsonFormValidator {
    id: number = 0;
    libelle: string;
    min?: number;
    max?: number;
    required?: boolean;
    requiredTrue?: boolean;
    email?: boolean;
    minLength?: boolean;
    maxLength?: boolean;
    pattern?: string;
    nullValidator?: boolean;
}
