import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marge'
})
export class MargePipe implements PipeTransform {

  transform(value:string, arg:string): any {
    let  jourmiliseconde=86399905.315173104405;
    let mydate:any;
    let datedebut=Date.parse(value);
    let datefin=Date.parse(arg);
      if(value && arg){ 
        mydate=Math.round((datefin - datedebut)/jourmiliseconde);
      }
      if(!value || !arg){
        mydate='Aucune'
      }
   
    return mydate;
  }

}
