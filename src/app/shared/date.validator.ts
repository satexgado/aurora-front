import { AbstractControl, ValidatorFn } from '@angular/forms';

export class DateValidators {
  static dateLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
          let date1 = c.get(dateField1).value;
          let date2 = c.get(dateField2).value;
          if(!(date1 instanceof Date)) {
            date1 = new Date(date1);
          }
          if(!(date2 instanceof Date)) {
            date2 = new Date(date2);
          }
          if ((date1 !== null && date2 !== null) && date1 > date2) {
              return validatorField;
          }
          return null;
      };
  }

  static dateMoreThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        const date1 = c.get(dateField1).value;
        const date2 = c.get(dateField2).value;
        if ((date1 !== null && date2 !== null) && date1 < date2) {
            return validatorField;
        }
        return null;
    };
}

static hourLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
        let date1 = c.get(dateField1).value;
        let date2 = c.get(dateField2).value;
        if(!(date1 instanceof Date)) {
          date1 = new Date(date1).getHours;
        }
        if(!(date2 instanceof Date)) {
          date2 = new Date(date2);
        }
        if ((date1 !== null && date2 !== null) && (date1.getHours() > date1.getHours() || (date1.getHours() == date1.getHours() && date1.getMinutes()>date2.getMinutes()))) {
            return validatorField;
        }
        return null;
    };
}

static dateLessThanWithoutTime(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
        let date1: Date = c.get(dateField1).value;
        let date2: Date = c.get(dateField2).value;
        if(!(date1 instanceof Date)) {
          date1 = new Date(date1);
        }
        if(!(date2 instanceof Date)) {
          date2 = new Date(date2);
        }
        date1.setHours(0);
        date1.setMinutes(0);
        date1.setMilliseconds(0);
        date2.setHours(0);
        date2.setMinutes(0);
        date2.setMilliseconds(0);

        if ((date1 !== null && date2 !== null) && date1 > date2) {
            return validatorField;
        }
        return null;
    };
}
}
