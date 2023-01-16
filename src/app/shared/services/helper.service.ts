import { NotificationService } from './../notification/notification.service';
import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Injectable({
    providedIn: 'root'
  })
  export class HelperService {

    constructor(protected notificationService: NotificationService) {
    }

    onShowDeleteConfirm(libelle, confirm: () => void) {
      this.notificationService.title = 'Suppréssion';

      this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + libelle;

      const cancel = () => {
      };

      this.notificationService.bodyMaxLength = 300;
      this.notificationService.backdrop =  0;
      this.notificationService.onConfirmation(confirm, cancel);

      this.notificationService.bodyMaxLength = 80;
      this.notificationService.backdrop =  -1;
    }

    isEqual (value, other) {

        // Get the value type
        var type = Object.prototype.toString.call(value);
    
        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(other)) return false;
    
        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
    
        // Compare the length of the length of the two items
        var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
        var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
        if (valueLen !== otherLen) return false;
    
    
        // Compare properties
        if (type === '[object Array]') {
            for (var i = 0; i < valueLen; i++) {
                if (this.compare(value[i], other[i]) === false) return false;
            }
        } else {
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    if (this.compare(value[key], other[key]) === false) return false;
                }
            }
        }
    
        // If nothing failed, return true
        return true;
    
    };
    compare (item1, item2) {
    
        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!this.isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };
    getDirtyState(form: FormGroup, excludeField?: Set<string> ): Object {
        return Object.keys(form.controls).reduce<Object>((dirtyState, controlKey) => {
          const control = form.controls[controlKey];

          if(!(excludeField != null && excludeField.has(controlKey)))
          {
            if (!control.dirty ) {
              return dirtyState;
            }
          } 
      
          if (control instanceof FormGroup) {
            return {
              ...dirtyState,
              [controlKey]: this.getDirtyState(control),
            };
          }
      
          return {
            ...dirtyState,
            [controlKey]: control.value,
          };
        }, {});
      }
      getDirtyStateArray(form: FormArray, excludeField?: Set<string> ): Object {
        return Object.keys(form.controls).reduce<Object>((dirtyState, controlKey) => {
          const control = form.controls[controlKey];

          if(control.value)
          if (!control.dirty) {
            return dirtyState;
          }
      
          if (control instanceof FormGroup) {
            if(excludeField == null)
            {
              return {
                ...dirtyState,
                [controlKey]: this.getDirtyState(control),
              };
            }
            return {
              ...dirtyState,
              [controlKey]: this.getDirtyState(control, excludeField),
            };
          }
      
          return {
            ...dirtyState,
            [controlKey]: control.value,
          };
        }, {});
      }
      renameKeys = (keysMap, obj) => Object
      .keys(obj)
      .reduce((acc, key) => ({
          ...acc,
          ...{ [keysMap[key] || key]: obj[key] }
      }), {});
  }