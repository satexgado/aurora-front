import { Component, OnInit } from '@angular/core';

enum ValeurEnum {
  nbmarche = 'Nombre de marches',
  budget = 'Budget',
  nbfournisseur = 'Nombre de fournisseurs',
  nbpartenaire = 'Nombre de partenaires'
}

enum GroupEnum {
  marche = 'Marche',
  service = 'Service',
  partenaire = 'Partenaire',
  fournisseur = 'Fournisseur',
  type = 'Type',
  procedure = 'Procedure',
}

enum QualiteEnum {
  mois = 'Mois',
  annee = 'Année',
  service = 'Service',
  fournisseur = 'Fournisseur',
  partenaire = 'Partenaire',
  type = 'Type',
  procedure = 'Procedure',
}

@Component({
  selector: 'app-dashboard-courrier-sortant',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardCourrierSortantComponent implements OnInit {


  valeurSelect = [
    {libelle: ValeurEnum.nbmarche, id: null},
    {libelle: ValeurEnum.budget},
    {libelle: ValeurEnum.nbfournisseur},
    {libelle: ValeurEnum.nbpartenaire},
  ];

  groupeSelect = [
    {libelle: GroupEnum.marche, id: null},
    {libelle: GroupEnum.fournisseur},
    {libelle: GroupEnum.partenaire},
    {libelle: GroupEnum.procedure},
    {libelle: GroupEnum.service},
    {libelle: GroupEnum.type},
  ];

  qualiteSelect = [
    {libelle: QualiteEnum.type, id: null},
    {libelle: QualiteEnum.mois},
    {libelle: QualiteEnum.annee},
    {libelle: QualiteEnum.fournisseur},
    {libelle: QualiteEnum.partenaire},
    {libelle: QualiteEnum.procedure},
    {libelle: QualiteEnum.service}
  ];

  multiselectConfig = {
    displayKey:"description",
    search:true ,
    height: 'auto' ,
    placeholder:'Select' ,
    customComparator: ()=>{} ,
    limitTo: 10,
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder:'Search',
    searchOnKey: 'name',
    clearOnSelection: false
  }

  charts = [];
  filter;

  constructor() { }

  ngOnInit() {
  }

  addChart()
  {
    this.charts.push({});
  }

}
