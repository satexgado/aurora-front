/*
 * Base class for the ressource
 * Convert json format from api to app resource format .
 * Usage:
 *  new Adapter().fromJson(jsonObject),
 *  new Adapter().toJson(item)
 * Example:
 *  adapter.adaptable = new Map([
 *      ['id', 'iduser'], ['libelle': 'fullname']
 *  ]) ;
 *  adapter.fromJson({iduser: 15, fullname: "Adams"}) // result {id: 15, libelle: "Adams"};
 *
*/
export interface  Adapter {
    fromJson(json: any): any;
    toJson(item: any): any;
}


export interface AdapterConstructor {
    new (): any;
}

