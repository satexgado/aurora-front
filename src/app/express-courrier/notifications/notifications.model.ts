import { BaseModel } from 'src/app/shared/models/BaseModel';

export interface Notification extends BaseModel {
  element: string;
  element_id: number;
  message: string;
}
