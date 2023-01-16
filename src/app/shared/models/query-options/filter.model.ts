export class Filter {
  key:string; value: any; operator: string; not?: boolean;

  constructor(key:string, value: any, operator: string, not = false){
    this.value = value;
    this.key= key;
    this.operator = operator;
    if(not)
    {
      this.not = not;
    }
  }
}
