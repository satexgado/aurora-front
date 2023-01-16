import { QualiteEnum, ChartType } from './chart-enumeration';

export class ChartFormData {
    valeur: string; qualite: QualiteEnum; chartType: ChartType; datasets: ChartFormDataset[];
  }
  
  export interface ChartFormDataset {
    libelle: string; couleur: string; chartType: ChartType, filters: ChartFormFilter[]
  }
  
  export interface ChartFormFilter {
    type: string, value: string;
  }