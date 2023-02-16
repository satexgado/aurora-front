import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFilter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string,$name?:any): any[any] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    if($name){
      if($name=='etablissement'){
        return items.filter(it => {
          return it.name.toLocaleLowerCase().includes(searchText);
        });
      }
      if($name=='departement'){
        return items.filter(it => {
          return it.libelle_departement.toLocaleLowerCase().includes(searchText);
        });
      }
      if($name=='pays' || $name=='ville' || $name=='assoc'){
        return items.filter(it => {
          return it.libelle.toLocaleLowerCase().includes(searchText);
        });
      }
      if($name=='hotel'){
        return items.filter(it => {
          return it.nom.toLocaleLowerCase().includes(searchText)|| it.adresse.toLocaleLowerCase().includes(searchText); 
        });
      }
      if($name=='nom2'){
        return items.filter(it => {
          return it.nom.toLocaleLowerCase().includes(searchText); 
        });
      }
      if($name=='user'){
        return items.filter(it => {
          return it.inscription.nom.toLocaleLowerCase().includes(searchText) || it.inscription.prenom.toLocaleLowerCase().includes(searchText); 
        });
      }
      if($name=='user2'){
        return items.filter(it => {
          return it.membre.nom.toLocaleLowerCase().includes(searchText) || it.membre.prenom.toLocaleLowerCase().includes(searchText); 
        });
      }
      if($name=='continent'){
        return items.filter(it => {
          return it.Libelle_Continent.toLocaleLowerCase().includes(searchText);
        });
      }
      if($name=='ticket'){
        return items.filter(it => {
          return it.courrier.objet.toLocaleLowerCase().includes(searchText); 
        });
      }
    }
    if(!$name){
      return items.filter(it => {
        return it.toLocaleLowerCase().includes(searchText);
      });
    }

   
  
  }
 
}
